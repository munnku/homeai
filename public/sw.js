const CACHE_VERSION = 'v1'
const STATIC_CACHE = `homeai-static-${CACHE_VERSION}`
const API_CACHE = `homeai-api-${CACHE_VERSION}`

const STATIC_ASSETS = [
  '/',
  '/app',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== API_CACHE)
          .map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// Fetch: cache-first for static, network-first for API (read cache on failure)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // API: network-first, fall back to cache (GET only)
  if (url.pathname.startsWith('/api/') && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone()
          caches.open(API_CACHE).then(cache => cache.put(event.request, clone))
          return res
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Static: cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    STATIC_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => cached ?? fetch(event.request))
    )
    return
  }
})

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon ?? '/icon-192.png',
      data: { url: data.url ?? '/app' }
    })
  )
})

// Notification click: open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      const url = event.notification.data?.url ?? '/app'
      const existing = clientList.find(c => c.url.includes(url))
      if (existing) return existing.focus()
      return clients.openWindow(url)
    })
  )
})
