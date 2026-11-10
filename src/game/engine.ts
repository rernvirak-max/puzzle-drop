import { BOARD_COLS, BOARD_ROWS } from "./types";
import type {
  Board,
  CellPos,
  Completion,
  FallMove,
  GameState,
  LevelDef,
  SettleStep,
  Tile
} from "./types";

export interface MoveResult {
  state: GameState;
  changed: boolean;
  boardAfterSwap: Board;
  steps: SettleStep[];
}

export function emptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => null)
  );
}

export function createLevel(
  def: LevelDef,
  rng: () => number = Math.random
): GameState {
  const tiles = tilesFor(def);
  let state = deal(def.level, tiles, rng);
  for (let attempt = 0; attempt < 24; attempt += 1) {
    if (findCompletions(state.board).length === 0) break;
    state = deal(def.level, tiles, rng);
  }
  return state;
}

/** Swap two face-up tiles, then clear any pictures that come together. */
export function swapTiles(
  state: GameState,
  a: CellPos,
  b: CellPos
): MoveResult {
  const left = at(state.board, a);
  const right = at(state.board, b);
  if (
    !left ||
    !right ||
    (a.row === b.row && a.col === b.col) ||
    !inside(a) ||
    !inside(b)
  ) {
    return {
      state,
      changed: false,
      boardAfterSwap: cloneBoard(state.board),
      steps: []
    };
  }
  const next = cloneState(state);
  next.board[a.row]![a.col] = right;
  next.board[b.row]![b.col] = left;
  const boardAfterSwap = cloneBoard(next.board);
  const settled = settle(next);
  return {
    state: settled.state,
    changed: true,
    boardAfterSwap,
    steps: settled.steps
  };
}

const NEIGHBORS: readonly CellPos[] = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 }
];

export interface PieceGroup {
  pictureId: string;
  cells: CellPos[];
}

/** Connected tiles of one picture whose board offset matches their photo offset. */
export function findGroups(board: Board): PieceGroup[] {
  const byPicture = new Map<
    string,
    { tile: Tile; row: number; col: number }[]
  >();
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < (board[row]?.length ?? 0); col += 1) {
      const tile = board[row]?.[col];
      if (!tile) continue;
      const list = byPicture.get(tile.pictureId) ?? [];
      list.push({ tile, row, col });
      byPicture.set(tile.pictureId, list);
    }
  }

  const groups: PieceGroup[] = [];
  for (const [pictureId, cells] of byPicture) {
    const lookup = new Map(cells.map(cell => [posKey(cell), cell]));
    const seen = new Set<string>();
    for (const start of cells) {
      const startKey = posKey(start);
      if (seen.has(startKey)) continue;
      const stack = [start];
      const component = [];
      seen.add(startKey);
      while (stack.length > 0) {
        const current = stack.pop();
        if (!current) break;
        component.push(current);
        for (const step of NEIGHBORS) {
          const next = lookup.get(
            posKey({
              row: current.row + step.row,
              col: current.col + step.col
            })
          );
          if (!next || seen.has(posKey(next))) continue;
          const localRow = next.tile.localRow - current.tile.localRow;
          const localCol = next.tile.localCol - current.tile.localCol;
          if (localRow !== step.row || localCol !== step.col) continue;
          seen.add(posKey(next));
          stack.push(next);
        }
      }
      if (component.length >= 2) {
        groups.push({
          pictureId,
          cells: component
            .map(cell => ({ row: cell.row, col: cell.col }))
            .sort(comparePos)
        });
      }
    }
  }
  return groups;
}

export function groupAt(board: Board, anchor: CellPos): PieceGroup | null {
  const tile = at(board, anchor);
  if (!tile) return null;
  const joined = findGroups(board).find(group =>
    group.cells.some(cell => samePos(cell, anchor))
  );
  if (joined) return joined;
  return { pictureId: tile.pictureId, cells: [{ ...anchor }] };
}

/**
 * Slide the group under `anchor` so that tile lands on `dest`.
 * Tiles underneath move into the cells the group leaves. Off-board moves are refused.
 */
export function moveGroup(
  state: GameState,
  anchor: CellPos,
  dest: CellPos
): MoveResult {
  const group = groupAt(state.board, anchor);
  if (!group || group.cells.length === 0) {
    return unchanged(state);
  }
  const dRow = dest.row - anchor.row;
  const dCol = dest.col - anchor.col;
  if (dRow === 0 && dCol === 0) return unchanged(state);

  const nextCells = group.cells.map(cell => ({
    row: cell.row + dRow,
    col: cell.col + dCol
  }));
  if (nextCells.some(cell => !inside(cell))) return unchanged(state);

  const next = cloneState(state);
  const moving = group.cells.map(cell => ({
    from: cell,
    tile: next.board[cell.row]?.[cell.col] ?? null
  }));
  for (const cell of group.cells) {
    const row = next.board[cell.row];
    if (row) row[cell.col] = null;
  }

  const groupKeys = new Set(group.cells.map(posKey));
  const displaced: Tile[] = [];
  for (const cell of nextCells) {
    const occupant = next.board[cell.row]?.[cell.col] ?? null;
    if (occupant && !groupKeys.has(posKey(cell))) displaced.push(occupant);
    const row = next.board[cell.row];
    if (row) row[cell.col] = null;
  }

  for (const item of moving) {
    if (!item.tile) continue;
    const row = next.board[item.from.row + dRow];
    if (row) row[item.from.col + dCol] = item.tile;
  }

  const holes: CellPos[] = [];
  const seenHoles = new Set<string>();
  for (const cell of [...group.cells, ...nextCells]) {
    const key = posKey(cell);
    if (seenHoles.has(key)) continue;
    if (next.board[cell.row]?.[cell.col]) continue;
    seenHoles.add(key);
    holes.push(cell);
  }
  if (displaced.length > holes.length) return unchanged(state);
  holes.sort(comparePos);
  for (let index = 0; index < displaced.length; index += 1) {
    const hole = holes[index];
    const tile = displaced[index];
    if (!hole || !tile) continue;
    const row = next.board[hole.row];
    if (row) row[hole.col] = tile;
  }

  const boardAfterSwap = cloneBoard(next.board);
  const settled = settle(next);
  return {
    state: settled.state,
    changed: true,
    boardAfterSwap,
    steps: settled.steps
  };
}

export function findCompletions(board: Board): Completion[] {
  const groups = new Map<string, { tile: Tile; row: number; col: number }[]>();
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row]!.length; col += 1) {
      const tile = board[row]![col];
      if (!tile) continue;
      const list = groups.get(tile.pictureId) ?? [];
      list.push({ tile, row, col });
      groups.set(tile.pictureId, list);
    }
  }

  const found: Completion[] = [];
  for (const [pictureId, cells] of groups) {
    const sample = cells[0]?.tile;
    if (!sample) continue;
    const need = sample.pictureRows * sample.pictureCols;
    if (cells.length !== need) continue;
    const anchor = cells.find(
      cell => cell.tile.localRow === 0 && cell.tile.localCol === 0
    );
    if (!anchor) continue;
    const originRow = anchor.row;
    const originCol = anchor.col;
    if (originRow + sample.pictureRows > board.length) continue;
    if (originCol + sample.pictureCols > (board[0]?.length ?? 0)) continue;
    let ordered = true;
    for (
      let localRow = 0;
      localRow < sample.pictureRows && ordered;
      localRow += 1
    ) {
      for (
        let localCol = 0;
        localCol < sample.pictureCols && ordered;
        localCol += 1
      ) {
        const tile = board[originRow + localRow]?.[originCol + localCol];
        if (
          !tile ||
          tile.pictureId !== pictureId ||
          tile.localRow !== localRow ||
          tile.localCol !== localCol
        ) {
          ordered = false;
        }
      }
    }
    if (!ordered) continue;
    found.push({
      pictureId,
      photoId: sample.photoId,
      originRow,
      originCol,
      rows: sample.pictureRows,
      cols: sample.pictureCols
    });
  }
  return found;
}

export function isLevelClear(state: GameState): boolean {
  const boardEmpty = state.board.every(row => row.every(cell => cell === null));
  const stacksEmpty = state.stacks.every(stack => stack.length === 0);
  return boardEmpty && stacksEmpty;
}

export function hintTarget(
  state: GameState
): { pictureId: string; cells: CellPos[] } | null {
  const groups = new Map<string, CellPos[]>();
  for (let row = 0; row < state.board.length; row += 1) {
    for (let col = 0; col < state.board[row]!.length; col += 1) {
      const tile = state.board[row]![col];
      if (!tile) continue;
      const list = groups.get(tile.pictureId) ?? [];
      list.push({ row, col });
      groups.set(tile.pictureId, list);
    }
  }
  const complete = new Set(
    findCompletions(state.board).map(item => item.pictureId)
  );
  let best: { pictureId: string; cells: CellPos[] } | null = null;
  for (const [pictureId, cells] of groups) {
    if (complete.has(pictureId)) continue;
    if (!best || cells.length > best.cells.length) best = { pictureId, cells };
  }
  return best;
}

/** Pull one picture into the correct order, then resolve clears and refills. */
export function magicComplete(state: GameState): MoveResult {
  const pictureId = pictureToFinish(state);
  if (!pictureId) {
    return {
      state,
      changed: false,
      boardAfterSwap: cloneBoard(state.board),
      steps: []
    };
  }
  const placed = placePicture(cloneState(state), pictureId);
  const boardAfterSwap = cloneBoard(placed.board);
  const settled = settle(placed);
  return {
    state: settled.state,
    changed: true,
    boardAfterSwap,
    steps: settled.steps
  };
}

/**
 * Rearrange the current deal so `pictureId` is one swap away from merging.
 * Used by the dev screenshot hook and covered by tests.
 */
export function oneSwapFromMerge(
  state: GameState,
  pictureId?: string
): { state: GameState; from: CellPos; to: CellPos } | null {
  const id = pictureId ?? firstPictureOnBoard(state);
  if (!id) return null;
  const sample = findTile(state, id);
  if (!sample) return null;
  if (sample.pictureRows > BOARD_ROWS || sample.pictureCols > BOARD_COLS) {
    return null;
  }
  const placed = placePicture(cloneState(state), id);
  const donor = neighborOutside(placed, {
    row: 0,
    col: 0,
    rows: sample.pictureRows,
    cols: sample.pictureCols
  });
  if (!donor) return null;
  const corner = placed.board[0]?.[0];
  if (!corner) return null;
  placed.board[0]![0] = placed.board[donor.row]?.[donor.col] ?? null;
  placed.board[donor.row]![donor.col] = corner;
  return { state: placed, from: { row: 0, col: 0 }, to: donor };
}

function boardHasHoles(board: Board): boolean {
  return board.some(row => row.some(cell => cell === null));
}

export function settle(state: GameState): {
  state: GameState;
  steps: SettleStep[];
} {
  const steps: SettleStep[] = [];
  let current = cloneState(state);
  for (let guard = 0; guard < 12; guard += 1) {
    const completions = findCompletions(current.board);
    if (completions.length === 0 && !boardHasHoles(current.board)) break;
    if (completions.length > 0) {
      steps.push({
        kind: "merge",
        completions,
        board: cloneBoard(current.board)
      });
      for (const completion of completions) {
        current = removePicture(current, completion.pictureId);
      }
    }
    const refilled = refill(current);
    if (completions.length === 0 && refilled.falls.length === 0) break;
    current = refilled.state;
    steps.push({
      kind: "refill",
      board: cloneBoard(current.board),
      stacks: current.stacks.map(stack => [...stack]),
      falls: refilled.falls
    });
  }
  if (isLevelClear(current)) steps.push({ kind: "win" });
  return { state: current, steps };
}

function tilesFor(def: LevelDef): Tile[] {
  const tiles: Tile[] = [];
  def.pictures.forEach((picture, index) => {
    const pictureId = `${def.level}-${index}-${picture.photoId}`;
    for (let localRow = 0; localRow < picture.rows; localRow += 1) {
      for (let localCol = 0; localCol < picture.cols; localCol += 1) {
        tiles.push({
          id: `${pictureId}:${localRow}-${localCol}`,
          pictureId,
          photoId: picture.photoId,
          localRow,
          localCol,
          pictureRows: picture.rows,
          pictureCols: picture.cols
        });
      }
    }
  });
  return tiles;
}

function deal(level: number, source: Tile[], rng: () => number): GameState {
  const tiles = shuffle(source, rng);
  const spots = shuffle(allSpots(), rng);
  const board = emptyBoard();
  tiles.slice(0, BOARD_ROWS * BOARD_COLS).forEach((tile, index) => {
    const spot = spots[index];
    if (!spot) return;
    board[spot.row]![spot.col] = tile;
  });
  const stacks: Tile[][] = Array.from({ length: BOARD_COLS }, () => []);
  tiles.slice(BOARD_ROWS * BOARD_COLS).forEach((tile, index) => {
    stacks[index % BOARD_COLS]!.push(tile);
  });
  return { level, board, stacks };
}

function refill(state: GameState): { state: GameState; falls: FallMove[] } {
  const board = emptyBoard();
  const stacks = state.stacks.map(stack => [...stack]);
  const falls: FallMove[] = [];
  for (let col = 0; col < BOARD_COLS; col += 1) {
    const existing: { tile: Tile; from: number }[] = [];
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      const tile = state.board[row]?.[col];
      if (tile) existing.push({ tile, from: row });
    }
    const holes = BOARD_ROWS - existing.length;
    const incoming = stacks[col]!.splice(0, holes);
    const packedAt = BOARD_ROWS - existing.length;
    existing.forEach((entry, index) => {
      const toRow = packedAt + index;
      board[toRow]![col] = entry.tile;
      if (entry.from !== toRow) {
        falls.push({
          tileId: entry.tile.id,
          to: { row: toRow, col },
          from: { row: entry.from, col }
        });
      }
    });
    let incomingIndex = 0;
    for (
      let row = BOARD_ROWS - 1;
      row >= 0 && incomingIndex < incoming.length;
      row -= 1
    ) {
      if (board[row]![col]) continue;
      const tile = incoming[incomingIndex]!;
      incomingIndex += 1;
      board[row]![col] = tile;
      falls.push({
        tileId: tile.id,
        to: { row, col },
        from: { stack: col }
      });
    }
  }
  return { state: { ...state, board, stacks }, falls };
}

function removePicture(state: GameState, pictureId: string): GameState {
  const next = cloneState(state);
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      if (next.board[row]![col]?.pictureId === pictureId) {
        next.board[row]![col] = null;
      }
    }
  }
  return next;
}

function pictureToFinish(state: GameState): string | null {
  const tally = new Map<string, { onBoard: number; total: number }>();
  const consider = (tile: Tile, onBoard: boolean) => {
    const entry = tally.get(tile.pictureId) ?? { onBoard: 0, total: 0 };
    entry.total += 1;
    if (onBoard) entry.onBoard += 1;
    tally.set(tile.pictureId, entry);
  };
  for (const row of state.board) {
    for (const tile of row) if (tile) consider(tile, true);
  }
  for (const stack of state.stacks) {
    for (const tile of stack) consider(tile, false);
  }
  let best: { id: string; onBoard: number } | null = null;
  for (const [id, entry] of tally) {
    const need = entry.total;
    const sample = findTile(state, id);
    if (!sample) continue;
    if (sample.pictureRows > BOARD_ROWS || sample.pictureCols > BOARD_COLS)
      continue;
    if (entry.onBoard !== need && entry.onBoard === 0) continue;
    if (!best || entry.onBoard > best.onBoard)
      best = { id, onBoard: entry.onBoard };
  }
  return best?.id ?? null;
}

function placePicture(state: GameState, pictureId: string): GameState {
  const sample = findTile(state, pictureId);
  if (!sample) return state;
  const origin = { row: 0, col: 0 };
  for (let localRow = 0; localRow < sample.pictureRows; localRow += 1) {
    for (let localCol = 0; localCol < sample.pictureCols; localCol += 1) {
      const pos = { row: origin.row + localRow, col: origin.col + localCol };
      const want = locateTile(
        state,
        tile =>
          tile.pictureId === pictureId &&
          tile.localRow === localRow &&
          tile.localCol === localCol
      );
      if (!want) continue;
      moveTile(state, want, pos);
    }
  }
  return state;
}

type TileLocation =
  | { kind: "board"; row: number; col: number }
  | { kind: "stack"; stack: number; index: number };

function locateTile(
  state: GameState,
  match: (tile: Tile) => boolean
): TileLocation | null {
  for (let row = 0; row < state.board.length; row += 1) {
    for (let col = 0; col < state.board[row]!.length; col += 1) {
      const tile = state.board[row]![col];
      if (tile && match(tile)) return { kind: "board", row, col };
    }
  }
  for (let stack = 0; stack < state.stacks.length; stack += 1) {
    const index = state.stacks[stack]!.findIndex(match);
    if (index >= 0) return { kind: "stack", stack, index };
  }
  return null;
}

function moveTile(state: GameState, from: TileLocation, to: CellPos): void {
  const moving =
    from.kind === "board"
      ? state.board[from.row]![from.col]
      : state.stacks[from.stack]![from.index];
  if (!moving) return;
  const occupant = state.board[to.row]?.[to.col] ?? null;
  if (occupant?.id === moving.id) return;
  state.board[to.row]![to.col] = moving;
  if (from.kind === "board") {
    state.board[from.row]![from.col] = occupant;
    return;
  }
  if (occupant) state.stacks[from.stack]![from.index] = occupant;
  else state.stacks[from.stack]!.splice(from.index, 1);
}

function neighborOutside(
  state: GameState,
  block: { row: number; col: number; rows: number; cols: number }
): CellPos | null {
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const insideBlock =
        row >= block.row &&
        row < block.row + block.rows &&
        col >= block.col &&
        col < block.col + block.cols;
      if (!insideBlock && state.board[row]![col]) return { row, col };
    }
  }
  return null;
}

function firstPictureOnBoard(state: GameState): string | null {
  for (const row of state.board) {
    for (const tile of row) if (tile) return tile.pictureId;
  }
  return null;
}

function findTile(state: GameState, pictureId: string): Tile | null {
  for (const row of state.board) {
    for (const tile of row) if (tile?.pictureId === pictureId) return tile;
  }
  for (const stack of state.stacks) {
    for (const tile of stack) if (tile.pictureId === pictureId) return tile;
  }
  return null;
}

function posKey(pos: CellPos): string {
  return `${pos.row},${pos.col}`;
}

function samePos(a: CellPos, b: CellPos): boolean {
  return a.row === b.row && a.col === b.col;
}

function comparePos(a: CellPos, b: CellPos): number {
  return a.row - b.row || a.col - b.col;
}

function unchanged(state: GameState): MoveResult {
  return {
    state,
    changed: false,
    boardAfterSwap: cloneBoard(state.board),
    steps: []
  };
}

function at(board: Board, pos: CellPos): Tile | null {
  if (!inside(pos)) return null;
  return board[pos.row]?.[pos.col] ?? null;
}

function inside(pos: CellPos): boolean {
  return (
    pos.row >= 0 && pos.col >= 0 && pos.row < BOARD_ROWS && pos.col < BOARD_COLS
  );
}

function allSpots(): CellPos[] {
  const spots: CellPos[] = [];
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) spots.push({ row, col });
  }
  return spots;
}

export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const current = copy[index];
    const other = copy[swapIndex];
    if (current === undefined || other === undefined) continue;
    copy[index] = other;
    copy[swapIndex] = current;
  }
  return copy;
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function cloneState(state: GameState): GameState {
  return {
    level: state.level,
    board: cloneBoard(state.board),
    stacks: state.stacks.map(stack => [...stack])
  };
}
