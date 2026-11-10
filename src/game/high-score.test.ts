import { describe, expect, it } from "vitest";
import {
  HIGH_SCORE_KEY,
  createHighScoreBook,
  createMemoryStore
} from "./high-score";

describe("high scores", () => {
  it("keeps the best score per picture", () => {
    const store = createMemoryStore();
    const book = createHighScoreBook(store);
    expect(book.read("angkor-wat")).toBe(0);
    expect(book.record("angkor-wat", 1200)).toBe(1200);
    expect(book.record("angkor-wat", 400)).toBe(1200);
    expect(book.record("bayon", 50.9)).toBe(50);
    expect(book.record("angkor-wat", 1800)).toBe(1800);
    expect(book.all()).toEqual({ "angkor-wat": 1800, bayon: 50 });
  });

  it("ignores unreadable stored data", () => {
    const store = createMemoryStore();
    store.setItem(HIGH_SCORE_KEY, "{not json");
    const book = createHighScoreBook(store);
    expect(book.all()).toEqual({});
    expect(book.record("rice-fields", 10)).toBe(10);
  });
});
