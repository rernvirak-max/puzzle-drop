import { MAX_LIVES, WIN_BONUS, fallIntervalMs, pointsForLock } from "./scoring";
import type {
  ActivePiece,
  CreateGameOptions,
  GameEvent,
  GamePhase,
  GameSnapshot,
  Piece,
  QuarterTurns
} from "./types";

export interface PuzzleGame {
  readonly rows: number;
  readonly cols: number;
  readonly phase: GamePhase;
  readonly score: number;
  snapshot(): GameSnapshot;
  tick(): GameEvent[];
  moveLeft(): boolean;
  moveRight(): boolean;
  rotate(): boolean;
  hardDrop(): GameEvent[];
  pause(): void;
  resume(): void;
  togglePause(): void;
}

/**
 * A piece locks only when it lands on its own cell, upright.
 * Gravity stops on the floor or on a locked piece, so each column
 * fills from the bottom. A wrong cell or a wrong turn costs one life
 * and the piece goes to the back of the queue.
 */
export function createGame(options: CreateGameOptions): PuzzleGame {
  const rows = requireSize(options.rows, "rows");
  const cols = requireSize(options.cols, "cols");
  const pieces = createPieces(rows, cols);
  const pieceById = new Map(pieces.map(piece => [piece.id, piece]));
  const rng = options.rng ?? Math.random;
  const rotationRoll = options.rotationRoll ?? (() => Math.floor(rng() * 4));
  const columnRoll =
    options.columnRoll ??
    ((openColumns: readonly number[]) => {
      const index = Math.floor(rng() * openColumns.length);
      return openColumns[index] ?? openColumns[0] ?? 0;
    });

  let queue = resolveQueue(pieces, options.queue, rng);
  let locked = emptyGrid(rows, cols);
  let active: ActivePiece | null = null;
  let phase: GamePhase = "playing";
  let lives = options.lives ?? MAX_LIVES;
  let score = 0;
  let combo = 0;
  let bestCombo = 0;

  function landingRow(col: number): number {
    return columnLandingRow(locked, col);
  }

  function openColumns(): number[] {
    const open: number[] = [];
    for (let col = 0; col < cols; col += 1) {
      if (landingRow(col) >= 0) open.push(col);
    }
    return open;
  }

  function canMoveTo(row: number, col: number): boolean {
    if (col < 0 || col >= cols || row >= rows) return false;
    if (row < 0) return landingRow(col) >= 0;
    const cell = locked[row]?.[col];
    if (cell) return false;
    return row <= landingRow(col);
  }

  function spawn(): string | null {
    const open = openColumns();
    const id = queue.shift();
    if (!id || open.length === 0) {
      if (id) queue.unshift(id);
      active = null;
      return null;
    }
    const rolled = columnRoll(open);
    const col = open.includes(rolled) ? rolled : (open[0] ?? 0);
    active = {
      id,
      row: -1,
      col,
      rotation: asTurns(rotationRoll())
    };
    return id;
  }

  function resolve(fromRow: number): GameEvent[] {
    if (!active) return [];
    const falling = active;
    const piece = pieceById.get(falling.id);
    active = null;
    if (!piece) return [];

    const correct =
      falling.row === piece.row &&
      falling.col === piece.col &&
      falling.rotation === 0 &&
      falling.row >= 0;

    const events: GameEvent[] = [];
    if (correct) {
      const rowCells = locked[falling.row];
      if (rowCells) rowCells[falling.col] = falling.id;
      combo += 1;
      bestCombo = Math.max(bestCombo, combo);
      score += pointsForLock(Math.max(rows, cols), combo);
      events.push({
        type: "lock",
        pieceId: falling.id,
        row: falling.row,
        col: falling.col,
        fromRow,
        rotation: falling.rotation,
        combo,
        score
      });
      if (countLocked(locked) === pieces.length) {
        score += WIN_BONUS;
        phase = "won";
        events.push({ type: "win", score });
        return events;
      }
    } else {
      combo = 0;
      lives -= 1;
      queue.push(falling.id);
      events.push({
        type: "miss",
        pieceId: falling.id,
        row: falling.row,
        col: falling.col,
        fromRow,
        rotation: falling.rotation,
        lives
      });
      if (lives <= 0) {
        phase = "lost";
        events.push({ type: "lose", score });
        return events;
      }
    }

    const spawned = spawn();
    if (spawned) events.push({ type: "spawn", pieceId: spawned });
    return events;
  }

  function playing(): boolean {
    return phase === "playing" && active !== null;
  }

  spawn();

  function snapshot(): GameSnapshot {
    const lockedCount = countLocked(locked);
    return {
      rows,
      cols,
      phase,
      lives,
      maxLives: options.lives ?? MAX_LIVES,
      score,
      combo,
      bestCombo,
      locked: locked.map(row => [...row]),
      queue: [...queue],
      active: active ? { ...active } : null,
      pieces: pieces.map(piece => ({ ...piece })),
      fallIntervalMs: fallIntervalMs(lockedCount, pieces.length),
      lockedCount,
      total: pieces.length
    };
  }

  return {
    rows,
    cols,
    get phase() {
      return phase;
    },
    get score() {
      return score;
    },
    snapshot,
    tick() {
      if (!playing() || !active) return [];
      const next = active.row + 1;
      if (canMoveTo(next, active.col)) {
        active.row = next;
        return [];
      }
      return resolve(active.row);
    },
    moveLeft() {
      return nudge(-1);
    },
    moveRight() {
      return nudge(1);
    },
    rotate() {
      if (!playing() || !active) return false;
      active.rotation = asTurns(active.rotation + 1);
      return true;
    },
    hardDrop() {
      if (!playing() || !active) return [];
      const fromRow = active.row;
      while (canMoveTo(active.row + 1, active.col)) {
        active.row += 1;
      }
      return resolve(fromRow);
    },
    pause() {
      if (phase === "playing") phase = "paused";
    },
    resume() {
      if (phase === "paused") phase = "playing";
    },
    togglePause() {
      if (phase === "playing") phase = "paused";
      else if (phase === "paused") phase = "playing";
    }
  };

  function nudge(delta: number): boolean {
    if (!playing() || !active) return false;
    const col = active.col + delta;
    if (!canMoveTo(active.row, col)) return false;
    active.col = col;
    return true;
  }
}

/** Lowest empty row a piece can rest on in this column, or -1 if it is capped. */
export function columnLandingRow(
  locked: readonly (readonly (string | null)[])[],
  col: number
): number {
  for (let row = 0; row < locked.length; row += 1) {
    if (locked[row]?.[col]) return row - 1;
  }
  return locked.length - 1;
}

export function canActiveFall(snapshot: GameSnapshot): boolean {
  const { active } = snapshot;
  if (!active) return false;
  const next = active.row + 1;
  if (next >= snapshot.rows) return false;
  if (snapshot.locked[next]?.[active.col]) return false;
  return next <= columnLandingRow(snapshot.locked, active.col);
}

export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    const current = copy[index];
    const other = copy[swap];
    if (current === undefined || other === undefined) continue;
    copy[index] = other;
    copy[swap] = current;
  }
  return copy;
}

function requireSize(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 1 || value > 8) {
    throw new Error(`${label} must be an integer from 1 to 8.`);
  }
  return value;
}

function createPieces(rows: number, cols: number): Piece[] {
  const pieces: Piece[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      pieces.push({ id: `${row}-${col}`, row, col });
    }
  }
  return pieces;
}

function emptyGrid(rows: number, cols: number): (string | null)[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );
}

function countLocked(locked: readonly (readonly (string | null)[])[]): number {
  let count = 0;
  for (const row of locked) {
    for (const cell of row) {
      if (cell) count += 1;
    }
  }
  return count;
}

function resolveQueue(
  pieces: readonly Piece[],
  supplied: readonly string[] | undefined,
  rng: () => number
): string[] {
  if (!supplied)
    return shuffle(
      pieces.map(piece => piece.id),
      rng
    );
  const expected = new Set(pieces.map(piece => piece.id));
  const unique = new Set(supplied);
  const sameSize =
    supplied.length === pieces.length && unique.size === pieces.length;
  const known = [...unique].every(id => expected.has(id));
  if (!sameSize || !known) {
    throw new Error("Queue must list each piece once.");
  }
  return [...supplied];
}

function asTurns(value: number): QuarterTurns {
  const wrapped = ((Math.floor(value) % 4) + 4) % 4;
  return wrapped as QuarterTurns;
}
