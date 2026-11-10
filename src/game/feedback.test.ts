import { describe, expect, it } from "vitest";
import { praiseWord, starsFor } from "./feedback";

describe("feedback", () => {
  it("raises the praise as a chain continues", () => {
    expect(praiseWord(0)).toBe("Good");
    expect(praiseWord(1)).toBe("Great");
    expect(praiseWord(2)).toBe("Perfect");
    expect(praiseWord(5)).toBe("Perfect");
  });

  it("keeps a star even when both powers were used", () => {
    expect(starsFor(false, false)).toBe(3);
    expect(starsFor(true, false)).toBe(2);
    expect(starsFor(true, true)).toBe(1);
  });
});
