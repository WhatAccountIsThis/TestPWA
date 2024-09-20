const CACHE_NAME = 'PWA_APP_v1';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        '/index.html',
        '/login.js',
        '/profile.html',
        '/manifest.json'
      ]);
      self.skipWaiting(); // Activate the service worker immediately
    })()
  );
});

// Fetch event to serve cached content or fetch from network.
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Try to get the resource from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse; // Return the cached response if available
      }

      try {
        // If the resource was not in the cache, try the network.
        const fetchResponse = await fetch(event.request);

        // Save the resource in the cache and return it.
        if (fetchResponse && fetchResponse.ok) {
          cache.put(event.request, fetchResponse.clone());
        }
        return fetchResponse; // Return the fetched response
      } catch (e) {
        console.error('Fetch failed; returning offline page instead.', e);
        // Return the cached offline page if available
        return caches.match('/index.html'); // Ensure this is cached
      }
    })()
  );
});

// Activation event to clean up old caches if necessary.
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })()
  );
});
