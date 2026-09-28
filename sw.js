/* HSHS Academics Door — minimal offline service worker */
const CACHE = "hshs-door-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./learn.html",
  "./community.html",
  "./comments.html",
  "./chat.html",
  "./css/styles.css",
  "./css/overrides.css",
  "./css/advanced.css",
  "./css/learn.css",
  "./css/hero-bg.css",
  "./js/app.js",
  "./js/advanced.js",
  "./js/learn.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
