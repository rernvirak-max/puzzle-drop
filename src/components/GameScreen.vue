<template>
  <main class="pd-play" :class="{ 'is-miss': shaking }">
    <header class="pd-hud">
      <div class="pd-hud-top">
        <div>
          <p class="pd-eyebrow">{{ game.activePicture?.place }}</p>
          <h1>{{ game.activePicture?.title }}</h1>
        </div>
        <q-btn
          v-if="game.screen === 'playing'"
          class="pd-ghost"
          unelevated
          no-caps
          label="Pause"
          aria-label="Pause"
          @click="game.togglePause()"
        />
      </div>
      <div class="pd-stats">
        <div class="pd-hearts" :aria-label="`${lives} lives left`">
          <svg
            v-for="index in maxLives"
            :key="index"
            class="pd-heart"
            :class="{ 'is-empty': index > lives }"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 20s-7-4.4-9.5-8.2C.6 9.2 1.4 5.8 4.2 4.6 6.2 3.7 8.4 4.3 12 7.2 15.6 4.3 17.8 3.7 19.8 4.6c2.8 1.2 3.6 4.6 1.7 7.2C19 15.6 12 20 12 20z"
            />
          </svg>
        </div>
        <p class="pd-score">{{ scoreLabel }}</p>
        <p class="pd-combo" :class="{ 'is-hot': combo >= 2 }">
          {{ combo >= 2 ? `Combo ${combo}` : "Combo" }}
        </p>
      </div>
    </header>

    <div ref="stageEl" class="pd-stage">
      <GameCanvas v-if="game.activePicture" :src="game.activePicture.src" />
    </div>

    <aside class="pd-side">
      <div class="pd-next">
        <p>Next</p>
        <canvas ref="nextEl" width="72" height="72" aria-hidden="true" />
        <span>{{ nextLabel }}</span>
      </div>
      <div class="pd-controls">
        <button type="button" @click="game.moveLeft()">
          <span aria-hidden="true">←</span>
          Left
        </button>
        <button type="button" @click="game.rotate()">
          <span aria-hidden="true">↻</span>
          Turn
        </button>
        <button type="button" @click="game.moveRight()">
          <span aria-hidden="true">→</span>
          Right
        </button>
        <button type="button" class="pd-drop" @click="game.hardDrop()">
          <span aria-hidden="true">↓</span>
          Drop
        </button>
      </div>
      <p class="pd-hints">
        <span class="pd-touch"
          >Swipe to move · tap to turn · swipe down to drop</span
        >
        <span class="pd-keys">Arrows move · Up turns · Space drops</span>
      </p>
    </aside>

    <p class="pd-sr" aria-live="polite">{{ status }}</p>

    <div
      v-if="
        game.screen === 'paused' ||
        game.screen === 'won' ||
        game.screen === 'lost'
      "
      class="pd-overlay"
    >
      <section
        class="pd-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="dialogTitleId"
      >
        <img
          v-if="game.screen !== 'paused' && game.activePicture"
          class="pd-result-photo"
          :src="game.activePicture.src"
          alt=""
        />
        <p class="pd-eyebrow">{{ dialogEyebrow }}</p>
        <h2 :id="dialogTitleId">{{ dialogTitle }}</h2>
        <p v-if="game.screen !== 'paused'" class="pd-result-score">
          {{ scoreLabel }}
        </p>
        <p v-if="game.screen !== 'paused'" class="pd-result-best">
          <span v-if="game.isNewBest" class="pd-chip">New best</span>
          Best {{ game.bestThisRun.toLocaleString("en-US") }}
        </p>
        <p class="pd-dialog-copy">{{ dialogCopy }}</p>
        <div class="pd-dialog-actions">
          <q-btn
            v-if="game.screen === 'paused'"
            class="pd-primary"
            unelevated
            no-caps
            label="Resume"
            @click="game.togglePause()"
          />
          <q-btn
            v-else
            class="pd-primary"
            unelevated
            no-caps
            :label="game.screen === 'won' ? 'Play again' : 'Try again'"
            @click="game.retry()"
          />
          <q-btn
            class="pd-quiet"
            flat
            no-caps
            label="Pictures"
            @click="game.menu()"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import GameCanvas from "@/components/GameCanvas.vue";
import { drawPieceThumb } from "@/game/draw-board";
import { useGameStore } from "@/stores/game-store";

const game = useGameStore();
const stageEl = ref<HTMLElement | null>(null);
const nextEl = ref<HTMLCanvasElement | null>(null);
const shaking = ref(false);
const dialogTitleId = "pd-dialog-title";
const thumb = new Image();
let thumbReady = false;
let missTimer = 0;

const lives = computed(() => game.snapshot?.lives ?? 0);
const maxLives = computed(() => game.snapshot?.maxLives ?? 3);
const combo = computed(() => game.snapshot?.combo ?? 0);
const scoreLabel = computed(() =>
  (game.snapshot?.score ?? 0).toLocaleString("en-US")
);
const nextId = computed(() => game.snapshot?.queue[0] ?? "");
const nextLabel = computed(() => {
  const left = game.snapshot?.queue.length ?? 0;
  if (left === 0) return "Last piece";
  return left === 1 ? "1 left" : `${left} left`;
});
const status = computed(() => {
  if (game.screen === "won")
    return `Picture complete. Score ${scoreLabel.value}.`;
  if (game.screen === "lost") return `Out of lives. Score ${scoreLabel.value}.`;
  if (game.screen === "paused") return "Paused.";
  return `Score ${scoreLabel.value}. ${lives.value} lives.`;
});
const dialogEyebrow = computed(() => {
  if (game.screen === "won") return "The picture holds";
  if (game.screen === "lost") return "The pieces scatter";
  return "Take a breath";
});
const dialogTitle = computed(() => {
  if (game.screen === "won") return "Picture complete";
  if (game.screen === "lost") return "Out of lives";
  return "Paused";
});
const dialogCopy = computed(() => {
  if (game.screen === "won") return "Every piece found its place.";
  if (game.screen === "lost") {
    return "A wrong place or a wrong turn costs a life. The piece waits its turn again.";
  }
  return "The board stays as you left it.";
});

function paintNext() {
  const canvas = nextEl.value;
  const snap = game.snapshot;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx || !snap) return;
  if (!nextId.value || !thumbReady) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  drawPieceThumb(
    ctx,
    thumb,
    thumb.naturalWidth,
    thumb.naturalHeight,
    snap,
    nextId.value,
    canvas.width
  );
}

function onKey(event: KeyboardEvent) {
  if (game.screen === "menu") return;
  if (event.key === "p" || event.key === "P" || event.key === "Escape") {
    if (game.screen === "won" || game.screen === "lost") return;
    event.preventDefault();
    game.togglePause();
    return;
  }
  if (game.screen !== "playing") return;
  if (
    event.repeat &&
    (event.key === " " || event.key === "ArrowUp" || event.key === "ArrowDown")
  ) {
    event.preventDefault();
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    game.moveLeft();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    game.moveRight();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    game.rotate();
  } else if (event.key === " " || event.key === "ArrowDown") {
    event.preventDefault();
    game.hardDrop();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKey);
  const src = game.activePicture?.src;
  if (src) {
    thumb.onload = () => {
      thumbReady = true;
      paintNext();
    };
    thumb.src = src;
  }
  paintNext();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  window.clearTimeout(missTimer);
});

watch(nextId, () => {
  paintNext();
});

watch(
  () => game.recentEvents,
  events => {
    if (!events.some(event => event.type === "miss")) return;
    shaking.value = true;
    window.clearTimeout(missTimer);
    missTimer = window.setTimeout(() => {
      shaking.value = false;
    }, 280);
  }
);
</script>
