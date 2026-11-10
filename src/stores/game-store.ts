import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createGame, type PuzzleGame } from "@/game/engine";
import type { GameEvent, GameSnapshot } from "@/game/types";
import { createHighScoreBook } from "@/game/high-score";
import {
  CATALOG,
  GRID_SIZES,
  publicPhoto,
  type CatalogPicture,
  type GridSize
} from "@/game/pictures";

export interface PlayPicture {
  id: string;
  title: string;
  place: string;
  src: string;
  custom: boolean;
}

export type Screen = "menu" | "playing" | "paused" | "won" | "lost";

function orderedQueue(size: number): string[] {
  const ids: string[] = [];
  for (let row = size - 1; row >= 0; row -= 1) {
    for (let col = 0; col < size; col += 1) ids.push(`${row}-${col}`);
  }
  return ids;
}

function fromCatalog(picture: CatalogPicture): PlayPicture {
  return {
    id: picture.id,
    title: picture.title,
    place: picture.place,
    src: publicPhoto(picture.file),
    custom: false
  };
}

export const useGameStore = defineStore("game", () => {
  const book = createHighScoreBook();
  const screen = ref<Screen>("menu");
  const gridSize = ref<GridSize>(3);
  const selectedId = ref(CATALOG[0]?.id ?? "");
  const custom = ref<PlayPicture | null>(null);
  const activePicture = ref<PlayPicture | null>(null);
  const snapshot = ref<GameSnapshot | null>(null);
  const recentEvents = ref<GameEvent[]>([]);
  const highScores = ref<Record<string, number>>(book.all());
  const bestThisRun = ref(0);
  const isNewBest = ref(false);
  let engine: PuzzleGame | null = null;
  let recorded = false;

  const pictures = computed(() => {
    const list = CATALOG.map(fromCatalog);
    if (custom.value) list.push(custom.value);
    return list;
  });

  const selected = computed(() => {
    return (
      pictures.value.find(picture => picture.id === selectedId.value) ??
      pictures.value[0] ??
      null
    );
  });

  function selectPicture(id: string) {
    selectedId.value = id;
  }

  function setGrid(size: GridSize) {
    gridSize.value = size;
  }

  function useCustomFile(file: File) {
    if (custom.value?.src.startsWith("blob:")) {
      URL.revokeObjectURL(custom.value.src);
    }
    const title = file.name.replace(/\.[^.]+$/, "") || "My photo";
    const picture: PlayPicture = {
      id: `custom:${file.name}:${file.size}:${file.lastModified}`,
      title,
      place: "On this phone",
      src: URL.createObjectURL(file),
      custom: true
    };
    custom.value = picture;
    selectedId.value = picture.id;
  }

  function sync(events: GameEvent[] = []) {
    snapshot.value = engine?.snapshot() ?? null;
    if (snapshot.value) screen.value = snapshot.value.phase;
    if (events.length > 0) recentEvents.value = events;
    if (events.some(event => event.type === "win" || event.type === "lose")) {
      recordScore();
    }
  }

  function recordScore() {
    if (recorded || !engine || !activePicture.value) return;
    if (engine.phase !== "won" && engine.phase !== "lost") return;
    recorded = true;
    const id = activePicture.value.id;
    const previous = book.read(id);
    const best = book.record(id, engine.score);
    bestThisRun.value = best;
    isNewBest.value = engine.score > previous && engine.score > 0;
    highScores.value = book.all();
  }

  function begin(picture: PlayPicture, ordered: boolean) {
    activePicture.value = picture;
    recorded = false;
    isNewBest.value = false;
    bestThisRun.value = book.read(picture.id);
    const size = gridSize.value;
    engine = ordered
      ? createGame({
          rows: size,
          cols: size,
          queue: orderedQueue(size),
          rotationRoll: () => 1,
          columnRoll: open => open[Math.floor(open.length / 2)] ?? 0
        })
      : createGame({ rows: size, cols: size });
    recentEvents.value = [];
    sync();
  }

  function start(picture: PlayPicture | null = selected.value) {
    if (!picture) return;
    begin(picture, false);
  }

  function startOrdered() {
    if (!import.meta.env.DEV || !selected.value) return;
    begin(selected.value, true);
  }

  function tick() {
    if (!engine) return;
    sync(engine.tick());
  }

  function moveLeft() {
    engine?.moveLeft();
    sync();
  }

  function moveRight() {
    engine?.moveRight();
    sync();
  }

  function rotate() {
    engine?.rotate();
    sync();
  }

  function hardDrop() {
    if (!engine) return;
    sync(engine.hardDrop());
  }

  function togglePause() {
    engine?.togglePause();
    sync();
  }

  function retry() {
    if (activePicture.value) start(activePicture.value);
  }

  function menu() {
    engine = null;
    snapshot.value = null;
    recentEvents.value = [];
    screen.value = "menu";
  }

  function scoreFor(id: string): number {
    return highScores.value[id] ?? 0;
  }

  return {
    screen,
    gridSize,
    gridSizes: GRID_SIZES,
    selectedId,
    selected,
    pictures,
    catalog: CATALOG,
    activePicture,
    snapshot,
    recentEvents,
    highScores,
    bestThisRun,
    isNewBest,
    selectPicture,
    setGrid,
    useCustomFile,
    start,
    startOrdered,
    tick,
    moveLeft,
    moveRight,
    rotate,
    hardDrop,
    togglePause,
    retry,
    menu,
    scoreFor
  };
});
