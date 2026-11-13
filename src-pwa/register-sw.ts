import { register } from "register-service-worker";
import { pwa } from "../src/game/pwa";

// Keeps the app shell offline and tells the game when a new version is waiting.
register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  updated(registration) {
    pwa.waiting = registration.waiting;
  },
  offline() {
    pwa.offline = true;
  },
  error(err) {
    console.error("Service worker registration failed:", err);
  }
});
