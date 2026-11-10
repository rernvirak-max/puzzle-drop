import { describe, expect, it } from "vitest";
import { createLevel, isLevelClear, magicComplete } from "./engine";
import { LEVELS } from "./levels";
import { completablePictureIds } from "./solvable";

function rngFor(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function ready(state: ReturnType<typeof createLevel>): number {
  const board = state.board.flat().filter(tile => tile !== null);
  return completablePictureIds(board, state.stacks.flat()).length;
}

describe("every level stays completable", () => {
  it("deals a finishable picture and can be played out for many seeds", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 6; seed += 1) {
        let state = createLevel(level, rngFor(seed * 100 + level.level));
        expect(ready(state), `${level.name} seed ${seed} deal`).toBeGreaterThan(
          0
        );
        let guard = 0;
        while (!isLevelClear(state) && guard < 40) {
          expect(
            ready(state),
            `${level.name} seed ${seed} step ${guard}`
          ).toBeGreaterThan(0);
          const next = magicComplete(state);
          expect(next.changed, `${level.name} seed ${seed} stuck`).toBe(true);
          state = next.state;
          guard += 1;
        }
        expect(isLevelClear(state), `${level.name} seed ${seed}`).toBe(true);
      }
    }
  });
});
