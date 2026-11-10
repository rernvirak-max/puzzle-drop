import { describe, expect, it } from "vitest";
import { LEVELS } from "./levels";
import { CATALOG } from "./pictures";

describe("level catalog", () => {
  it("only uses real photos and fills at least one board", () => {
    const ids = new Set(CATALOG.map(picture => picture.id));
    expect(CATALOG.length).toBeGreaterThanOrEqual(120);
    expect(LEVELS).toHaveLength(30);
    for (const level of LEVELS) {
      const tiles = level.pictures.reduce(
        (sum, picture) => sum + picture.rows * picture.cols,
        0
      );
      expect(tiles).toBeGreaterThanOrEqual(16);
      const seen = new Set<string>();
      for (const picture of level.pictures) {
        expect(ids.has(picture.photoId)).toBe(true);
        expect(seen.has(picture.photoId)).toBe(false);
        seen.add(picture.photoId);
      }
    }
  });
});
