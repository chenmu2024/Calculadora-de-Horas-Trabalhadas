const CACHE_NAME = 'horas-clt-dev'; // Replaced with a build content hash.
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.json']; // Replaced at build time.
const PAGE_PATHS = ['/']; // Replaced at build time.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
  // Let open pages keep their matching worker and bundles until they close.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('horas-clt-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const request = event.request;
  // Cache availability must never turn a successful network response into a failure.
  const cachePromise = caches.open(CACHE_NAME).catch(() => undefined);
  const cacheNetworkResponse = async () => {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await cachePromise;
      try { await cache?.put(request, response.clone()); }
      catch { /* Storage limits must not interrupt page or module loading. */ }
    }
    return response;
  };
  event.respondWith((async () => {
    const cache = await cachePromise;
    const cached = await cache?.match(request).catch(() => undefined);
    if (request.mode !== 'navigate' && cached) return cached;
    try { return await cacheNetworkResponse(); }
    catch {
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const path = new URL(request.url).pathname.replace(/\/$/, '') || '/';
        if (PAGE_PATHS.includes(path)) {
          const page = await cache?.match(path === '/' ? '/' : path + '/').catch(() => undefined);
          if (page) return page;
        }
        return new Response('Página indisponível offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      return new Response('', { status: 503 });
    }
  })());
});
