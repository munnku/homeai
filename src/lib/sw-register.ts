'use client'

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  const register = async () => {
    try {
      await navigator.serviceWorker.register('/sw.js')
    } catch (err) {
      console.error('SW registration failed:', err)
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => { void register() })
  } else {
    setTimeout(() => { void register() }, 1)
  }
}

export async function subscribeToPush(registration: ServiceWorkerRegistration) {
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidKey) throw new Error('VAPID public key not configured')

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey)
  })

  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  })

  return subscription
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}
