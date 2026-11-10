export const HIGH_SCORE_KEY = "puzzle-drop.high-scores.v1";

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface HighScoreBook {
  read(pictureId: string): number;
  record(pictureId: string, score: number): number;
  all(): Record<string, number>;
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

function readScores(store: KeyValueStore): Record<string, number> {
  try {
    const raw = store.getItem(HIGH_SCORE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const scores: Record<string, number> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        scores[id] = Math.floor(value);
      }
    }
    return scores;
  } catch {
    return {};
  }
}

export function createHighScoreBook(storage?: KeyValueStore): HighScoreBook {
  const store =
    storage ??
    (typeof localStorage === "undefined" ? createMemoryStore() : localStorage);

  return {
    all() {
      return readScores(store);
    },
    read(pictureId) {
      return readScores(store)[pictureId] ?? 0;
    },
    record(pictureId, score) {
      const scores = readScores(store);
      const previous = scores[pictureId] ?? 0;
      const next = Math.max(previous, Math.max(0, Math.floor(score)));
      scores[pictureId] = next;
      store.setItem(HIGH_SCORE_KEY, JSON.stringify(scores));
      return next;
    }
  };
}
