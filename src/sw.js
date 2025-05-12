import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

clientsClaim();

// Precache files
precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst()
);

registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new CacheFirst()
);

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Story Berhasil ditambahkan',
    icon: '/images/logo.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});