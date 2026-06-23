const CACHE = "infonitc-v2";

// Cache app shell on install
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      "/",
      "/index.html",
      "/manifest.json",
      "/icon-192.png",
      "/icon-512.png",
    ]))
  );
  self.skipWaiting();
});

// Clean old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network first, fall back to cache
self.addEventListener("fetch", e => {
  // Skip non-GET and Firebase/API requests from caching strategy
  if (e.request.method !== "GET") return;
  
  // For Firebase API calls — network only, no caching attempt
  if (e.request.url.includes("firestore.googleapis.com") ||
      e.request.url.includes("firebase") ||
      e.request.url.includes("googleapis.com")) {
    return; // Let it fail naturally when offline
  }

  // For app assets — network first, fallback to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("/")))
  );
});