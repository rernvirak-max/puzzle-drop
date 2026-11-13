import { describe, expect, it } from "vitest";
import { createLevel } from "./engine";
import { levelDef } from "./levels";
import { createMemoryStore } from "./progress";
import { SESSION_KEY, createSessionBook } from "./session";

describe("session", () => {
  it("has nothing saved for a new player", () => {
    expect(createSessionBook(createMemoryStore()).read()).toBeNull();
  });

  it("brings back the exact board after a reload", () => {
    const store = createMemoryStore();
    const state = createLevel(levelDef(3));
    createSessionBook(store).write(state, true);
    expect(createSessionBook(store).read()).toEqual({ state, playing: true });
  });

  it("forgets the board once cleared", () => {
    const store = createMemoryStore();
    const book = createSessionBook(store);
    book.write(createLevel(levelDef(1)), true);
    book.clear();
    expect(book.read()).toBeNull();
  });

  it("does not keep boards made from a one-off custom photo", () => {
    const store = createMemoryStore();
    const def = levelDef(1);
    const pictures = def.pictures.map((picture, index) =>
      index === 0 ? { ...picture, photoId: "custom" } : picture
    );
    createSessionBook(store).write(createLevel({ ...def, pictures }), true);
    expect(createSessionBook(store).read()).toBeNull();
  });

  it("ignores a damaged save", () => {
    const store = createMemoryStore();
    store.setItem(SESSION_KEY, '{"state":{"level":2,"board":[[]]}}');
    expect(createSessionBook(store).read()).toBeNull();
  });
});
