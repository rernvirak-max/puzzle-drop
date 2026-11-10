import { describe, expect, it } from "vitest";
import {
  canActiveFall,
  columnLandingRow,
  createGame,
  type PuzzleGame
} from "./engine";
import { WIN_BONUS, fallIntervalMs, pointsForLock } from "./scoring";
import type { CreateGameOptions } from "./types";

function bottomUp(rows: number, cols: number): string[] {
  const ids: string[] = [];
  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let col = 0; col < cols; col += 1) ids.push(`${row}-${col}`);
  }
  return ids;
}

function sequence(values: number[]): () => number {
  let index = 0;
  return () => {
    const value = values[Math.min(index, values.length - 1)] ?? 0;
    index += 1;
    return value;
  };
}

function game2(partial: Partial<CreateGameOptions> = {}): PuzzleGame {
  return createGame({
    rows: 2,
    cols: 2,
    queue: bottomUp(2, 2),
    rotationRoll: () => 0,
    columnRoll: () => 0,
    ...partial
  });
}

describe("createGame", () => {
  it("deals every cell once", () => {
    const game = createGame({ rows: 3, cols: 3, rng: () => 0.999 });
    const snap = game.snapshot();
    const ids = [...(snap.active ? [snap.active.id] : []), ...snap.queue];
    expect(ids).toHaveLength(9);
    expect(new Set(ids).size).toBe(9);
    expect(snap.lives).toBe(3);
    expect(snap.phase).toBe("playing");
    expect(snap.active?.row).toBe(-1);
  });

  it("rejects a queue that skips a piece", () => {
    expect(() =>
      createGame({ rows: 2, cols: 2, queue: ["1-0", "1-0", "0-0", "0-1"] })
    ).toThrow(/once/);
  });

  it("locks a piece that lands upright in its own cell", () => {
    const game = game2();
    const events = game.hardDrop();
    const snap = game.snapshot();
    expect(events[0]).toMatchObject({
      type: "lock",
      pieceId: "1-0",
      row: 1,
      col: 0,
      combo: 1
    });
    expect(snap.locked[1]?.[0]).toBe("1-0");
    expect(snap.score).toBe(pointsForLock(2, 1));
    expect(snap.fallIntervalMs).toBe(fallIntervalMs(1, 4));
    expect(snap.fallIntervalMs).toBeLessThan(fallIntervalMs(0, 4));
  });

  it("reaches the same lock by falling one row at a time", () => {
    const game = game2();
    expect(canActiveFall(game.snapshot())).toBe(true);
    expect(game.tick()).toEqual([]);
    expect(game.snapshot().active?.row).toBe(0);
    expect(game.tick()).toEqual([]);
    expect(game.snapshot().active?.row).toBe(1);
    expect(canActiveFall(game.snapshot())).toBe(false);
    const events = game.tick();
    expect(events[0]?.type).toBe("lock");
    expect(game.snapshot().locked[1]?.[0]).toBe("1-0");
  });

  it("spends one life for the wrong column and puts the piece at the back", () => {
    const game = game2({ columnRoll: () => 1 });
    const events = game.hardDrop();
    const snap = game.snapshot();
    expect(events[0]).toMatchObject({ type: "miss", pieceId: "1-0", lives: 2 });
    expect(snap.locked.flat().every(cell => cell === null)).toBe(true);
    expect(snap.combo).toBe(0);
    expect(snap.score).toBe(0);
    expect(snap.queue.at(-1)).toBe("1-0");
    expect(snap.active?.id).toBe("1-1");
    expect(snap.queue.filter(id => id === "1-0")).toHaveLength(1);
  });

  it("spends one life for the right cell turned the wrong way", () => {
    const game = game2({ rotationRoll: () => 1 });
    const events = game.hardDrop();
    expect(events[0]).toMatchObject({
      type: "miss",
      pieceId: "1-0",
      rotation: 1,
      row: 1,
      col: 0
    });
    expect(game.snapshot().locked[1]?.[0]).toBeNull();
  });

  it("builds a combo and pays a completion bonus when the picture is done", () => {
    const game = game2({
      columnRoll: sequence([0, 1, 0, 1])
    });
    game.hardDrop();
    game.hardDrop();
    game.hardDrop();
    const events = game.hardDrop();
    const snap = game.snapshot();
    const earned =
      pointsForLock(2, 1) +
      pointsForLock(2, 2) +
      pointsForLock(2, 3) +
      pointsForLock(2, 4) +
      WIN_BONUS;
    expect(snap.phase).toBe("won");
    expect(snap.score).toBe(earned);
    expect(snap.bestCombo).toBe(4);
    expect(snap.active).toBeNull();
    expect(events.at(-1)).toEqual({ type: "win", score: earned });
    expect(events.some(event => event.type === "spawn")).toBe(false);
  });

  it("resets the combo when a drop misses", () => {
    const game = game2();
    game.hardDrop();
    const missed = game.hardDrop();
    expect(missed[0]?.type).toBe("miss");
    expect(game.snapshot().combo).toBe(0);
    const locked = game.hardDrop();
    expect(locked[0]).toMatchObject({ type: "lock", combo: 1 });
  });

  it("ends the game on the last life and stops spawning", () => {
    const game = game2({ lives: 1, columnRoll: () => 1 });
    const events = game.hardDrop();
    expect(events.map(event => event.type)).toEqual(["miss", "lose"]);
    expect(game.phase).toBe("lost");
    expect(game.snapshot().active).toBeNull();
    expect(game.tick()).toEqual([]);
    expect(game.hardDrop()).toEqual([]);
    expect(game.rotate()).toBe(false);
  });

  it("refuses to leave the board or slide into a locked cell", () => {
    const game = game2({ columnRoll: sequence([0, 1]) });
    expect(game.moveLeft()).toBe(false);
    expect(game.snapshot().active?.col).toBe(0);
    game.hardDrop();
    expect(game.tick()).toEqual([]);
    expect(game.tick()).toEqual([]);
    expect(game.snapshot().active).toMatchObject({ id: "1-1", row: 1, col: 1 });
    expect(game.moveLeft()).toBe(false);
    expect(game.moveRight()).toBe(false);
    expect(game.snapshot().active?.col).toBe(1);
    expect(columnLandingRow(game.snapshot().locked, 0)).toBe(0);
  });

  it("ignores input while paused", () => {
    const game = game2();
    game.pause();
    expect(game.phase).toBe("paused");
    expect(game.tick()).toEqual([]);
    expect(game.snapshot().active?.row).toBe(-1);
    expect(game.moveRight()).toBe(false);
    expect(game.rotate()).toBe(false);
    expect(game.hardDrop()).toEqual([]);
    game.togglePause();
    expect(game.phase).toBe("playing");
    expect(game.moveRight()).toBe(true);
    expect(game.snapshot().active?.col).toBe(1);
  });

  it("rotates in quarter turns and wraps", () => {
    const game = game2({ rotationRoll: () => 3 });
    expect(game.snapshot().active?.rotation).toBe(3);
    game.rotate();
    expect(game.snapshot().active?.rotation).toBe(0);
  });
});
