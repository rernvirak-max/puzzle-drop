import { describe, expect, it } from "vitest";
import { coverSquare, pieceSourceRect } from "./geometry";

describe("geometry", () => {
  it("center-crops a wide photo to a square", () => {
    expect(coverSquare(1920, 1080)).toEqual({
      sx: 420,
      sy: 0,
      sw: 1080,
      sh: 1080
    });
  });

  it("center-crops a tall photo to a square", () => {
    expect(coverSquare(800, 1200)).toEqual({
      sx: 0,
      sy: 200,
      sw: 800,
      sh: 800
    });
  });

  it("tiles the crop with no gaps or overlap", () => {
    const crop = coverSquare(1080, 720);
    const rows = 3;
    const cols = 3;
    const rects = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        rects.push(pieceSourceRect(1080, 720, rows, cols, row, col));
      }
    }
    const first = rects[0];
    const last = rects[rects.length - 1];
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    if (!first || !last) return;
    expect(first.sx).toBeCloseTo(crop.sx);
    expect(first.sy).toBeCloseTo(crop.sy);
    expect(last.sx + last.sw).toBeCloseTo(crop.sx + crop.sw);
    expect(last.sy + last.sh).toBeCloseTo(crop.sy + crop.sh);
    expect(rects).toHaveLength(rows * cols);
  });
});
