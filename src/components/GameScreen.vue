<template>
  <main class="pd-play" :class="{ 'is-busy': busy }" :data-screen="screenName">
    <header class="pd-top">
      <button type="button" class="pd-brand" @click="game.goHome()">
        <img class="pd-logo pd-logo-sm" src="/icons/icon-192x192.png" alt="" />
        <span class="pd-brand-text">
          <span>Kam</span>
          <span>puzzle</span>
        </span>
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
          :data-slot-row="slot.row"
          :data-slot-col="slot.col"
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
            :style="flipDelay(placed.tile.id)"
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
import { cellUnderCenter, landingCell } from "@/game/drop";
import { praiseWord, starsFor } from "@/game/feedback";
import {
  EASE_GRAVITY,
  EASE_OUT,
  EASE_SPRING,
  scaled,
  scaledDelay
} from "@/game/motion";
import { muted, sfx, toggleMuted } from "@/game/sound";
import { useGameStore } from "@/stores/game-store";
import type {
  Board,
  CellPos,
  Completion,
  FallMove,
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
const dropDelay = ref<Record<string, number>>({});
const LIFT = 10;
const dragMotion = { dx: 0, dy: 0 };

interface Point {
  x: number;
  y: number;
}
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
    width: `${block.cols * cellW.value + (block.cols - 1) * gap}px`,
    height: `${block.rows * cellH.value + (block.rows - 1) * gap}px`
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

function isLifted(placed: Placed): boolean {
  return (
    drag.value?.members.some(member => member.id === placed.tile.id) ?? false
  );
}

function originOf(row: number, col: number): Point {
  return {
    x: col * strideX.value,
    y: row * strideY.value
  };
}

function pose(point: Point, scale = 1): string {
  const translate = `translate(${point.x}px, ${point.y}px)`;
  return scale === 1 ? translate : `${translate} scale(${scale})`;
}

function isDragged(id: string): boolean {
  return drag.value?.members.some(member => member.id === id) ?? false;
}

function visualOf(row: number, col: number, id: string): Point {
  const home = originOf(row, col);
  if (!isDragged(id)) return home;
  return { x: home.x + dragMotion.dx, y: home.y + dragMotion.dy - LIFT };
}

function tileStyle(placed: Placed) {
  const point = visualOf(placed.row, placed.col, placed.tile.id);
  const lifted = isDragged(placed.tile.id);
  const falling = flipping.value.has(placed.tile.id);
  return {
    width: `${cellW.value}px`,
    height: `${cellH.value}px`,
    transform: pose(point, lifted ? 1.045 : 1),
    zIndex: lifted ? 6 : falling ? 5 : 1
  };
}

function flipDelay(id: string): { animationDelay: string } | undefined {
  const delay = dropDelay.value[id];
  return delay ? { animationDelay: `${delay}ms` } : undefined;
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

function captureVisual(): Map<string, Point> {
  const map = new Map<string, Point>();
  for (const placed of placedTiles.value) {
    map.set(placed.tile.id, visualOf(placed.row, placed.col, placed.tile.id));
  }
  return map;
}

function tileElement(id: string): HTMLElement | null {
  const board = boardEl.value;
  if (!board) return null;
  return board.querySelector<HTMLElement>(`[data-tile="${CSS.escape(id)}"]`);
}

function stopTileMotion() {
  boardEl.value?.querySelectorAll(".pd-tile").forEach(el => {
    el.getAnimations().forEach(animation => animation.cancel());
  });
}

function stackOrigin(col: number): Point {
  const board = boardEl.value;
  const pile = stageEl.value?.querySelectorAll<HTMLElement>(".pd-stack")[col];
  if (!board || !pile)
    return { x: col * strideX.value, y: -cellH.value * 0.85 };
  const boardRect = board.getBoundingClientRect();
  const pileRect = pile.getBoundingClientRect();
  return {
    x: pileRect.left - boardRect.left + (pileRect.width - cellW.value) / 2,
    y: pileRect.top - boardRect.top - cellH.value * 0.15
  };
}

function stackOrder(falls: FallMove[]): Map<string, number> {
  const seen = [0, 0, 0, 0];
  const order = new Map<string, number>();
  for (const fall of falls) {
    if (!("stack" in fall.from)) continue;
    const column = fall.from.stack;
    const index = seen[column] ?? 0;
    seen[column] = index + 1;
    order.set(fall.tileId, index);
  }
  return order;
}

async function glide(before: Map<string, Point>, falls: FallMove[]) {
  await nextTick();
  stopTileMotion();
  const dropping = stackOrder(falls);
  const origins = new Map<number, Point>();
  const animations: Animation[] = [];
  const board = boardEl.value;
  if (!board) return;
  for (const el of board.querySelectorAll<HTMLElement>("[data-tile]")) {
    const id = el.dataset.tile;
    const row = Number(el.dataset.row);
    const col = Number(el.dataset.col);
    if (!id || Number.isNaN(row) || Number.isNaN(col)) continue;
    const to = originOf(row, col);
    const dropIndex = dropping.get(id);
    if (dropIndex !== undefined) {
      const from = origins.get(col) ?? stackOrigin(col);
      origins.set(col, from);
      animations.push(
        el.animate(
          [
            { transform: pose(from, 0.94), offset: 0 },
            {
              transform: pose(
                { x: to.x, y: to.y + Math.min(14, cellH.value * 0.08) },
                1.02
              ),
              offset: 0.8,
              easing: EASE_GRAVITY
            },
            { transform: pose(to, 1), offset: 1, easing: EASE_OUT }
          ],
          {
            duration: scaled(540),
            delay: dropIndex * scaledDelay(48),
            fill: "backwards"
          }
        )
      );
      continue;
    }
    const prev = before.get(id);
    if (
      !prev ||
      (Math.abs(prev.x - to.x) < 0.5 && Math.abs(prev.y - to.y) < 0.5)
    ) {
      continue;
    }
    animations.push(
      el.animate(
        [{ transform: pose(prev, 1.04) }, { transform: pose(to, 1) }],
        { duration: scaled(300), easing: EASE_SPRING, fill: "backwards" }
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

async function userMove(
  from: CellPos,
  to: CellPos,
  fromVisual?: Map<string, Point>
) {
  if (game.winOpen) return;
  const releaseBusy = !busy.value;
  busy.value = true;
  try {
    const beforeCount = joinedCount(game.view.board);
    const before = fromVisual ?? captureVisual();
    const result = moveGroup(game.view, from, to);
    if (!result.changed) {
      await glide(before, []);
      return;
    }
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
      }, scaled(360));
    }
    game.hinting = [];
    game.view = { ...game.view, board: result.boardAfterSwap };
    await glide(before, []);
    await play(result.steps);
  } finally {
    if (releaseBusy) busy.value = false;
  }
}

async function onMagic() {
  if (busy.value || game.winOpen || !game.spend("magic")) return;
  usedMagic.value = true;
  const before = captureVisual();
  const result = magicComplete(game.view);
  if (!result.changed) {
    game.save({ ...game.progress, magic: game.progress.magic + 1 });
    return;
  }
  busy.value = true;
  game.hinting = [];
  game.view = { ...game.view, board: result.boardAfterSwap };
  await glide(before, []);
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
        await wait(scaled(480));
        showGood.value = false;
        merge.value = null;
        shrinking.value = false;
      }
    } else if (step.kind === "refill") {
      const before = captureVisual();
      const delays: Record<string, number> = {};
      const seen = [0, 0, 0, 0];
      for (const fall of step.falls) {
        if (!("stack" in fall.from)) continue;
        const column = fall.from.stack;
        const index = seen[column] ?? 0;
        seen[column] = index + 1;
        delays[fall.tileId] = index * scaledDelay(48);
      }
      dropDelay.value = delays;
      flipping.value = new Set(Object.keys(delays));
      game.view = { ...game.view, board: step.board, stacks: step.stacks };
      await glide(before, step.falls);
      flipping.value = new Set();
      dropDelay.value = {};
    } else if (step.kind === "win") {
      stars.value = starsFor(usedHint.value, usedMagic.value);
      live.value = "Level clear";
      sfx.clear();
      game.winOpen = true;
    }
  }
}

function paintDrag() {
  const current = drag.value;
  if (!current) return;
  for (const member of current.members) {
    const el = tileElement(member.id);
    if (!el) continue;
    const home = originOf(member.row, member.col);
    el.style.transform = pose(
      { x: home.x + dragMotion.dx, y: home.y + dragMotion.dy - LIFT },
      1.045
    );
  }
}

function hitFromMotion(): CellPos | null {
  const current = drag.value;
  if (!current) return null;
  const home = originOf(current.anchorRow, current.anchorCol);
  return cellUnderCenter(
    home.x + dragMotion.dx + cellW.value / 2,
    home.y + dragMotion.dy - LIFT + cellH.value / 2,
    cellW.value,
    cellH.value,
    gap
  );
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
  dragMotion.dx = 0;
  dragMotion.dy = 0;
  drag.value = {
    anchorRow: placed.row,
    anchorCol: placed.col,
    members,
    startX: event.clientX,
    startY: event.clientY,
    pointer: event.pointerId,
    moved: false
  };
  const pointer = event.pointerId;
  void nextTick(() => {
    const current = drag.value;
    if (!current || current.pointer !== pointer || current.moved) return;
    for (const member of current.members) {
      const el = tileElement(member.id);
      if (!el) continue;
      const home = originOf(member.row, member.col);
      el.animate(
        [
          { transform: pose(home, 1) },
          { transform: pose({ x: home.x, y: home.y - LIFT }, 1.045) }
        ],
        { duration: scaled(140), easing: EASE_OUT, fill: "both" }
      );
    }
  });
}

function onPointerMove(event: PointerEvent) {
  const current = drag.value;
  if (!current || event.pointerId !== current.pointer || busy.value) return;
  const dx = event.clientX - current.startX;
  const dy = event.clientY - current.startY;
  if (Math.hypot(dx, dy) > 6 && !current.moved) {
    current.moved = true;
    stopTileMotion();
  }
  dragMotion.dx = dx;
  dragMotion.dy = dy;
  paintDrag();
  const hit = current.moved ? hitFromMotion() : null;
  const dest = hit
    ? landingCell(
        { row: current.anchorRow, col: current.anchorCol },
        hit,
        current.members
      )
    : null;
  const same = dest?.row === hover.value?.row && dest?.col === hover.value?.col;
  if (!same) hover.value = dest;
}

async function onPointerUp(event: PointerEvent) {
  const current = drag.value;
  if (!current || event.pointerId !== current.pointer || busy.value) return;
  stopTileMotion();
  const hit = current.moved ? hitFromMotion() : null;
  const dest = hit
    ? landingCell(
        { row: current.anchorRow, col: current.anchorCol },
        hit,
        current.members
      )
    : null;
  const fromVisual = captureVisual();
  drag.value = null;
  hover.value = null;
  dragMotion.dx = 0;
  dragMotion.dy = 0;
  if (!dest) {
    busy.value = true;
    try {
      await glide(fromVisual, []);
    } finally {
      busy.value = false;
    }
    return;
  }
  await userMove(
    { row: current.anchorRow, col: current.anchorCol },
    dest,
    fromVisual
  );
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
    prepareGap: () => game.prepareGap(),
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
