const CACHE_NAME = "nudge-v3";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];
const MAX_DYNAMIC_ENTRIES = 80;

async function trimDynamicEntries(cache) {
  const keys = await cache.keys();
  const dynamic = keys.filter((req) => !APP_SHELL.includes(new URL(req.url).pathname));
  const overflow = dynamic.length - MAX_DYNAMIC_ENTRIES;
  if (overflow > 0) {
    await Promise.all(dynamic.slice(0, overflow).map((req) => cache.delete(req)));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    const cache = await caches.open(CACHE_NAME);
    await trimDynamicEntries(cache);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { request } = event;
  const isNavigate = request.mode === "navigate";

  if (isNavigate) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          }
          return response;
        })
        .catch(() => caches.match("/").then((cached) => cached || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok && request.url.startsWith(self.location.origin)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(async (cache) => {
            await cache.put(request, copy);
            await trimDynamicEntries(cache);
          });
        }
        return response;
      });
    })
  );
});
