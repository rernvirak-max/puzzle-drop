<template>
  <main class="pd-menu">
    <div class="pd-menu-scroll">
      <header class="pd-hero">
        <p class="pd-eyebrow">A picture, in pieces</p>
        <h1>Puzzle <em>Drop</em></h1>
        <p class="pd-lede">
          Pieces fall one at a time. Slide each one into its own place, upright,
          before the three lives run out.
        </p>
      </header>

      <section class="pd-block" aria-labelledby="grid-heading">
        <h2 id="grid-heading">Grid</h2>
        <div class="pd-sizes" role="radiogroup" aria-label="Grid size">
          <button
            v-for="size in game.gridSizes"
            :key="size"
            type="button"
            role="radio"
            class="pd-size"
            :class="{ 'is-selected': game.gridSize === size }"
            :aria-checked="game.gridSize === size"
            @click="game.setGrid(size)"
          >
            {{ size }}×{{ size }}
          </button>
        </div>
      </section>

      <section class="pd-block" aria-labelledby="picture-heading">
        <h2 id="picture-heading">Picture</h2>
        <div class="pd-gallery">
          <button
            v-for="picture in game.pictures"
            :key="picture.id"
            type="button"
            class="pd-card"
            :class="{ 'is-selected': game.selectedId === picture.id }"
            :aria-pressed="game.selectedId === picture.id"
            @click="game.selectPicture(picture.id)"
          >
            <img :src="picture.src" :alt="picture.title" />
            <span class="pd-card-copy">
              <span class="pd-card-title">{{ picture.title }}</span>
              <span class="pd-card-place">{{ picture.place }}</span>
              <span class="pd-card-best">{{ bestLabel(picture.id) }}</span>
            </span>
          </button>

          <button type="button" class="pd-card pd-upload" @click="pickPhoto">
            <span class="pd-upload-mark" aria-hidden="true">+</span>
            <span class="pd-card-copy">
              <span class="pd-card-title">Use my photo</span>
              <span class="pd-card-place">Stays on this phone</span>
            </span>
          </button>
        </div>
        <p v-if="fileError" class="pd-error" role="alert">{{ fileError }}</p>
        <input
          ref="fileEl"
          class="pd-file"
          type="file"
          accept="image/*"
          @change="onFile"
        />
      </section>

      <section class="pd-credits">
        <button
          type="button"
          class="pd-text-button"
          :aria-expanded="creditsOpen"
          @click="creditsOpen = !creditsOpen"
        >
          Photo credits
        </button>
        <ul v-if="creditsOpen">
          <li v-for="picture in game.catalog" :key="picture.id">
            <strong>{{ picture.title }}</strong>
            — {{ picture.photographer }}, {{ picture.license }}.
            <a :href="picture.sourceUrl" target="_blank" rel="noreferrer">
              Source
            </a>
          </li>
        </ul>
      </section>
    </div>

    <div class="pd-menu-bar">
      <q-btn
        class="pd-primary"
        unelevated
        no-caps
        label="Start"
        :disable="!game.selected"
        @click="game.start()"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "@/stores/game-store";

const game = useGameStore();
const fileEl = ref<HTMLInputElement | null>(null);
const fileError = ref("");
const creditsOpen = ref(false);

function bestLabel(id: string): string {
  const score = game.scoreFor(id);
  if (score <= 0) return "No best yet";
  return `Best ${score.toLocaleString("en-US")}`;
}

function pickPhoto() {
  fileError.value = "";
  fileEl.value?.click();
}

function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    fileError.value = "Choose an image file.";
    return;
  }
  fileError.value = "";
  game.useCustomFile(file);
}
</script>
