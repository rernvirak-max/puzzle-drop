<template>
  <canvas
    ref="canvasEl"
    class="pd-canvas"
    aria-label="Puzzle board"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { drawBoard, type LockPulse, type Slam } from "@/game/draw-board";
import type { GameEvent } from "@/game/types";
import { useGameStore } from "@/stores/game-store";

const props = defineProps<{ src: string }>();
const game = useGameStore();
const canvasEl = ref<HTMLCanvasElement | null>(null);

const image = new Image();
const pulses: LockPulse[] = [];
let slam: Slam | null = null;
let ready = false;
let frame = 0;
let lastTime = 0;
let accumulator = 0;
let seenId: string | null = null;
let cssWidth = 0;
let cssHeight = 0;
let drag: {
  x: number;
  y: number;
  moved: boolean;
  dropped: boolean;
} | null = null;
let observer: ResizeObserver | null = null;

function load(src: string) {
  ready = false;
  image.onload = () => {
    ready = true;
  };
  image.onerror = () => {
    ready = false;
  };
  image.src = src;
}

function fit() {
  const canvas = canvasEl.value;
  const stage = canvas?.parentElement;
  const snap = game.snapshot;
  if (!canvas || !stage || !snap) return;
  const rect = stage.getBoundingClientRect();
  const cell = Math.min(
    rect.width / snap.cols,
    rect.height / (snap.rows + 1),
    220
  );
  cssWidth = Math.max(1, Math.floor(cell * snap.cols));
  cssHeight = Math.max(1, Math.floor(cell * (snap.rows + 1)));
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function applyEvents(events: readonly GameEvent[]) {
  const now = performance.now();
  for (const event of events) {
    if (event.type !== "lock" && event.type !== "miss") continue;
    const distance = Math.max(0, event.row - event.fromRow);
    if (distance > 0) {
      slam = {
        pieceId: event.pieceId,
        fromRow: event.fromRow,
        toRow: event.row,
        col: event.col,
        rotation: event.rotation,
        started: now,
        duration: Math.min(220, 80 + distance * 32),
        kind: event.type
      };
    }
    if (event.type === "lock") {
      pulses.push({ row: event.row, col: event.col, at: now });
    }
  }
}

function loop(now: number) {
  frame = requestAnimationFrame(loop);
  const dt = lastTime === 0 ? 16 : Math.min(48, now - lastTime);
  lastTime = now;
  const snap = game.snapshot;
  const activeId = snap?.active?.id ?? null;
  if (activeId !== seenId) {
    seenId = activeId;
    accumulator = 0;
  }
  if (game.screen === "playing" && !document.hidden) {
    accumulator += dt;
    const interval = snap?.fallIntervalMs ?? 980;
    while (accumulator >= interval && game.screen === "playing") {
      const before = game.snapshot?.active?.id;
      accumulator -= interval;
      game.tick();
      if (game.snapshot?.active?.id !== before) {
        accumulator = 0;
        break;
      }
    }
  }
  paint(now);
}

function paint(now: number) {
  const canvas = canvasEl.value;
  const ctx = canvas?.getContext("2d");
  const snap = game.snapshot;
  if (!canvas || !ctx || !snap || cssWidth === 0) return;
  const interval = snap.fallIntervalMs || 980;
  const progress =
    game.screen === "playing" ? Math.min(1, accumulator / interval) : 0;
  if (slam && now - slam.started > slam.duration) slam = null;
  while (pulses.length > 0 && pulses[0] && now - pulses[0].at > 400) {
    pulses.shift();
  }
  drawBoard(ctx, {
    snapshot: snap,
    image,
    imageWidth: ready ? image.naturalWidth : 0,
    imageHeight: ready ? image.naturalHeight : 0,
    width: cssWidth,
    height: cssHeight,
    progress,
    now,
    pulses,
    slam
  });
}

function cellSize(): number {
  const snap = game.snapshot;
  if (!snap || cssWidth === 0) return 48;
  return cssWidth / snap.cols;
}

function onPointerDown(event: PointerEvent) {
  if (game.screen !== "playing") return;
  const canvas = canvasEl.value;
  canvas?.setPointerCapture(event.pointerId);
  drag = { x: event.clientX, y: event.clientY, moved: false, dropped: false };
}

function onPointerMove(event: PointerEvent) {
  if (!drag || game.screen !== "playing") return;
  const threshold = Math.max(22, cellSize() * 0.34);
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (Math.abs(dx) >= threshold) {
    drag.moved = true;
    drag.x = event.clientX;
    if (dx > 0) game.moveRight();
    else game.moveLeft();
  }
  if (!drag.dropped && dy >= Math.max(48, cellSize() * 0.55)) {
    drag.moved = true;
    drag.dropped = true;
    game.hardDrop();
  }
}

function onPointerUp(event: PointerEvent) {
  if (!drag) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  const tapped = !drag.moved && Math.hypot(dx, dy) < 16;
  drag = null;
  if (tapped && game.screen === "playing") game.rotate();
}

function onResize() {
  fit();
}

onMounted(() => {
  load(props.src);
  const stage = canvasEl.value?.parentElement;
  if (stage) {
    observer = new ResizeObserver(() => {
      fit();
    });
    observer.observe(stage);
  }
  fit();
  lastTime = 0;
  frame = requestAnimationFrame(loop);
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  window.removeEventListener("resize", onResize);
});

watch(
  () => props.src,
  src => {
    load(src);
  }
);

watch(
  () => game.snapshot?.rows,
  () => {
    fit();
  }
);

watch(
  () => game.recentEvents,
  events => {
    applyEvents(events);
  }
);
</script>
