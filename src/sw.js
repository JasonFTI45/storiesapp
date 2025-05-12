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