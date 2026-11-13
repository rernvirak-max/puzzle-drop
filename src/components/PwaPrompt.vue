<template>
  <div class="pd-pwa" aria-live="polite">
    <div v-if="pwa.waiting" class="pd-pwa-card">
      <span>A new version of Kampuzzle is ready.</span>
      <button type="button" @click="applyUpdate()">Refresh</button>
    </div>
    <div v-else-if="pwa.installEvent && !hidden" class="pd-pwa-card">
      <span>Play Kampuzzle like an app.</span>
      <button type="button" @click="installApp()">Install app</button>
      <button
        type="button"
        class="pd-pwa-close"
        aria-label="Not now"
        @click="dismiss()"
        >×</button
      >
    </div>
    <div v-else-if="showIosHint" class="pd-pwa-card">
      <span>To install, tap Share, then Add to Home Screen.</span>
      <button
        type="button"
        class="pd-pwa-close"
        aria-label="Got it"
        @click="dismiss()"
        >×</button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  applyUpdate,
  installApp,
  isIosSafari,
  isStandalone,
  pwa
} from "../game/pwa";

const KEY = "kampuzzle.install-hint-hidden";

function readHidden() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

const hidden = ref(readHidden());
const showIosHint = computed(
  () => !hidden.value && isIosSafari() && !isStandalone()
);

function dismiss() {
  hidden.value = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* private mode */
  }
}
</script>
