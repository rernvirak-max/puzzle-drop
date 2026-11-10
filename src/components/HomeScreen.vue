<template>
  <main class="pd-home">
    <header class="pd-home-top">
      <p class="pd-eyebrow">A private picture puzzle</p>
      <h1>Puzzle <em>Drop</em></h1>
      <p class="pd-lede">
        Swap tiles until each photograph finds its own shape.
      </p>
    </header>

    <button type="button" class="pd-play-cta" @click="game.startLevel()">
      <span>Play</span>
      <strong>Level {{ game.progress.level }}</strong>
      <em>{{ nextName }}</em>
    </button>

    <section class="pd-map" aria-label="Levels">
      <h2>Levels</h2>
      <ol>
        <li
          v-for="level in levels"
          :key="level.level"
          :class="{
            'is-now': level.level === game.progress.level,
            'is-done': level.level < game.progress.level,
            'is-locked': level.level > game.progress.level
          }"
        >
          <button
            type="button"
            :disabled="level.level > game.progress.level"
            @click="game.startLevel(level.level)"
          >
            <span class="pd-num">{{ level.level }}</span>
            <span>
              <strong>{{ level.name }}</strong>
              <em>{{ level.pack }}</em>
            </span>
          </button>
        </li>
      </ol>
    </section>

    <footer class="pd-home-bar">
      <button type="button" class="pd-chip" @click="toggleMuted()">
        {{ muted ? "Sound off" : "Sound on" }}
      </button>
      <button type="button" class="pd-chip" @click="game.openSettings()">
        {{ game.customName ? "My photo" : "Use my photo" }}
      </button>
    </footer>

    <div
      v-if="game.settingsOpen"
      class="pd-shade"
      @click.self="game.closeSettings()"
    >
      <section class="pd-sheet" role="dialog" aria-labelledby="home-settings">
        <h2 id="home-settings">Your photo</h2>
        <p>
          It stays on this phone and replaces the first picture when a level
          starts.
        </p>
        <button type="button" class="pd-gold" @click="pickPhoto">
          Choose a photo
        </button>
        <p v-if="game.customName">Using {{ game.customName }}.</p>
        <button
          v-if="game.customName"
          type="button"
          class="pd-quiet"
          @click="game.clearCustom()"
        >
          Remove my photo
        </button>
        <button type="button" class="pd-quiet" @click="credits = !credits">
          Photo credits
        </button>
        <ul v-if="credits">
          <li v-for="picture in game.catalog" :key="picture.id">
            <strong>{{ picture.title }}</strong>
            — {{ picture.photographer }}, {{ picture.license }}.
          </li>
        </ul>
        <button type="button" class="pd-gold" @click="game.closeSettings()">
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
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { LEVELS, levelDef } from "@/game/levels";
import { muted, toggleMuted } from "@/game/sound";
import { useGameStore } from "@/stores/game-store";

const game = useGameStore();
const levels = LEVELS;
const credits = ref(false);
const fileEl = ref<HTMLInputElement | null>(null);
const nextName = computed(
  () => levelDef(game.progress.level).name ?? "Temple Court"
);

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
</script>
