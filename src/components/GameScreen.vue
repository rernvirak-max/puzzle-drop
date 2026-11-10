<template>
  <main class="pd-play" :data-screen="screenName">
    <header class="pd-top">
      <button type="button" class="pd-brand" @click="game.goHome()">
        <span>Puzzle</span>
        <span>Drop</span>
      </button>
      <div class="pd-level-block">
        <strong>Level {{ game.levelLabel }}</strong>
        <span>{{ game.levelName }}</span>
      </div>
      <div class="pd-tools">
        <button
          type="button"
          class="pd-icon"
          :aria-label="muted ? 'Unmute' : 'Mute'"
          @click="toggleMuted()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 9h4l5-4v14l-5-4H4V9Zm11.5 3a3.5 3.5 0 0 0-1.5-2.9v5.8A3.5 3.5 0 0 0 15.5 12Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="pd-icon"
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
          class="pd-icon"
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
        <button
          type="button"
          class="pd-icon"
          aria-label="Settings"
          @click="game.openSettings()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 8.5a3.5 3.5 0 1 0 .1 7 3.5 3.5 0 0 0-.1-7Zm7.6 2.6-.9-.4a6 6 0 0 0-.4-1l.6-.8-1.4-1.4-.8.6a6 6 0 0 0-1-.4l-.4-.9h-2l-.4.9a6 6 0 0 0-1 .4l-.8-.6-1.4 1.4.6.8a6 6 0 0 0-.4 1l-.9.4v2l.9.4a6 6 0 0 0 .4 1l-.6.8 1.4 1.4.8-.6a6 6 0 0 0 1 .4l.4.9h2l.4-.9a6 6 0 0 0 1-.4l.8.6 1.4-1.4-.6-.8a6 6 0 0 0 .4-1l.9-.4v-2Z"
            />
          </svg>
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
              transform: `translateY(${(stackLayers(stack.length) - layer) * 4}px)`
            }"
          />
          <b v-if="stack.length">{{ stack.length }}</b>
        </div>
      </div>

      <div
        ref="boardEl"
        class="pd-board"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div
          v-for="slot in slots"
          :key="`${slot.row}-${slot.col}`"
          class="pd-slot"
          :class="{ 'is-target': isTarget(slot) }"
          :style="slotStyle(slot)"
        />
        <button
          v-for="placed in placedTiles"
          :key="placed.tile.id"
          type="button"
          class="pd-tile"
          :class="{
            'is-hint': isHinted(placed),
            'is-lifted': isLifted(placed),
            'is-joined': isJoined(placed),
            'is-join-right': edge(placed.row, placed.col, 0, 1),
            'is-join-left': edge(placed.row, placed.col, 0, -1),
            'is-join-down': edge(placed.row, placed.col, 1, 0),
            'is-join-up': edge(placed.row, placed.col, -1, 0),
            'is-snap': snapping.has(placed.tile.id)
          }"
          :data-tile="placed.tile.id"
          :data-row="placed.row"
          :data-col="placed.col"
          :style="tileStyle(placed)"
          @pointerdown="onPointerDown($event, placed)"
        >
          <span
            class="pd-flip"
            :class="{ 'is-turning': flipping.has(placed.tile.id) }"
          >
            <span class="pd-backface" />
            <span class="pd-front">
              <img
                :src="game.photoSrc(placed.tile.photoId)"
                alt=""
                draggable="false"
                :style="cropStyle(placed.tile)"
              />
            </span>
          </span>
        </button>

        <div
          v-if="merge"
          class="pd-merge"
          :class="{ 'is-shrinking': shrinking }"
          :style="mergeStyle"
        >
          <img :src="game.photoSrc(merge.photoId)" alt="" />
          <p v-if="showGood" class="good">{{ praise }}</p>
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
        <p class="pd-note">Pick a colour, then play.</p>
        <ThemePicker />
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
      <div class="pd-confetti" aria-hidden="true">
        <i
          v-for="piece in confetti"
          :key="piece.id"
          :style="{
            left: piece.left,
            background: piece.color,
            animationDelay: piece.delay
          }"
        />
      </div>
      <section class="pd-clear" role="dialog" aria-labelledby="clear-title">
        <p class="pd-eyebrow">Every stack is empty</p>
        <h2 id="clear-title">Level clear</h2>
        <div class="pd-stars" :aria-label="`${stars} stars`">
          <span
            v-for="index in 3"
            :key="index"
            :class="{ 'is-on': index <= stars }"
            >★</span
          >
        </div>
        <p>{{ game.levelName }} is done.</p>
        <button type="button" class="pd-gold" @click="game.nextLevel()">
          Next
        </button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ThemePicker from "@/components/ThemePicker.vue";
import {
  findGroups,
  groupAt,
  hintTarget,
  magicComplete,
  moveGroup
} from "@/game/engine";
import { praiseWord, starsFor } from "@/game/feedback";
import { scaled } from "@/game/motion";
import { muted, sfx, toggleMuted } from "@/game/sound";
import { useGameStore } from "@/stores/game-store";
import type {
  Board,
  CellPos,
  Completion,
  SettleStep,
  Tile
} from "@/game/types";
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
const cellW = ref(88);
const cellH = ref(132);
const gap = 4;
const busy = ref(false);
const merge = ref<Completion | null>(null);
const showGood = ref(false);
const shrinking = ref(false);
const praise = ref("Good");
const flipping = ref(new Set<string>());
const hover = ref<CellPos | null>(null);
const usedHint = ref(false);
const usedMagic = ref(false);
const stars = ref(3);
const confetti = Array.from({ length: 28 }, (_, id) => ({
  id,
  left: `${(id * 37) % 100}%`,
  delay: `${(id % 7) * 0.08}s`,
  color: ["#1f9d62", "#ff7a59", "#3d8bfd", "#ffe08a"][id % 4]
}));
const live = ref("");
const snapping = ref(new Set<string>());
const drag = ref<{
  anchorRow: number;
  anchorCol: number;
  members: { id: string; row: number; col: number }[];
  dx: number;
  dy: number;
  startX: number;
  startY: number;
  pointer: number;
  moved: boolean;
} | null>(null);

const strideX = computed(() => cellW.value + gap);
const strideY = computed(() => cellH.value + gap);
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(0, 1fr))`,
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
    left: `${block.originCol * strideX.value}px`,
    top: `${block.originRow * strideY.value}px`,
    width: `${block.cols * cellW.value}px`,
    height: `${block.rows * cellH.value}px`
  };
});

function stackLayers(count: number): number {
  return Math.min(count, 5);
}

function slotStyle(slot: CellPos) {
  return {
    width: `${cellW.value}px`,
    height: `${cellH.value}px`,
    transform: `translate(${slot.col * strideX.value}px, ${slot.row * strideY.value}px)`
  };
}

function edge(row: number, col: number, dRow: number, dCol: number): boolean {
  const tile = game.view.board[row]?.[col];
  const other = game.view.board[row + dRow]?.[col + dCol];
  if (!tile || !other || tile.pictureId !== other.pictureId) return false;
  return (
    other.localRow - tile.localRow === dRow &&
    other.localCol - tile.localCol === dCol
  );
}

function isJoined(placed: Placed): boolean {
  return (
    edge(placed.row, placed.col, 0, 1) ||
    edge(placed.row, placed.col, 0, -1) ||
    edge(placed.row, placed.col, 1, 0) ||
    edge(placed.row, placed.col, -1, 0)
  );
}

function shiftOf(row: number, col: number): { x: number; y: number } {
  let left = 0;
  let cursor = col;
  while (cursor > 0 && edge(row, cursor, 0, -1)) {
    left += 1;
    cursor -= 1;
  }
  let up = 0;
  cursor = row;
  while (cursor > 0 && edge(cursor, col, -1, 0)) {
    up += 1;
    cursor -= 1;
  }
  const seam = gap + 2;
  return { x: -left * seam, y: -up * seam };
}

function isLifted(placed: Placed): boolean {
  return (
    drag.value?.members.some(member => member.id === placed.tile.id) ?? false
  );
}

function tileStyle(placed: Placed) {
  const shift = shiftOf(placed.row, placed.col);
  const current = drag.value;
  const lifted = current?.members.some(member => member.id === placed.tile.id)
    ? current
    : null;
  const x = placed.col * strideX.value + shift.x + (lifted ? lifted.dx : 0);
  const y = placed.row * strideY.value + shift.y + (lifted ? lifted.dy : 0);
  return {
    width: `${cellW.value}px`,
    height: `${cellH.value}px`,
    transform: `translate(${x}px, ${y}px)`,
    zIndex: lifted ? 6 : isJoined(placed) ? 2 : 1
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

function isTarget(slot: CellPos): boolean {
  const over = hover.value;
  const current = drag.value;
  if (!over || !current) return false;
  const dRow = over.row - current.anchorRow;
  const dCol = over.col - current.anchorCol;
  if (dRow === 0 && dCol === 0) return false;
  return current.members.some(
    member => member.row + dRow === slot.row && member.col + dCol === slot.col
  );
}

function isHinted(placed: Placed): boolean {
  return game.hinting.some(
    cellPos => cellPos.row === placed.row && cellPos.col === placed.col
  );
}

function measure() {
  const board = boardEl.value;
  if (!board || board.clientWidth < 80 || board.clientHeight < 80) return;
  cellW.value = (board.clientWidth - gap * (BOARD_COLS - 1)) / BOARD_COLS;
  cellH.value = (board.clientHeight - gap * (BOARD_ROWS - 1)) / BOARD_ROWS;
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
            duration: scaled(460),
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
          duration: scaled(240),
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

function joinedCount(board: Board): number {
  return findGroups(board).reduce((sum, group) => sum + group.cells.length, 0);
}

async function userMove(from: CellPos, to: CellPos) {
  if (busy.value || game.winOpen) return;
  const beforeCount = joinedCount(game.view.board);
  const before = positions();
  const result = moveGroup(game.view, from, to);
  if (!result.changed) return;
  busy.value = true;
  const merged = result.steps.some(step => step.kind === "merge");
  const grew = joinedCount(result.boardAfterSwap) > beforeCount;
  if (grew && !merged) sfx.join();
  else sfx.swap();
  if (grew) {
    const ids = new Set<string>();
    for (const group of findGroups(result.boardAfterSwap)) {
      for (const cell of group.cells) {
        const tile = result.boardAfterSwap[cell.row]?.[cell.col];
        if (tile) ids.add(tile.id);
      }
    }
    snapping.value = ids;
    window.setTimeout(() => {
      snapping.value = new Set();
    }, scaled(320));
  }
  game.hinting = [];
  game.view = { ...game.view, board: result.boardAfterSwap };
  await glide(before, new Set());
  await play(result.steps);
  busy.value = false;
}

async function onMagic() {
  if (busy.value || game.winOpen || !game.spend("magic")) return;
  usedMagic.value = true;
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
  usedHint.value = true;
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
  let chain = 0;
  for (const step of steps) {
    if (step.kind === "merge") {
      for (const completion of step.completions) {
        praise.value = praiseWord(chain);
        chain += 1;
        merge.value = completion;
        shrinking.value = false;
        showGood.value = false;
        sfx.merge();
        await wait(scaled(160));
        showGood.value = true;
        live.value = praise.value;
        await wait(scaled(620));
        shrinking.value = true;
        await wait(scaled(380));
        showGood.value = false;
        merge.value = null;
        shrinking.value = false;
      }
    } else if (step.kind === "refill") {
      const before = positions();
      const fromStack = new Set(
        step.falls.filter(move => "stack" in move.from).map(move => move.tileId)
      );
      flipping.value = fromStack;
      game.view = { ...game.view, board: step.board, stacks: step.stacks };
      await glide(before, fromStack);
      await wait(scaled(80));
      flipping.value = new Set();
    } else if (step.kind === "win") {
      stars.value = starsFor(usedHint.value, usedMagic.value);
      live.value = "Level clear";
      sfx.clear();
      game.winOpen = true;
    }
  }
}

function cellUnder(clientX: number, clientY: number): CellPos | null {
  const board = boardEl.value;
  const current = drag.value;
  if (!board || !current) return null;
  const rect = board.getBoundingClientRect();
  const col = Math.floor((clientX - rect.left) / strideX.value);
  const row = Math.floor((clientY - rect.top) / strideY.value);
  if (row < 0 || col < 0 || row >= BOARD_ROWS || col >= BOARD_COLS) return null;
  const dRow = row - current.anchorRow;
  const dCol = col - current.anchorCol;
  const fits = current.members.every(member => {
    const nextRow = member.row + dRow;
    const nextCol = member.col + dCol;
    return (
      nextRow >= 0 &&
      nextCol >= 0 &&
      nextRow < BOARD_ROWS &&
      nextCol < BOARD_COLS
    );
  });
  return fits ? { row, col } : null;
}

function onPointerDown(event: PointerEvent, placed: Placed) {
  if (busy.value || game.winOpen || game.settingsOpen) return;
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);
  const group = groupAt(game.view.board, { row: placed.row, col: placed.col });
  const members = (group?.cells ?? [{ row: placed.row, col: placed.col }])
    .map(cell => {
      const tile = game.view.board[cell.row]?.[cell.col];
      return tile ? { id: tile.id, row: cell.row, col: cell.col } : null;
    })
    .filter(
      (member): member is { id: string; row: number; col: number } =>
        member !== null
    );
  drag.value = {
    anchorRow: placed.row,
    anchorCol: placed.col,
    members,
    dx: 0,
    dy: 0,
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
  current.dx = dx;
  current.dy = dy;
  hover.value = cellUnder(event.clientX, event.clientY);
}

async function onPointerUp(event: PointerEvent) {
  const current = drag.value;
  if (!current || event.pointerId !== current.pointer) return;
  const dest = current.moved ? cellUnder(event.clientX, event.clientY) : null;
  drag.value = null;
  hover.value = null;
  if (!dest) return;
  if (dest.row === current.anchorRow && dest.col === current.anchorCol) return;
  await userMove({ row: current.anchorRow, col: current.anchorCol }, dest);
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
  const watched = boardEl.value ?? stageEl.value;
  if (watched) {
    observer = new ResizeObserver(() => measure());
    observer.observe(watched);
    if (stageEl.value && stageEl.value !== watched)
      observer.observe(stageEl.value);
  }
  if (!import.meta.env.DEV) return;
  window.__puzzle = {
    ...window.__puzzle,
    prepare: () => game.prepareMerge(),
    armWin: () => game.armWin(),
    prepareJoin: () => game.prepareJoin(),
    swap: (rowA, colA, rowB, colB) =>
      userMove({ row: rowA, col: colA }, { row: rowB, col: colB }),
    busy: () => busy.value,
    good: () => showGood.value
  };
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
