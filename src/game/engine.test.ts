import { describe, expect, it } from "vitest";
import {
  createLevel,
  findCompletions,
  findGroups,
  hintTarget,
  isLevelClear,
  magicComplete,
  moveGroup,
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

  it("drops each reserve piece into its own slot without losing or doubling tiles", () => {
    const board = blank();
    board[2]![0] = tile("cat", 0, 0);
    board[2]![1] = tile("cat", 0, 1);
    board[3]![0] = tile("cat", 1, 0);
    board[3]![1] = tile("cat", 1, 1);
    const above = tile("keep", 0, 0);
    const lower = tile("keep", 0, 1);
    const side = tile("keep", 1, 0);
    board[0]![0] = above;
    board[1]![0] = lower;
    board[0]![2] = side;
    const first = tile("stack", 0, 0);
    const second = tile("stack", 0, 1);
    const other = tile("stack", 1, 0);
    const result = settle(state(board, [[first, second], [], [other], []]));
    const refill = result.steps.find(step => step.kind === "refill");
    expect(refill?.kind).toBe("refill");
    if (refill?.kind !== "refill") return;
    const landed = new Set<string>();
    for (const fall of refill.falls) {
      const key = `${fall.to.row},${fall.to.col}`;
      expect(landed.has(key)).toBe(false);
      landed.add(key);
      expect(refill.board[fall.to.row]?.[fall.to.col]?.id).toBe(fall.tileId);
    }
    expect(refill.falls).toEqual(
      expect.arrayContaining([
        { tileId: first.id, to: { row: 1, col: 0 }, from: { stack: 0 } },
        { tileId: second.id, to: { row: 0, col: 0 }, from: { stack: 0 } },
        { tileId: other.id, to: { row: 2, col: 2 }, from: { stack: 2 } }
      ])
    );
    const ids = result.state.board.flatMap(row =>
      row.flatMap(cell => (cell ? [cell.id] : []))
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining([
        above.id,
        lower.id,
        side.id,
        first.id,
        second.id,
        other.id
      ])
    );
    expect(ids).toHaveLength(6);
  });

  it("fills a gap left by a move with gravity and the reserve stack", () => {
    const board = blank();
    const mover = tile("mover", 0, 0);
    const below = tile("below", 0, 0);
    const side = tile("side", 0, 0);
    board[0]![0] = mover;
    board[1]![0] = below;
    board[0]![1] = side;
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      for (let col = 1; col < BOARD_COLS; col += 1) {
        if (row === 0 && col === 1) continue;
        board[row]![col] = tile(`fill-${row}-${col}`, 0, 0);
      }
    }
    const first = tile("reserve", 0, 0);
    const second = tile("reserve", 0, 1);
    const third = tile("reserve", 1, 0);
    const before = [
      ...board.flatMap(row => row.flatMap(cell => (cell ? [cell.id] : []))),
      first.id,
      second.id,
      third.id
    ];
    const result = moveGroup(
      state(board, [[first, second, third], [], [], []]),
      { row: 0, col: 0 },
      { row: 0, col: 1 }
    );
    expect(result.changed).toBe(true);
    expect(result.steps.some(step => step.kind === "refill")).toBe(true);
    expect(result.state.board.map(row => row[0]?.id ?? null)).toEqual([
      second.id,
      first.id,
      side.id,
      below.id
    ]);
    expect(result.state.board[0]![1]?.id).toBe(mover.id);
    expect(result.state.stacks[0]?.map(item => item.id)).toEqual([third.id]);
    expect(result.state.stacks[1]).toEqual([]);
    for (let col = 0; col < BOARD_COLS; col += 1) {
      let seenTile = false;
      for (let row = 0; row < BOARD_ROWS; row += 1) {
        const filled = result.state.board[row]?.[col] != null;
        if (!filled && seenTile) {
          throw new Error(`gap under a tile at ${row},${col}`);
        }
        if (filled) seenTile = true;
      }
    }
    const after = [
      ...result.state.board.flatMap(row =>
        row.flatMap(cell => (cell ? [cell.id] : []))
      ),
      ...result.state.stacks.flatMap(stack => stack.map(item => item.id))
    ];
    expect(after).toHaveLength(before.length);
    expect([...after].sort()).toEqual([...before].sort());
  });
});

describe("partial groups", () => {
  it("joins neighbours whose photo offset matches the board", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 0, 1);
    board[2]![2] = tile("cat", 1, 0);
    const groups = findGroups(board);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.cells).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 }
    ]);
  });

  it("does not join a neighbour from the wrong place in the photo", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 1, 1);
    expect(findGroups(board)).toEqual([]);
  });

  it("moves a joined pair and parks the tiles it covers in the vacated cells", () => {
    const board = blank();
    const left = tile("cat", 0, 0);
    const right = tile("cat", 0, 1);
    const coverA = tile("dog", 0, 0);
    const coverB = tile("dog", 0, 1);
    board[0]![0] = left;
    board[0]![1] = right;
    board[1]![0] = coverA;
    board[1]![1] = coverB;
    const result = moveGroup(
      state(board),
      { row: 0, col: 0 },
      { row: 1, col: 0 }
    );
    expect(result.changed).toBe(true);
    expect(result.boardAfterSwap[1]![0]?.id).toBe(left.id);
    expect(result.boardAfterSwap[1]![1]?.id).toBe(right.id);
    expect(result.boardAfterSwap[0]![0]?.id).toBe(coverA.id);
    expect(result.boardAfterSwap[0]![1]?.id).toBe(coverB.id);
  });

  it("refuses a group move that would leave the board", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 0, 1);
    const current = state(board);
    const result = moveGroup(current, { row: 0, col: 1 }, { row: 0, col: 0 });
    expect(result.changed).toBe(false);
    expect(result.state.board[0]![0]?.id).toBe(board[0]![0]?.id);
  });

  it("grows a pair into the whole picture, then clears it", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("cat", 0, 1);
    board[2]![0] = tile("cat", 1, 0);
    board[2]![1] = tile("cat", 1, 1);
    const grown = moveGroup(
      state(board),
      { row: 2, col: 0 },
      { row: 1, col: 0 }
    );
    expect(findGroups(grown.boardAfterSwap)).toEqual([
      {
        pictureId: "cat",
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 }
        ]
      }
    ]);
    expect(grown.steps.some(step => step.kind === "merge")).toBe(true);
    expect(isLevelClear(grown.state)).toBe(true);
  });

  it("joins a pair, grows it, then finishes the picture", () => {
    const board = blank();
    board[0]![0] = tile("cat", 0, 0);
    board[0]![1] = tile("bird", 0, 0);
    board[0]![2] = tile("cat", 0, 1);
    board[0]![3] = tile("dog", 0, 0);
    board[1]![0] = tile("bird", 0, 1);
    board[1]![1] = tile("cat", 1, 0);
    board[1]![2] = tile("dog", 0, 1);
    board[1]![3] = tile("cat", 1, 1);
    const joined = moveGroup(
      state(board),
      { row: 0, col: 2 },
      { row: 0, col: 1 }
    );
    expect(findGroups(joined.boardAfterSwap)).toEqual([
      {
        pictureId: "cat",
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 }
        ]
      }
    ]);
    const grown = moveGroup(
      { ...joined.state, board: joined.boardAfterSwap },
      { row: 1, col: 1 },
      { row: 1, col: 0 }
    );
    expect(findGroups(grown.boardAfterSwap)[0]?.cells).toHaveLength(3);
    const done = moveGroup(
      { ...grown.state, board: grown.boardAfterSwap },
      { row: 1, col: 3 },
      { row: 1, col: 1 }
    );
    expect(done.steps.some(step => step.kind === "merge")).toBe(true);
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
