"use client";

import { useSyncExternalStore } from "react";

/** Chrome/Edge/Android fire this when the site can be installed. */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type Platform = "ios" | "android" | "desktop";

type InstallState = {
  /** Deferred native install prompt, when the browser offers one. */
  promptEvent: BeforeInstallPromptEvent | null;
  /** Running as the installed app (home screen / app window). */
  standalone: boolean;
  /** Installed during this visit. */
  installed: boolean;
  platform: Platform;
  /** The step-by-step guide sheet. */
  guideOpen: boolean;
};

const initial: InstallState = {
  promptEvent: null,
  standalone: false,
  installed: false,
  platform: "desktop",
  guideOpen: false,
};

let state = initial;
const listeners = new Set<() => void>();
const set = (patch: Partial<InstallState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export function useInstall() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => initial,
  );
}

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch support gives it away.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: minimal-ui)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** Wire up browser events once (called from the app shell). */
export function initInstall() {
  set({ platform: detectPlatform(), standalone: isStandalone() });

  const onPrompt = (e: Event) => {
    e.preventDefault(); // keep it for our own button instead of the mini-infobar
    set({ promptEvent: e as BeforeInstallPromptEvent });
  };
  const onInstalled = () => set({ installed: true, promptEvent: null, guideOpen: false });
  const mq = window.matchMedia("(display-mode: standalone)");
  const onMode = () => set({ standalone: isStandalone() });

  window.addEventListener("beforeinstallprompt", onPrompt);
  window.addEventListener("appinstalled", onInstalled);
  mq.addEventListener("change", onMode);
  return () => {
    window.removeEventListener("beforeinstallprompt", onPrompt);
    window.removeEventListener("appinstalled", onInstalled);
    mq.removeEventListener("change", onMode);
  };
}

/**
 * Install the app: use the browser's native prompt where available (one
 * tap), otherwise open the guided steps (iPhone, Firefox, Safari on Mac…).
 */
export async function installApp() {
  const { promptEvent } = state;
  if (!promptEvent) {
    set({ guideOpen: true });
    return;
  }
  await promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  set({ promptEvent: null, installed: outcome === "accepted" });
}

export const openInstallGuide = () => set({ guideOpen: true });
export const closeInstallGuide = () => set({ guideOpen: false });
