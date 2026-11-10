<template>
  <main class="pd-app" :data-screen="screenName">
    <header class="pd-top">
      <button
        type="button"
        class="pd-gear"
        aria-label="Settings"
        @click="game.openSettings()"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.4 3.1-.1-1.6-2-.8a7.2 7.2 0 0 0-.8-1.4l.8-2-1.4-1.4-2 .8a7.2 7.2 0 0 0-1.4-.8l-.8-2h-2l-.8 2a7.2 7.2 0 0 0-1.4.8l-2-.8L4.7 5.8l.8 2c-.3.4-.6.9-.8 1.4l-2 .8-.1 1.6.1 1.6 2 .8c.2.5.5 1 .8 1.4l-.8 2 1.4 1.4 2-.8c.4.3.9.6 1.4.8l.8 2h2l.8-2c.5-.2 1-.5 1.4-.8l2 .8 1.4-1.4-.8-2c.3-.4.6-.9.8-1.4l2-.8.1-1.6Z"
          />
        </svg>
      </button>
      <div class="pd-level">
        <span>Level</span>
        <strong>{{ game.levelLabel }}</strong>
      </div>
      <div class="pd-powers">
        <button
          type="button"
          class="pd-power"
          aria-label="Magic, finish one picture"
          :disabled="game.progress.magic <= 0 || busy"
          @click="onMagic"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 20 14.5 9.5l1.8 1.8L5.8 21.8 4 20Zm12.2-12.2 1.2-3.3 1.1.4-1.2 3.2-1.1-.3Zm2.6 2.4 3.3-1.2.4 1.1-3.2 1.2-.5-1.1ZM15 3.2l1.2 3.2-1.1.4L13.9 3.6l1.1-.4Zm4.8 6.2 1.2 1.2-2.2 2.2-1.2-1.2 2.2-2.2Z"
            />
            <path d="m14.2 4.2 1.1 1.1-7.6 7.6-1.1-1.1 7.6-7.6Z" />
          </svg>
          <span>{{ game.progress.magic }}</span>
        </button>
        <button
          type="button"
          class="pd-power"
          aria-label="Hint, highlight one picture"
          :disabled="game.progress.hint <= 0 || busy"
          @click="onHint"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 21h6v-1.2H9V21Zm3-19a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Zm2.2 11.2H9.8v-.7l.5-.4A5.2 5.2 0 1 1 16.4 9a5.1 5.1 0 0 1-1.7 3.1l-.5.4v.7Z"
            />
          </svg>
          <span>{{ game.progress.hint }}</span>
        </button>
      </div>
    </header>

    <div ref="stageEl" class="pd-stage">
      <div class="pd-stacks" :style="gridStyle">
        <div
          v-for="(stack, col) in game.view.stacks"
          :key="col"
          class="pd-stack"
        >
          <div
            v-for="layer in stackLayers(stack.length)"
            :key="layer"
            class="pd-back"
            :style="{
              transform: `translateY(${(stackLayers(stack.length) - layer) * 13}px)`
            }"
          />
        </div>
      </div>

      <div
        ref="boardEl"
        class="pd-board"
        :style="{ width: `${boardWidth}px`, height: `${boardHeight}px` }"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div
          v-for="slot in slots"
          :key="`${slot.row}-${slot.col}`"
          class="pd-slot"
          :style="slotStyle(slot)"
        />
        <button
          v-for="placed in placedTiles"
          :key="placed.tile.id"
          type="button"
          class="pd-tile"
          :class="{
            'is-hint': isHinted(placed),
            'is-lifted': drag?.id === placed.tile.id
          }"
          :data-tile="placed.tile.id"
          :data-row="placed.row"
          :data-col="placed.col"
          :style="tileStyle(placed)"
          @pointerdown="onPointerDown($event, placed)"
        >
          <img
            :src="game.photoSrc(placed.tile.photoId)"
            alt=""
            draggable="false"
            :style="cropStyle(placed.tile)"
          />
        </button>

        <div
          v-if="merge"
          class="pd-merge"
          :class="{ 'is-shrinking': shrinking }"
          :style="mergeStyle"
        >
          <img :src="game.photoSrc(merge.photoId)" alt="" />
          <p v-if="showGood" class="good">Good</p>
        </div>
      </div>
    </div>

    <p class="pd-live" aria-live="polite">{{ live }}</p>

    <div
      v-if="game.settingsOpen"
      class="pd-shade"
      @click.self="game.closeSettings()"
    >
      <section class="pd-sheet" role="dialog" aria-labelledby="settings-title">
        <h2 id="settings-title">Settings</h2>
        <p class="pd-note">
          Your photo stays on this phone and replaces the first picture in the
          level.
        </p>
        <button type="button" class="pd-action" @click="pickPhoto">
          Use my photo
        </button>
        <p v-if="game.customName" class="pd-note"
          >Using {{ game.customName }}.</p
        >
        <button
          v-if="game.customName"
          type="button"
          class="pd-action pd-action-quiet"
          @click="game.clearCustom()"
        >
          Remove my photo
        </button>
        <button
          type="button"
          class="pd-action pd-action-quiet"
          @click="onRestart"
        >
          Restart level
        </button>
        <button
          type="button"
          class="pd-text"
          :aria-expanded="game.creditsOpen"
          @click="game.creditsOpen = !game.creditsOpen"
        >
          Photo credits
        </button>
        <ul v-if="game.creditsOpen" class="pd-credits">
          <li v-for="picture in game.catalog" :key="picture.id">
            <strong>{{ picture.title }}</strong>
            — {{ picture.photographer }}, {{ picture.license }}.
            <a :href="picture.sourceUrl" target="_blank" rel="noreferrer"
              >Source</a
            >
          </li>
        </ul>
        <button type="button" class="pd-action" @click="game.closeSettings()">
          Close
        </button>
        <input
          ref="fileEl"
          class="pd-file"
          type="file"
          accept="image/*"
          @change="onFile"
        />
      </section>
    </div>

    <div v-if="game.winOpen" class="pd-shade">
      <section class="pd-clear" role="dialog" aria-labelledby="clear-title">
        <p class="pd-kicker">Every stack is empty</p>
        <h2 id="clear-title">Level clear</h2>
        <p
          >Level {{ game.levelLabel }} is done. Take the next one whenever you
          like.</p
        >
        <button type="button" class="pd-action" @click="game.nextLevel()">
          Next level
        </button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { hintTarget, magicComplete, swapTiles } from "@/game/engine";
import { useGameStore } from "@/stores/game-store";
import type { CellPos, Completion, SettleStep, Tile } from "@/game/types";
import { BOARD_COLS, BOARD_ROWS } from "@/game/types";

interface Placed {
  tile: Tile;
  row: number;
  col: number;
}

const game = useGameStore();
const stageEl = ref<HTMLElement | null>(null);
const boardEl = ref<HTMLElement | null>(null);
const fileEl = ref<HTMLInputElement | null>(null);
const cell = ref(78);
const gap = 6;
const busy = ref(false);
const merge = ref<Completion | null>(null);
const showGood = ref(false);
const shrinking = ref(false);
const live = ref("");
const drag = ref<{
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  pointer: number;
  moved: boolean;
} | null>(null);

const stride = computed(() => cell.value + gap);
const boardWidth = computed(
  () => BOARD_COLS * cell.value + (BOARD_COLS - 1) * gap
);
const boardHeight = computed(
  () => BOARD_ROWS * cell.value + (BOARD_ROWS - 1) * gap
);
const gridStyle = computed(() => ({
  width: `${boardWidth.value}px`,
  gridTemplateColumns: `repeat(${BOARD_COLS}, ${cell.value}px)`,
  columnGap: `${gap}px`
}));
const slots = computed(() => {
  const list: CellPos[] = [];
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) list.push({ row, col });
  }
  return list;
});
const placedTiles = computed(() => {
  const list: Placed[] = [];
  game.view.board.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile) list.push({ tile, row: rowIndex, col: colIndex });
    });
  });
  return list;
});
const screenName = computed(() => {
  if (game.winOpen) return "clear";
  if (showGood.value) return "good";
  return "play";
});
const mergeStyle = computed(() => {
  if (!merge.value) return {};
  const block = merge.value;
  return {
    left: `${block.originCol * stride.value}px`,
    top: `${block.originRow * stride.value}px`,
    width: `${block.cols * cell.value + (block.cols - 1) * gap}px`,
    height: `${block.rows * cell.value + (block.rows - 1) * gap}px`
  };
});

function stackLayers(count: number): number {
  return Math.min(count, 5);
}

function slotStyle(slot: CellPos) {
  return {
    width: `${cell.value}px`,
    height: `${cell.value}px`,
    transform: `translate(${slot.col * stride.value}px, ${slot.row * stride.value}px)`
  };
}

function tileStyle(placed: Placed) {
  const lifted = drag.value?.id === placed.tile.id ? drag.value : null;
  const x = lifted ? lifted.x : placed.col * stride.value;
  const y = lifted ? lifted.y : placed.row * stride.value;
  return {
    width: `${cell.value}px`,
    height: `${cell.value}px`,
    transform: lifted
      ? `translate(${x}px, ${y}px) scale(0.94)`
      : `translate(${x}px, ${y}px)`,
    zIndex: lifted ? 6 : 1
  };
}

function cropStyle(tile: Tile) {
  return {
    width: `${tile.pictureCols * 100}%`,
    height: `${tile.pictureRows * 100}%`,
    left: `${-tile.localCol * 100}%`,
    top: `${-tile.localRow * 100}%`
  };
}

function isHinted(placed: Placed): boolean {
  return game.hinting.some(
    cellPos => cellPos.row === placed.row && cellPos.col === placed.col
  );
}

function measure() {
  const stage = stageEl.value;
  if (!stage) return;
  const width = stage.clientWidth;
  cell.value = Math.max(
    64,
    Math.floor((width - gap * (BOARD_COLS - 1)) / BOARD_COLS)
  );
}

function positions(): Map<string, { left: number; top: number }> {
  const map = new Map<string, { left: number; top: number }>();
  const board = boardEl.value;
  if (!board) return map;
  const origin = board.getBoundingClientRect();
  for (const el of board.querySelectorAll<HTMLElement>("[data-tile]")) {
    const id = el.dataset.tile;
    if (!id) continue;
    const rect = el.getBoundingClientRect();
    map.set(id, { left: rect.left - origin.left, top: rect.top - origin.top });
  }
  return map;
}

async function glide(
  before: Map<string, { left: number; top: number }>,
  fromStack: Set<string>
) {
  await nextTick();
  const board = boardEl.value;
  if (!board) return;
  const origin = board.getBoundingClientRect();
  const animations: Animation[] = [];
  for (const el of board.querySelectorAll<HTMLElement>("[data-tile]")) {
    const id = el.dataset.tile;
    if (!id) continue;
    const rect = el.getBoundingClientRect();
    const left = rect.left - origin.left;
    const top = rect.top - origin.top;
    const distance = Math.max(rect.height + 36, top + rect.height + 20);
    if (fromStack.has(id)) {
      animations.push(
        el.animate(
          [
            { transform: `translate(${left}px, ${top - distance}px)` },
            { transform: `translate(${left}px, ${top}px)` }
          ],
          {
            duration: 460,
            easing: "cubic-bezier(.45,.05,.85,.45)",
            fill: "backwards"
          }
        )
      );
      continue;
    }
    const prev = before.get(id);
    if (!prev || (prev.left === left && prev.top === top)) continue;
    animations.push(
      el.animate(
        [
          { transform: `translate(${prev.left}px, ${prev.top}px)` },
          { transform: `translate(${left}px, ${top}px)` }
        ],
        {
          duration: 240,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "backwards"
        }
      )
    );
  }
  await Promise.all(
    animations.map(async item => {
      await item.finished.catch(() => undefined);
      item.cancel();
    })
  );
}

async function userSwap(from: CellPos, to: CellPos) {
  if (busy.value || game.winOpen) return;
  const before = positions();
  const result = swapTiles(game.view, from, to);
  if (!result.changed) return;
  busy.value = true;
  game.hinting = [];
  game.view = { ...game.view, board: result.boardAfterSwap };
  await glide(before, new Set());
  await play(result.steps);
  busy.value = false;
}

async function onMagic() {
  if (busy.value || game.winOpen || !game.spend("magic")) return;
  const before = positions();
  const result = magicComplete(game.view);
  if (!result.changed) {
    game.save({ ...game.progress, magic: game.progress.magic + 1 });
    return;
  }
  busy.value = true;
  game.hinting = [];
  game.view = { ...game.view, board: result.boardAfterSwap };
  await glide(before, new Set());
  await play(result.steps);
  busy.value = false;
}

function onHint() {
  if (busy.value || game.winOpen || !game.spend("hint")) return;
  const target = hintTarget(game.view);
  if (!target) {
    game.save({ ...game.progress, hint: game.progress.hint + 1 });
    return;
  }
  game.hinting = target.cells;
  window.setTimeout(() => {
    game.hinting = [];
  }, 3600);
}

async function play(steps: SettleStep[]) {
  for (const step of steps) {
    if (step.kind === "merge") {
      for (const completion of step.completions) {
        merge.value = completion;
        shrinking.value = false;
        showGood.value = false;
        await wait(160);
        showGood.value = true;
        live.value = "Good";
        await wait(620);
        shrinking.value = true;
        await wait(380);
        showGood.value = false;
        merge.value = null;
        shrinking.value = false;
      }
    } else if (step.kind === "refill") {
      const before = positions();
      const fromStack = new Set(
        step.falls.filter(move => "stack" in move.from).map(move => move.tileId)
      );
      game.view = { ...game.view, board: step.board, stacks: step.stacks };
      await glide(before, fromStack);
      await wait(80);
    } else if (step.kind === "win") {
      live.value = "Level clear";
      game.winOpen = true;
    }
  }
}

function onPointerDown(event: PointerEvent, placed: Placed) {
  if (busy.value || game.winOpen || game.settingsOpen) return;
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);
  drag.value = {
    id: placed.tile.id,
    row: placed.row,
    col: placed.col,
    x: placed.col * stride.value,
    y: placed.row * stride.value,
    startX: event.clientX,
    startY: event.clientY,
    pointer: event.pointerId,
    moved: false
  };
}

function onPointerMove(event: PointerEvent) {
  const current = drag.value;
  if (!current || event.pointerId !== current.pointer) return;
  const dx = event.clientX - current.startX;
  const dy = event.clientY - current.startY;
  if (Math.hypot(dx, dy) > 6) current.moved = true;
  current.x = current.col * stride.value + dx;
  current.y = current.row * stride.value + dy;
}

async function onPointerUp(event: PointerEvent) {
  const current = drag.value;
  if (!current || event.pointerId !== current.pointer) return;
  drag.value = null;
  if (!current.moved || !boardEl.value) return;
  const rect = boardEl.value.getBoundingClientRect();
  const col = Math.floor((event.clientX - rect.left) / stride.value);
  const row = Math.floor((event.clientY - rect.top) / stride.value);
  if (row < 0 || col < 0 || row >= BOARD_ROWS || col >= BOARD_COLS) return;
  if (!game.view.board[row]?.[col]) return;
  await userSwap({ row: current.row, col: current.col }, { row, col });
}

function pickPhoto() {
  fileEl.value?.click();
}

function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || !file.type.startsWith("image/")) return;
  game.useCustomFile(file);
}

function onRestart() {
  game.closeSettings();
  game.restart();
}

function wait(ms: number) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

let observer: ResizeObserver | null = null;

onMounted(() => {
  measure();
  if (stageEl.value) {
    observer = new ResizeObserver(() => measure());
    observer.observe(stageEl.value);
  }
  if (!import.meta.env.DEV) return;
  window.__puzzle = {
    prepare: () => game.prepareMerge(),
    armWin: () => game.armWin(),
    swap: (rowA, colA, rowB, colB) =>
      userSwap({ row: rowA, col: colA }, { row: rowB, col: colB }),
    busy: () => busy.value,
    good: () => showGood.value
  };
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
