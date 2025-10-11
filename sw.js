// Service Worker for Michael Brennan's Portfolio Website
// Version 1.0.0

const CACHE_NAME = 'michael-brennan-portfolio-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/infinite-match.html',
  '/games/privacy-policy.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/manifest.json',
  '/sitemap.xml',
  '/robots.txt',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(function() {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for form submissions
self.addEventListener('sync', function(event) {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

// Push notification handling
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/favicon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Michael Brennan Portfolio', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for contact form sync
function syncContactForm() {
  // This would handle offline form submissions
  // Implementation depends on your backend setup
  return Promise.resolve();
}