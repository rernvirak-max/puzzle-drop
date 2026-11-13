import { reactive } from "vue";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const pwa = reactive({
  installEvent: null as InstallPromptEvent | null,
  waiting: null as ServiceWorker | null,
  offline: false
});

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosSafari() {
  const ua = navigator.userAgent;
  const ios =
    /iphone|ipad|ipod/i.test(ua) ||
    (ua.includes("Mac") && navigator.maxTouchPoints > 1);
  return ios && !/crios|fxios|edgios/i.test(ua);
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    pwa.installEvent = event as InstallPromptEvent;
  });
  window.addEventListener("appinstalled", () => {
    pwa.installEvent = null;
  });
}

export async function installApp() {
  const event = pwa.installEvent;
  if (!event) return;
  await event.prompt();
  await event.userChoice;
  pwa.installEvent = null;
}

export function applyUpdate() {
  const worker = pwa.waiting;
  if (!worker) return;
  navigator.serviceWorker.addEventListener(
    "controllerchange",
    () => window.location.reload(),
    {
      once: true
    }
  );
  worker.postMessage({ type: "SKIP_WAITING" });
}
