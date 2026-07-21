/* ============================================================
   Soft Ground — service worker
   Offline-first. The whole app is one HTML file, so once it is
   cached there is nothing left to fetch. Web fonts are cached
   on first online visit so the typography survives offline too.
   ============================================================ */

const VERSION = 'v1.0.0';
const APP_CACHE  = `soft-ground-app-${VERSION}`;
const FONT_CACHE = 'soft-ground-fonts';       // unversioned: fonts rarely change

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './clinical/index.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* ---------- install: cache the app shell ---------- */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    // addAll fails the whole install if any single item 404s, so add
    // individually and let the app still install if an icon is missing
    await Promise.all(PRECACHE.map(async url => {
      try { await cache.add(new Request(url, { cache: 'reload' })); }
      catch (e) { console.warn('[sw] could not precache', url, e); }
    }));
  })());
});

/* ---------- activate: drop superseded app caches ---------- */
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('soft-ground-app-') && k !== APP_CACHE)
          .map(k => caches.delete(k))
    );
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) {}
    }
    await self.clients.claim();
  })());
});

/* ---------- fetch ---------- */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Fonts: cache-first, kept forever. After one online visit the app
  // looks identical offline.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(FONT_CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      } catch (e) {
        // no network and not cached: the CSS font stack takes over
        return new Response('', { status: 504, statusText: 'offline' });
      }
    })());
    return;
  }

  // Anything off-origin that is not a font: leave it alone.
  if (url.origin !== self.location.origin) return;

  // Navigations: network first so an update is picked up when online,
  // falling back to the cached page. This is what makes it work on a plane.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) {
          (await caches.open(APP_CACHE)).put(req, preload.clone());
          return preload;
        }
        const fresh = await fetch(req);
        (await caches.open(APP_CACHE)).put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(APP_CACHE);
        return (await cache.match(req))
            || (await cache.match('./index.html'))
            || (await cache.match('./'))
            || new Response('<h1>Offline</h1><p>Open this page once while connected and it will work offline afterwards.</p>',
                            { headers: { 'Content-Type': 'text/html' } });
      }
    })());
    return;
  }

  // Same-origin assets: cache first, refresh in the background.
  event.respondWith((async () => {
    const cache = await caches.open(APP_CACHE);
    const hit = await cache.match(req);
    if (hit) {
      event.waitUntil((async () => {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) await cache.put(req, fresh);
        } catch (e) {}
      })());
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (e) {
      return new Response('', { status: 504, statusText: 'offline' });
    }
  })());
});

/* ---------- let the page trigger an immediate update ---------- */
self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
