// The build replaces these placeholders with a version and a short precache list.
const CACHE_NAME = 'horas-clt-dev';
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.json'];
const PAGE_PATHS = ['/'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      // A failed individual resource must not block installing the worker.
      await Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
    } catch { /* Browsing online still works when storage is unavailable. */ }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.allSettled(keys.filter(key => key.startsWith('horas-clt-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    } catch { /* Cache storage may be disabled. */ }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const request = event.request;
  const cachePromise = Promise.resolve().then(() => caches.open(CACHE_NAME)).catch(() => null);
  const fetchAndCache = async () => {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await cachePromise;
      try { await cache?.put(request, response.clone()); }
      catch { /* Quota and permissions cannot break successful network responses. */ }
    }
    return response;
  };
  event.respondWith((async () => {
    const cache = await cachePromise;
    let cached;
    try { cached = await cache?.match(request); }
    catch { /* Read failures should fall through to network. */ }
    if (request.mode !== 'navigate' && cached) return cached;
    try { return await fetchAndCache(); }
    catch {
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const path = new URL(request.url).pathname.replace(/\\/$/, '') || '/';
        if (PAGE_PATHS.includes(path)) {
          try {
            const fallback = await cache?.match(path, { ignoreSearch: true });
            if (fallback) return fallback;
          } catch { /* No available offline copy. */ }
        }
        return new Response('Página indisponível offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      return new Response('', { status: 503 });
    }
  })());
});
