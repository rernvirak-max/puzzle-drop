import { createMemoryStore, type KeyValueStore } from "./progress";
import { BOARD_COLS, BOARD_ROWS, type GameState, type Tile } from "./types";

export const SESSION_KEY = "puzzle-drop.session.v1";

export interface SavedSession {
  state: GameState;
  playing: boolean;
}

export function createSessionBook(storage?: KeyValueStore) {
  const store =
    storage ??
    (typeof localStorage === "undefined" ? createMemoryStore() : localStorage);

  return {
    read(): SavedSession | null {
      try {
        const raw = store.getItem(SESSION_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        const record = parsed as Record<string, unknown>;
        const state = record.state as Record<string, unknown> | undefined;
        if (!state || typeof state !== "object") return null;
        if (typeof state.level !== "number" || state.level < 1) return null;
        if (!isBoard(state.board) || !isStacks(state.stacks)) return null;
        return {
          state: {
            level: Math.floor(state.level),
            board: state.board,
            stacks: state.stacks
          },
          playing: record.playing === true
        };
      } catch {
        return null;
      }
    },
    write(state: GameState, playing: boolean) {
      if (usesCustomPhoto(state)) {
        store.setItem(SESSION_KEY, "");
        return;
      }
      store.setItem(SESSION_KEY, JSON.stringify({ state, playing }));
    },
    clear() {
      store.setItem(SESSION_KEY, "");
    }
  };
}

function usesCustomPhoto(state: GameState): boolean {
  const tiles = [...state.board.flat(), ...state.stacks.flat()];
  return tiles.some(tile => tile?.photoId === "custom");
}

function isBoard(value: unknown): value is (Tile | null)[][] {
  return (
    Array.isArray(value) &&
    value.length === BOARD_ROWS &&
    value.every(
      row =>
        Array.isArray(row) &&
        row.length === BOARD_COLS &&
        row.every(cell => cell === null || isTile(cell))
    )
  );
}

function isStacks(value: unknown): value is Tile[][] {
  return (
    Array.isArray(value) &&
    value.length === BOARD_COLS &&
    value.every(stack => Array.isArray(stack) && stack.every(isTile))
  );
}

function isTile(value: unknown): value is Tile {
  if (!value || typeof value !== "object") return false;
  const tile = value as Record<string, unknown>;
  return (
    typeof tile.id === "string" &&
    typeof tile.pictureId === "string" &&
    typeof tile.photoId === "string" &&
    typeof tile.localRow === "number" &&
    typeof tile.localCol === "number" &&
    typeof tile.pictureRows === "number" &&
    typeof tile.pictureCols === "number"
  );
}
