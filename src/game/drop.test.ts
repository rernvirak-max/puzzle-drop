import { describe, expect, it } from "vitest";
import { cellUnderCenter, landingCell } from "./drop";

describe("cellUnderCenter", () => {
  const cellW = 90;
  const cellH = 180;
  const gap = 4;

  it("picks the slot whose centre is under the tile centre", () => {
    expect(cellUnderCenter(45, 90, cellW, cellH, gap)).toEqual({
      row: 0,
      col: 0
    });
    expect(cellUnderCenter(2 * 94 + 45, 184 + 90, cellW, cellH, gap)).toEqual({
      row: 1,
      col: 2
    });
  });

  it("stays with the nearer slot when the centre is still on that side of the gap", () => {
    expect(cellUnderCenter(91, 90, cellW, cellH, gap)?.col).toBe(0);
    expect(cellUnderCenter(92, 90, cellW, cellH, gap)?.col).toBe(1);
  });

  it("rejects a centre that is off the board", () => {
    expect(cellUnderCenter(-40, 90, cellW, cellH, gap)).toBeNull();
    expect(cellUnderCenter(45, 184 * 4, cellW, cellH, gap)).toBeNull();
  });
});

describe("landingCell", () => {
  const pair = [
    { row: 0, col: 0 },
    { row: 0, col: 1 }
  ];

  it("moves a group by the grabbed tile's delta", () => {
    expect(landingCell({ row: 0, col: 0 }, { row: 1, col: 0 }, pair)).toEqual({
      row: 1,
      col: 0
    });
  });

  it("refuses a group that would leave the board", () => {
    expect(
      landingCell({ row: 0, col: 0 }, { row: 0, col: 3 }, pair)
    ).toBeNull();
  });

  it("refuses a drop on the tile's own slot", () => {
    expect(
      landingCell({ row: 0, col: 0 }, { row: 0, col: 0 }, pair)
    ).toBeNull();
  });
});
