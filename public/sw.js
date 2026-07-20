const CACHE = 'toys141-v1';
const PRECACHE = ['/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    // Only cache GET requests; skip API and admin routes
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

    // HTML pages: always go to network first so a broken/stale shell never gets stuck in cache.
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
        return;
    }

    // Static assets (JS/CSS/images): cache-first, refresh in background.
    e.respondWith(
        caches.match(e.request).then(cached => {
            const network = fetch(e.request).then(res => {
                if (res.ok && url.origin === location.origin) {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                }
                return res;
            });
            return cached || network;
        })
    );
});
