export const PROGRESS_KEY = "puzzle-drop.progress.v1";
export const STARTING_POWER = 3;

export interface Progress {
  level: number;
  hint: number;
  magic: number;
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function defaultProgress(): Progress {
  return { level: 1, hint: STARTING_POWER, magic: STARTING_POWER };
}

export function createMemoryStore(): KeyValueStore {
  const data = new Map<string, string>();
  return {
    getItem(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    }
  };
}

export function createProgressBook(storage?: KeyValueStore) {
  const store =
    storage ??
    (typeof localStorage === "undefined" ? createMemoryStore() : localStorage);

  return {
    read(): Progress {
      try {
        const raw = store.getItem(PROGRESS_KEY);
        if (!raw) return defaultProgress();
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return defaultProgress();
        const record = parsed as Record<string, unknown>;
        const level =
          typeof record.level === "number" && record.level >= 1
            ? Math.floor(record.level)
            : 1;
        const hint = count(record.hint);
        const magic = count(record.magic);
        return { level, hint, magic };
      } catch {
        return defaultProgress();
      }
    },
    write(progress: Progress) {
      store.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          level: Math.max(1, Math.floor(progress.level)),
          hint: Math.max(0, Math.floor(progress.hint)),
          magic: Math.max(0, Math.floor(progress.magic))
        })
      );
    }
  };
}

function count(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return STARTING_POWER;
  }
  return Math.floor(value);
}
