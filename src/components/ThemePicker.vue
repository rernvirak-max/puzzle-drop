<template>
  <div class="pd-themes" role="group" aria-label="Colour theme">
    <button
      v-for="item in THEMES"
      :key="item.id"
      type="button"
      :class="{ 'is-on': theme === item.id }"
      :style="{
        '--swatch': SWATCH[item.id].bg,
        '--swatch-ink': SWATCH[item.id].ink,
        background: SWATCH[item.id].bg,
        color: SWATCH[item.id].ink
      }"
      :aria-pressed="theme === item.id"
      @click="applyTheme(item.id)"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { THEMES, applyTheme, theme, type ThemeId } from "@/game/theme";

const SWATCH: Record<ThemeId, { bg: string; ink: string }> = {
  meadow: { bg: "#f4fbf6", ink: "#17352c" },
  sunrise: { bg: "#fff5ee", ink: "#3d2418" },
  breeze: { bg: "#f3f8ff", ink: "#1b3358" }
};
</script>
