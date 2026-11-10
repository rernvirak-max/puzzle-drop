import { describe, expect, it } from "vitest";
import {
  PROGRESS_KEY,
  createMemoryStore,
  createProgressBook,
  defaultProgress
} from "./progress";

describe("progress", () => {
  it("starts a new player on level 1 with both power-ups", () => {
    const book = createProgressBook(createMemoryStore());
    expect(book.read()).toEqual(defaultProgress());
  });

  it("remembers the level and the power-up counts", () => {
    const store = createMemoryStore();
    const book = createProgressBook(store);
    book.write({ level: 4, hint: 1, magic: 0 });
    expect(createProgressBook(store).read()).toEqual({
      level: 4,
      hint: 1,
      magic: 0
    });
  });

  it("ignores unreadable saved progress", () => {
    const store = createMemoryStore();
    store.setItem(PROGRESS_KEY, "{nope");
    expect(createProgressBook(store).read()).toEqual(defaultProgress());
  });
});
