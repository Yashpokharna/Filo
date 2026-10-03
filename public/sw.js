/*
 * FILO service worker — makes the installed app launch fast and degrade
 * gracefully offline. Pages are network-first (fresh prices and stock), with
 * the last copy or a branded offline page as fallback. Build assets are
 * immutable, so they're served cache-first; images use stale-while-revalidate.
 */
const VERSION = "filo-v1";
const SHELL = `${VERSION}-shell`;
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const IMAGES = `${VERSION}-images`;
const OFFLINE_URL = "/offline";

const PRECACHE = [OFFLINE_URL, "/pwa/icon-192.png", "/pwa/icon-512.png", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Keep a cache from growing without bound. */
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      trim(PAGES, 40);
    }
    return response;
  } catch {
    return (await cache.match(request)) || (await caches.match(OFFLINE_URL));
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      // Only same-origin, successful responses (opaque ones bloat storage quota).
      if (response.ok) {
        cache.put(request, response.clone());
        trim(cacheName, max);
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Full page loads.
  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  // Never cache API calls or Next's data requests; they must be live.
  if (url.origin === self.location.origin && (url.pathname.startsWith("/api/") || url.searchParams.has("_rsc"))) {
    return;
  }

  // Hashed build output never changes.
  if (url.origin === self.location.origin && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, ASSETS));
    return;
  }

  // Optimised images and brand media (Shopify's CDN handles its own caching).
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/media/") || url.pathname.startsWith("/pwa/"))
  ) {
    // Videos stream with range requests — leave those to the network.
    if (url.pathname.endsWith(".mp4")) return;
    event.respondWith(staleWhileRevalidate(request, IMAGES, 120));
  }
});
