<template>
  <div class="pd-app" :data-phase="game.screen">
    <StartScreen v-if="game.screen === 'menu'" />
    <GameScreen v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import GameScreen from "@/components/GameScreen.vue";
import StartScreen from "@/components/StartScreen.vue";
import { useGameStore } from "@/stores/game-store";

const game = useGameStore();

onMounted(() => {
  if (!import.meta.env.DEV) return;
  window.__puzzleDrop = {
    phase: () => game.screen,
    snapshot: () => game.snapshot,
    start: () => {
      game.start();
    },
    startOrdered: () => {
      game.startOrdered();
    },
    pause: () => {
      if (game.screen === "playing") game.togglePause();
    },
    moveLeft: () => {
      game.moveLeft();
    },
    moveRight: () => {
      game.moveRight();
    },
    rotate: () => {
      game.rotate();
    },
    hardDrop: () => {
      game.hardDrop();
    },
    tick: () => {
      game.tick();
    }
  };
});
</script>
