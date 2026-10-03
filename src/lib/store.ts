"use client";

import { useSyncExternalStore } from "react";
import { SHOPIFY_DOMAIN } from "@/lib/site";

/** Tiny external store — enough for cart + overlay state without a library. */
function createStore<T>(initial: T, persistKey?: string) {
  let state = initial;
  let hydrated = !persistKey;
  const listeners = new Set<() => void>();

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const saved = localStorage.getItem(persistKey!);
      if (saved) state = JSON.parse(saved);
    } catch {}
  };

  const set = (next: T | ((prev: T) => T)) => {
    hydrate();
    state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    if (persistKey) {
      try {
        localStorage.setItem(persistKey, JSON.stringify(state));
      } catch {}
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== persistKey || !e.newValue) return;
      state = JSON.parse(e.newValue);
      listener();
    };
    if (persistKey) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const get = () => {
    hydrate();
    return state;
  };

  const useStore = () => useSyncExternalStore(subscribe, get, () => initial);

  return { get, set, useStore };
}

/* ----------------------------------------------------------------- cart -- */

export type CartLine = {
  variantId: number;
  handle: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
};

const cart = createStore<CartLine[]>([], "filo-cart-v1");

export const MAX_QTY = 10;

export function useCart() {
  const lines = cart.useStore();
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  return { lines, count, subtotal };
}

export const cartActions = {
  add(line: Omit<CartLine, "quantity">, quantity = 1) {
    cart.set((lines) => {
      const existing = lines.find((l) => l.variantId === line.variantId);
      if (existing) {
        return lines.map((l) =>
          l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l,
        );
      }
      return [...lines, { ...line, quantity }];
    });
    ui.set((s) => ({ ...s, cart: true, search: false, menu: false }));
  },
  update(variantId: number, quantity: number) {
    cart.set((lines) =>
      quantity <= 0
        ? lines.filter((l) => l.variantId !== variantId)
        : lines.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)),
    );
  },
  remove(variantId: number) {
    cart.set((lines) => lines.filter((l) => l.variantId !== variantId));
  },
};

/**
 * Shopify cart permalink: creates a cart with these variants and lands the
 * shopper on Shopify's hosted checkout (payments, shipping, taxes, orders).
 */
export function checkoutUrl(lines: Pick<CartLine, "variantId" | "quantity">[]) {
  const items = lines.map((l) => `${l.variantId}:${l.quantity}`).join(",");
  return `https://${SHOPIFY_DOMAIN}/cart/${items}`;
}

/* ------------------------------------------------------------- overlays -- */

type Overlays = { cart: boolean; search: boolean; menu: boolean };

const ui = createStore<Overlays>({ cart: false, search: false, menu: false });

export const useOverlays = ui.useStore;

export const overlay = {
  open: (key: keyof Overlays) => ui.set({ cart: false, search: false, menu: false, [key]: true }),
  close: (key: keyof Overlays) => ui.set((s) => ({ ...s, [key]: false })),
  closeAll: () => ui.set({ cart: false, search: false, menu: false }),
};

/* ---------------------------------------------------------------- intro -- */

/** Whether the home-page intro has finished (hero animations wait for it). */
const intro = createStore<boolean>(false);

export const useIntroDone = intro.useStore;
export const finishIntro = () => intro.set(true);
