const CACHE_NAME = 'eccv-guide-v20260905-15';

const STATIC_ASSETS = [
  './',
  './index.html',
  './logistics.html',
  './places.html',
  './packing.html',
  './tools.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/data.js',
  './js/android.js',
  './js/core.js',
  './js/tickets.js',
  './js/pages/home.js',
  './js/pages/places.js',
  './js/pages/logistics.js',
  './js/pages/packing.js',
  './js/pages/tools.js',
  './js/pages/day.js',
  './js/app.js',
  './vendor/qr/qrcode.min.js',
  './vendor/qr/jsqr.min.js',
  './vendor/pdfjs/pdf.min.js',
  './vendor/pdfjs/pdf.worker.min.js',
  './vendor/leaflet/leaflet.css',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/images/layers.png',
  './vendor/leaflet/images/layers-2x.png',
  './vendor/leaflet/images/marker-icon.png',
  './vendor/leaflet/images/marker-icon-2x.png',
  './vendor/leaflet/images/marker-shadow.png',
  './assets/eccv-mark.png',
  './assets/og.png',
  './assets/powered-by-google-translate.png',
  './days/09-06.html',
  './days/09-07.html',
  './days/09-08.html',
  './days/09-09.html',
  './days/09-10.html',
  './days/09-11.html',
  './days/09-12.html',
  './days/09-13.html',
  './days/09-14.html',
  './days/09-15.html',
  './days/09-16.html',
  './days/09-17.html',
  './days/09-18.html',
  './days/09-19.html',
  './assets/places/amalienborg.jpg',
  './assets/places/army.jpg',
  './assets/places/arc.jpg',
  './assets/places/birhakeim.jpg',
  './assets/places/bonmarche.jpg',
  './assets/places/canal.jpg',
  './assets/places/champs.jpg',
  './assets/places/christiansborg.jpg',
  './assets/places/dac.jpg',
  './assets/places/disgusting.jpg',
  './assets/places/eccv.jpg',
  './assets/places/eiffel.jpg',
  './assets/places/enigma.jpg',
  './assets/places/experimentarium.jpg',
  './assets/places/francette.jpg',
  './assets/places/grandpalais.jpg',
  './assets/places/lilla.jpg',
  './assets/places/louvre.jpg',
  './assets/places/latin.jpg',
  './assets/places/kongensnytorv.jpg',
  './assets/places/malmohus.jpg',
  './assets/places/marais.jpg',
  './assets/places/marmorkirken.jpg',
  './assets/places/notre.jpg',
  './assets/places/nyhavn.jpg',
  './assets/places/opera.jpg',
  './assets/places/palais.jpg',
  './assets/places/rosenborg.jpg',
  './assets/places/rodin.jpg',
  './assets/places/roundtower.jpg',
  './assets/places/sacre.jpg',
  './assets/places/sainte.jpg',
  './assets/places/saluhall.jpg',
  './assets/places/saviour.jpg',
  './assets/places/sciences.jpg',
  './assets/places/stroget.jpg',
  './assets/places/tekniken.jpg',
  './assets/places/tivoli.jpg',
  './assets/places/torvehallerne.jpg',
  './assets/places/tuileries.jpg',
  './assets/places/turning.jpg',
  './assets/places/versailles.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // For external API requests (weather, exchange, AI translation), let network handle directly
  if (url.origin !== self.location.origin) {
    return;
  }

  const cacheNetworkResponse = (response) => {
    if (!response || response.status !== 200 || response.type !== 'basic') return response;
    const responseToCache = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
    return response;
  };

  // HTML navigation and versioned JS/CSS use network-first so a newly deployed
  // interface cannot be paired with stale handlers from the previous cache.
  if (request.mode === 'navigate' || url.searchParams.has('v')) {
    event.respondWith(
      fetch(request)
        .then(cacheNetworkResponse)
        .catch(() => caches.match(request).then((cached) => cached || caches.match(request, { ignoreSearch: true })).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('./index.html');
          return new Response('Offline asset unavailable', { status: 504, statusText: 'Offline' });
        }))
    );
    return;
  }

  // Images, fonts and bundled map assets stay cache-first for fast offline use.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for next time
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then(cacheNetworkResponse).catch(() => {
        // Fallback to offline index page if navigation request
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
