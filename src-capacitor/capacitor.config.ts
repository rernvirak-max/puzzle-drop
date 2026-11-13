import { defineCapacitorConfig } from "@quasar/app-vite/capacitor";

// Native iOS and Android projects are intentionally not generated yet.
// Quasar's Capacitor mode can wrap this SPA later; webDir defaults to www.
export default defineCapacitorConfig({
  appId: "app.puzzledrop.game",
  appName: "Kampuzzle"
});
