<template>
  <HomeScreen v-if="game.screen === 'home'" />
  <GameScreen v-else />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import GameScreen from "@/components/GameScreen.vue";
import HomeScreen from "@/components/HomeScreen.vue";
import { applyTheme, loadTheme, type ThemeId } from "@/game/theme";
import { useGameStore } from "@/stores/game-store";

loadTheme();
const game = useGameStore();

onMounted(() => {
  if (!import.meta.env.DEV) return;
  window.__puzzle = {
    ...window.__puzzle,
    home: () => game.goHome(),
    play: () => game.startLevel(),
    theme: (id: ThemeId) => applyTheme(id)
  };
});
</script>
