import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createLevel, emptyBoard, oneSwapFromMerge } from "@/game/engine";
import { levelDef } from "@/game/levels";
import { CATALOG, catalogPicture, publicPhoto } from "@/game/pictures";
import { createProgressBook, type Progress } from "@/game/progress";
import type { CellPos, GameState, Tile } from "@/game/types";

export const useGameStore = defineStore("game", () => {
  const book = createProgressBook();
  const progress = ref<Progress>(book.read());
  const customUrl = ref<string | null>(null);
  const customName = ref("");
  const settingsOpen = ref(false);
  const creditsOpen = ref(false);
  const winOpen = ref(false);
  const hinting = ref<CellPos[]>([]);
  const screen = ref<"home" | "play">("home");
  const playingLevel = ref(progress.value.level);
  const view = ref<GameState>(deal(progress.value.level));

  const levelLabel = computed(() => playingLevel.value);
  const levelName = computed(
    () => levelDef(playingLevel.value).name ?? `Level ${playingLevel.value}`
  );
  const levelPack = computed(() => levelDef(playingLevel.value).pack ?? "");

  function deal(level: number): GameState {
    const template = levelDef(level);
    const pictures = template.pictures.map((picture, index) =>
      index === 0 && customUrl.value
        ? { ...picture, photoId: "custom" }
        : { ...picture }
    );
    return createLevel({ level, pictures });
  }

  function restart() {
    winOpen.value = false;
    hinting.value = [];
    view.value = deal(playingLevel.value);
  }

  function startLevel(level = progress.value.level) {
    const unlocked = Math.max(1, progress.value.level);
    playingLevel.value = Math.min(Math.max(1, level), unlocked);
    restart();
    screen.value = "play";
  }

  function goHome() {
    winOpen.value = false;
    screen.value = "home";
  }

  function photoSrc(photoId: string): string {
    if (photoId === "custom" && customUrl.value) return customUrl.value;
    const picture = catalogPicture(photoId);
    return picture ? publicPhoto(picture.file) : "";
  }

  function useCustomFile(file: File) {
    if (customUrl.value?.startsWith("blob:"))
      URL.revokeObjectURL(customUrl.value);
    customUrl.value = URL.createObjectURL(file);
    customName.value = file.name.replace(/\.[^.]+$/, "") || "My photo";
    settingsOpen.value = false;
    if (screen.value === "play") restart();
  }

  function clearCustom() {
    if (customUrl.value?.startsWith("blob:"))
      URL.revokeObjectURL(customUrl.value);
    customUrl.value = null;
    customName.value = "";
    restart();
  }

  function save(next: Progress) {
    progress.value = next;
    book.write(next);
  }

  function spend(kind: "hint" | "magic"): boolean {
    if (progress.value[kind] <= 0) return false;
    save({ ...progress.value, [kind]: progress.value[kind] - 1 });
    return true;
  }

  function nextLevel() {
    const cleared = playingLevel.value;
    const hint = progress.value.hint + 1;
    const magic = progress.value.magic + 1;
    if (cleared >= progress.value.level) {
      save({ level: progress.value.level + 1, hint, magic });
    } else {
      save({ ...progress.value, hint, magic });
    }
    goHome();
  }

  function prepareMerge(): { from: CellPos; to: CellPos } | null {
    const prepared = oneSwapFromMerge(view.value);
    if (!prepared) return null;
    view.value = prepared.state;
    hinting.value = [];
    winOpen.value = false;
    return { from: prepared.from, to: prepared.to };
  }

  function prepareJoin(): {
    join: { from: CellPos; to: CellPos };
    grow: { from: CellPos; to: CellPos };
    finish: { from: CellPos; to: CellPos };
  } {
    const cat = tileSet("angkor-wat");
    const bird = tileSet("bayon");
    const dog = tileSet("ta-prohm");
    const extra = tileSet("royal-palace");
    const board = emptyBoard();
    board[0]![0] = cat[0]![0]!;
    board[0]![1] = bird[0]![0]!;
    board[0]![2] = cat[0]![1]!;
    board[0]![3] = dog[0]![0]!;
    board[1]![0] = bird[0]![1]!;
    board[1]![1] = cat[1]![0]!;
    board[1]![2] = dog[0]![1]!;
    board[1]![3] = cat[1]![1]!;
    board[2]![0] = dog[1]![0]!;
    board[2]![1] = bird[1]![0]!;
    board[2]![2] = dog[1]![1]!;
    board[2]![3] = bird[1]![1]!;
    board[3]![0] = extra[0]![0]!;
    board[3]![1] = extra[1]![1]!;
    board[3]![2] = extra[0]![1]!;
    board[3]![3] = extra[1]![0]!;
    view.value = {
      level: playingLevel.value,
      board,
      stacks: [[], [], [], []]
    };
    winOpen.value = false;
    hinting.value = [];
    return {
      join: { from: { row: 0, col: 2 }, to: { row: 0, col: 1 } },
      grow: { from: { row: 1, col: 1 }, to: { row: 1, col: 0 } },
      finish: { from: { row: 1, col: 3 }, to: { row: 1, col: 1 } }
    };
  }

  function prepareGap(): { from: CellPos; to: CellPos } {
    const cat = tileSet("angkor-wat");
    const bird = tileSet("bayon");
    const dog = tileSet("ta-prohm");
    const extra = tileSet("royal-palace");
    const reserve = tileSet("banteay-srei");
    const board = emptyBoard();
    board[0]![0] = bird[0]![0]!;
    board[0]![1] = cat[0]![0]!;
    board[0]![2] = dog[0]![1]!;
    board[0]![3] = extra[0]![0]!;
    board[1]![1] = cat[0]![1]!;
    board[1]![2] = dog[1]![1]!;
    board[1]![3] = extra[0]![1]!;
    board[2]![0] = bird[1]![0]!;
    board[2]![1] = cat[1]![0]!;
    board[2]![2] = dog[0]![0]!;
    board[2]![3] = extra[1]![0]!;
    board[3]![0] = bird[1]![1]!;
    board[3]![1] = cat[1]![1]!;
    board[3]![2] = dog[1]![0]!;
    board[3]![3] = extra[1]![1]!;
    view.value = {
      level: playingLevel.value,
      board,
      stacks: [[reserve[0]![0]!, reserve[0]![1]!], [reserve[1]![0]!], [], []]
    };
    winOpen.value = false;
    hinting.value = [];
    return { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } };
  }

  function armWin(): { from: CellPos; to: CellPos } {
    const picture = tileSet("angkor-wat");
    const board = emptyBoard();
    board[0]![0] = picture[0]![1]!;
    board[0]![1] = picture[0]![0]!;
    board[1]![0] = picture[1]![0]!;
    board[1]![1] = picture[1]![1]!;
    view.value = {
      level: progress.value.level,
      board,
      stacks: [[], [], [], []]
    };
    winOpen.value = false;
    return { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } };
  }

  return {
    progress,
    screen,
    playingLevel,
    levelLabel,
    levelName,
    levelPack,
    customName,
    settingsOpen,
    creditsOpen,
    winOpen,
    hinting,
    view,
    catalog: CATALOG,
    photoSrc,
    startLevel,
    goHome,
    restart,
    useCustomFile,
    clearCustom,
    save,
    spend,
    nextLevel,
    prepareMerge,
    prepareJoin,
    prepareGap,
    armWin,
    openSettings() {
      settingsOpen.value = true;
    },
    closeSettings() {
      settingsOpen.value = false;
      creditsOpen.value = false;
    }
  };
});

function tileSet(photoId: string): Tile[][] {
  const rows: Tile[][] = [];
  for (let localRow = 0; localRow < 2; localRow += 1) {
    const row: Tile[] = [];
    for (let localCol = 0; localCol < 2; localCol += 1) {
      row.push({
        id: `win-${photoId}:${localRow}-${localCol}`,
        pictureId: `win-${photoId}`,
        photoId,
        localRow,
        localCol,
        pictureRows: 2,
        pictureCols: 2
      });
    }
    rows.push(row);
  }
  return rows;
}
