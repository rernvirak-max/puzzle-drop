import { describe, expect, it } from "vitest";
import { fallIntervalMs, pointsForLock } from "./scoring";

describe("scoring", () => {
  it("pays a base score and a rising combo bonus", () => {
    expect(pointsForLock(3, 1)).toBe(300);
    expect(pointsForLock(3, 2)).toBe(450);
    expect(pointsForLock(3, 3)).toBe(600);
    expect(pointsForLock(5, 1)).toBe(500);
  });

  it("speeds the fall as more of the board is locked", () => {
    const empty = fallIntervalMs(0, 9);
    const half = fallIntervalMs(4, 9);
    const full = fallIntervalMs(9, 9);
    expect(empty).toBeGreaterThan(half);
    expect(half).toBeGreaterThan(full);
    expect(full).toBeLessThan(300);
    expect(empty).toBeGreaterThan(900);
  });
});
