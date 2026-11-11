import { BOARD_COLS, BOARD_ROWS } from "./types";
import type { CellPos, Tile } from "./types";

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
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

export const MAX_OPEN_PICTURES = 4;
const BOARD_SLOTS = BOARD_ROWS * BOARD_COLS;

export function groupTiles(tiles: readonly Tile[]): Map<string, Tile[]> {
  const groups = new Map<string, Tile[]>();
  for (const tile of tiles) {
    const list = groups.get(tile.pictureId) ?? [];
    list.push(tile);
    groups.set(tile.pictureId, list);
  }
  return groups;
}

/** Pictures whose every tile is already on the board, whether or not they are arranged. */
export function completablePictureIds(
  boardTiles: readonly Tile[],
  reserve: readonly Tile[] = []
): string[] {
  const all = groupTiles([...boardTiles, ...reserve]);
  const onBoard = groupTiles(boardTiles);
  const ready: string[] = [];
  for (const [id, tiles] of all) {
    if ((onBoard.get(id)?.length ?? 0) === tiles.length) ready.push(id);
  }
  return ready;
}

export function selectDeal(
  source: readonly Tile[],
  rng: () => number
): { board: Tile[]; reserve: Tile[] } {
  const board: Tile[] = [];
  const reserve: Tile[] = [];
  let completes = 0;
  let open = 0;
  for (const group of shuffle([...groupTiles(source).values()], rng)) {
    const room = BOARD_SLOTS - board.length;
    if (room <= 0) {
      reserve.push(...shuffle(group, rng));
      continue;
    }
    if (completes < 2 && group.length <= room) {
      board.push(...shuffle(group, rng));
      completes += 1;
      continue;
    }
    const take = Math.min(room, group.length - 1);
    if (open >= MAX_OPEN_PICTURES || take <= 0) {
      reserve.push(...shuffle(group, rng));
      continue;
    }
    const shuffled = shuffle(group, rng);
    const count = Math.min(take, Math.max(1, Math.floor(group.length / 2)));
    board.push(...shuffled.slice(0, count));
    reserve.push(...shuffled.slice(count));
    open += 1;
  }
  while (board.length < BOARD_SLOTS && reserve.length > 0) {
    const next = reserve.shift();
    if (next) board.push(next);
  }
  return { board, reserve };
}

export interface DropPlan {
  incoming: Tile[];
  evict: Tile[];
}

/**
 * Tiles to drop into `holes`, which are listed in fill order.
 * Finishes pictures already on the board before opening new ones.
 * Evicts unrelated tiles only when that is the only way to put a whole picture on the board.
 */
export function planIncoming(
  boardTiles: readonly Tile[],
  stacks: readonly Tile[][],
  holes: readonly CellPos[]
): DropPlan {
  const reserve = stacks.flatMap(stack => [...stack]);
  const queues = stacks.map(stack => [...stack]);
  const fallback: Tile[] = [];
  for (const hole of holes) {
    const next = queues[hole.col]?.shift();
    if (next) fallback.push(next);
  }
  const all = groupTiles([...boardTiles, ...reserve]);
  const onBoard = groupTiles(boardTiles);
  const have = new Set(boardTiles.map(tile => tile.id));
  const taken = new Set<string>();
  const stillMissing = (id: string): Tile[] =>
    (all.get(id) ?? []).filter(
      tile => !have.has(tile.id) && !taken.has(tile.id)
    );
  const ready = completablePictureIds(boardTiles, reserve);
  const partials = [...onBoard.keys()]
    .filter(id => stillMissing(id).length > 0)
    .sort(
      (left, right) =>
        stillMissing(left).length - stillMissing(right).length ||
        (onBoard.get(right)?.length ?? 0) - (onBoard.get(left)?.length ?? 0)
    );
  const chosen: Tile[] = [];
  const add = (tiles: readonly Tile[], limit: number) => {
    for (const tile of tiles) {
      if (chosen.length >= limit) return;
      if (taken.has(tile.id)) continue;
      chosen.push(tile);
      taken.add(tile.id);
    }
  };
  for (const id of partials) {
    const need = stillMissing(id);
    if (need.length > 0 && need.length <= holes.length - chosen.length) {
      add(need, holes.length);
    }
  }
  const finishedPartial = partials.some(id => stillMissing(id).length === 0);
  let evict: Tile[] = [];
  if (ready.length === 0 && !finishedPartial) {
    const target =
      partials[0] ??
      [...all.keys()].find(id => (onBoard.get(id)?.length ?? 0) === 0);
    if (target) {
      const need = stillMissing(target);
      const extra = Math.max(0, need.length - (holes.length - chosen.length));
      evict = boardTiles
        .filter(tile => tile.pictureId !== target)
        .slice(0, extra);
      add(need, holes.length + evict.length);
    }
  }
  const rest = [...fallback, ...reserve].filter(tile => !taken.has(tile.id));
  add(rest, holes.length + evict.length);
  return { incoming: chosen, evict };
}

export function holeOrder(board: readonly (Tile | null)[][]): CellPos[] {
  const holes: CellPos[] = [];
  for (let col = 0; col < BOARD_COLS; col += 1) {
    for (let row = BOARD_ROWS - 1; row >= 0; row -= 1) {
      if (!board[row]?.[col]) holes.push({ row, col });
    }
  }
  return holes;
}
