import { ref } from "vue";

export const THEMES = [
  { id: "meadow", name: "Meadow" },
  { id: "sunrise", name: "Sunrise" },
  { id: "breeze", name: "Breeze" }
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const KEY = "puzzle-drop.theme";

export const theme = ref<ThemeId>("meadow");

export function applyTheme(id: ThemeId) {
  theme.value = id;
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode */
  }
}

export function loadTheme() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    saved = null;
  }
  if (saved === "sunrise" || saved === "breeze" || saved === "meadow") {
    applyTheme(saved);
    return;
  }
  applyTheme("meadow");
}
