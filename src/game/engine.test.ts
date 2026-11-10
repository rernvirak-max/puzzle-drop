import { describe, expect, it } from "vitest";
import {
  createLevel,
  findCompletions,
  hintTarget,
  isLevelClear,
  magicComplete,
  oneSwapFromMerge,
  settle,
  swapTiles
} from "./engine";
import type { Board, GameState, Tile } from "./types";
import { BOARD_COLS, BOARD_ROWS } from "./types";

function tile(
  pictureId: string,
  localRow: number,
  localCol: number,
  rows = 2,
  cols = 2,
  photoId = pictureId
): Tile {
  return {
    id: `${pictureId}:${localRow}-${localCol}`,
    pictureId,
    photoId,
    localRow,
    localCol,
    pictureRows: rows,
    pictureCols: cols
  };
}

function blank(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => null)
  );
}

function state(board: Board, stacks?: Tile[][]): GameState {
  return {
    level: 1,
    board,
    stacks: stacks ?? Array.from({ length: BOARD_COLS }, () => [])
  };
}

describe("swapTiles", () => {
  it("swaps any two tiles, including ones far apart", () => {
    const board = blank();
    const red = tile("red", 0, 0);
    const blue = tile("blue", 0, 0);
    board[0]![0] = red;
    board[3]![3] = blue;
    const result = swapTiles(
      state(board),
      { row: 0, col: 0 },
      { row: 3, col: 3 }
    );
    expect(result.changed).toBe(true);
    expect(result.boardAfterSwap[0]![0]?.id).toBe(blue.id);
    expect(result.boardAfterSwap[3]![3]?.id).toBe(red.id);
  });

  it("refuses a drop on an empty cell or the same cell", () => {
    const board = blank();
    board[0]![0] = tile("red", 0, 0);
    const current = state(board);
    expect(
      swapTiles(current, { row: 0, col: 0 }, { row: 0, col: 0 }).changed
    ).toBe(false);
    expect(
      swapTiles(current, { row: 0, col: 0 }, { row: 1, col: 1 }).changed
    ).toBe(false);
  });
});

describe("findCompletions", () => {
  it("detects a 2x2 in the correct order anywhere on the board", () => {
    const board = blank();
    board[1]![2] = tile("cat", 0, 0);
    board[1]![3] = tile("cat", 0, 1);
    board[2]![2] = tile("cat", 1, 0);
    board[2]![3] = tile("cat", 1, 1);
    const found = findCompletions(board);
    expect(found).toEqual([
      {
        pictureId: "cat",
        photoId: "cat",
        originRow: 1,
        originCol: 2,
        rows: 2,
        cols: 2
      }
    ]);
  });

  it("rejects a 2x2 whose tiles are in the wrong order", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 1);
    board[0]![1] = tile("cat", 0, 0);
    board[1]![0] = tile("cat", 1, 0);
    board[1]![1] = tile("cat", 1, 1);
    expect(findCompletions(board)).toEqual([]);
  });

  it("rejects a correct block that is missing a tile", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 0, 1);
    board[1]![0] = tile("cat", 1, 0);
    expect(findCompletions(board)).toEqual([]);
  });

  it("detects a wider picture only when every cell matches", () => {
    const board = blank();
    for (let col = 0; col < 3; col += 1) {
      board[2]![col] = tile("lake", 0, col, 2, 3);
      board[3]![col] = tile("lake", 1, col, 2, 3);
    }
    expect(findCompletions(board)[0]).toMatchObject({
      pictureId: "lake",
      originRow: 2,
      originCol: 0,
      rows: 2,
      cols: 3
    });
    board[3]![2] = tile("other", 0, 0);
    expect(findCompletions(board)).toEqual([]);
  });
});

describe("settle and refill", () => {
  it("drops reserve tiles into the holes and lets tiles above a gap fall down", () => {
    const board = blank();
    board[2]![0] = tile("cat", 0, 0);
    board[2]![1] = tile("cat", 0, 1);
    board[3]![0] = tile("cat", 1, 0);
    board[3]![1] = tile("cat", 1, 1);
    const above = tile("keep", 0, 0);
    const lower = tile("keep", 0, 1);
    board[0]![0] = above;
    board[1]![0] = lower;
    const first = tile("stack", 0, 0);
    const second = tile("stack", 0, 1);
    const stacks = [[first, second], [], [], []];
    const result = settle(state(board, stacks));
    const column = result.state.board.map(row => row[0]?.id ?? null);
    expect(column).toEqual([second.id, first.id, above.id, lower.id]);
    expect(result.state.stacks[0]).toEqual([]);
    expect(result.steps[0]).toMatchObject({ kind: "merge" });
    expect(result.steps[1]).toMatchObject({ kind: "refill" });
    expect(result.steps.some(step => step.kind === "win")).toBe(false);
  });

  it("wins when the last picture clears and the stacks are empty", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 0, 1);
    board[1]![0] = tile("cat", 1, 0);
    board[1]![1] = tile("cat", 1, 1);
    const result = settle(state(board));
    expect(isLevelClear(result.state)).toBe(true);
    expect(result.steps.at(-1)).toEqual({ kind: "win" });
  });

  it("does not win while a reserve stack still holds a tile", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 0, 1);
    board[1]![0] = tile("cat", 1, 0);
    board[1]![1] = tile("cat", 1, 1);
    const stacks = [[tile("later", 0, 0)], [], [], []];
    const result = settle(state(board, stacks));
    expect(isLevelClear(result.state)).toBe(false);
    expect(result.steps.some(step => step.kind === "win")).toBe(false);
    expect(result.state.board.some(row => row.some(Boolean))).toBe(true);
  });
});

describe("levels, hint, and magic", () => {
  const def = {
    level: 1,
    pictures: [
      { photoId: "a", rows: 2, cols: 2 },
      { photoId: "b", rows: 2, cols: 2 },
      { photoId: "c", rows: 2, cols: 2 },
      { photoId: "d", rows: 2, cols: 2 },
      { photoId: "e", rows: 2, cols: 2 }
    ]
  };

  it("deals a full board and parks the rest in the stacks", () => {
    let seed = 3;
    const rng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const dealt = createLevel(def, rng);
    const onBoard = dealt.board.flat().filter(Boolean);
    const stacked = dealt.stacks.flat();
    expect(onBoard).toHaveLength(16);
    expect(stacked).toHaveLength(4);
    expect(findCompletions(dealt.board)).toEqual([]);
  });

  it("highlights the tiles of one unfinished picture", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[3]![2] = tile("cat", 1, 1);
    board[1]![1] = tile("dog", 0, 0);
    const hint = hintTarget(state(board));
    expect(hint?.pictureId).toBe("cat");
    expect(hint?.cells).toEqual([
      { row: 0, col: 0 },
      { row: 3, col: 2 }
    ]);
  });

  it("magic assembles a scrambled picture and clears it", () => {
    const board = blank();
    board[0]![1] = tile("cat", 1, 0);
    board[2]![3] = tile("cat", 0, 1);
    board[3]![0] = tile("cat", 0, 0);
    board[1]![2] = tile("cat", 1, 1);
    const result = magicComplete(state(board));
    expect(result.changed).toBe(true);
    expect(result.steps.some(step => step.kind === "merge")).toBe(true);
    expect(isLevelClear(result.state)).toBe(true);
  });

  it("a single correcting swap merges the picture", () => {
    let seed = 9;
    const rng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const dealt = createLevel(def, rng);
    const prepared = oneSwapFromMerge(dealt);
    expect(prepared).not.toBeNull();
    if (!prepared) return;
    expect(findCompletions(prepared.state.board)).toEqual([]);
    const result = swapTiles(prepared.state, prepared.from, prepared.to);
    expect(result.steps.some(step => step.kind === "merge")).toBe(true);
  });
});
