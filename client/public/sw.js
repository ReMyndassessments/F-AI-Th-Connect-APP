const CACHE_NAME = 'f-ai-th-connect-v1';
const OFFLINE_URL = '/offline.html';

// Core resources to cache for offline functionality
const CORE_CACHE_RESOURCES = [
  '/',
  '/offline.html',
  '/bible-lookup',
  '/bible-games',
  '/help',
  '/contact',
  '/privacy',
  '/terms'
];

// API resources that can be cached
const API_CACHE_RESOURCES = [
  '/api/feature-flags/public',
  '/api/tts/voices'
];

// Install event - cache core resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core resources');
        return cache.addAll(CORE_CACHE_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone))
              .catch(error => console.log('Cache put error:', error));
          }
          return response;
        })
        .catch(() => {
          // Serve from cache or offline page
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Serve offline page for navigation requests
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // Handle API requests with cache-first strategy for certain endpoints
  if (url.pathname.startsWith('/api/feature-flags/public') || 
      url.pathname.startsWith('/api/tts/voices')) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Serve from cache but also fetch fresh data in background
            fetch(request)
              .then(response => {
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(request, responseClone));
                }
              })
              .catch(() => {}); // Ignore background fetch errors
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }
  
  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses for static assets
        if (response.status === 200 && 
            (request.url.includes('.js') || 
             request.url.includes('.css') || 
             request.url.includes('.png') || 
             request.url.includes('.jpg') || 
             request.url.includes('.svg'))) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone))
            .catch(error => console.log('Cache put error:', error));
        }
        return response;
      })
      .catch(() => {
        // Try to serve from cache
        return caches.match(request);
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'bible-verse-lookup') {
    event.waitUntil(syncBibleVerses());
  }
});

async function syncBibleVerses() {
  try {
    // Sync any pending Bible verse lookups
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/bible/')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response.clone());
          }
        } catch (error) {
          console.log('Sync failed for', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/open-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});