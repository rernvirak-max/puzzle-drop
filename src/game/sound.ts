import { ref } from "vue";

const MUTE_KEY = "puzzle-drop.muted";

export const muted = ref(readMuted());

let audio: AudioContext | null = null;

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function toggleMuted(): boolean {
  muted.value = !muted.value;
  try {
    localStorage.setItem(MUTE_KEY, muted.value ? "1" : "0");
  } catch {
    /* private mode */
  }
  return muted.value;
}

function context(): AudioContext | null {
  if (muted.value) return null;
  const Ctx = window.AudioContext;
  if (!Ctx) return null;
  audio ??= new Ctx();
  if (audio.state === "suspended") void audio.resume();
  return audio;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sfx = {
  swap() {
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    tone(ctx, 520, now, 0.07, 0.05, "triangle");
    tone(ctx, 740, now + 0.04, 0.08, 0.04, "sine");
  },
  merge() {
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    tone(ctx, 523, now, 0.18, 0.06);
    tone(ctx, 659, now + 0.06, 0.2, 0.05);
    tone(ctx, 784, now + 0.12, 0.28, 0.05);
  },
  clear() {
    const ctx = context();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523, 659, 784, 1046].forEach((frequency, index) => {
      tone(ctx, frequency, now + index * 0.09, 0.28, 0.06);
    });
  }
};
