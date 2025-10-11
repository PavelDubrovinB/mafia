// sw.ts
declare const self: ServiceWorkerGlobalScope

const CACHE_NAME: string = 'myapp-v1'
const ASSETS: string[] = ['/', '/index.html', '/styles.css', '/app.js', '/icons/192.png']

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(ASSETS)
      // Активируем новый сервис-воркер сразу (опционально)
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // Удаляем старые кеши, если они есть
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve(true))))
      // Берём под контроль все клиенты сразу
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event: FetchEvent) => {
  // Обрабатываем только GET-запросы (рекомендуется)
  if (event.request.method !== 'GET') return

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request)
      if (cached) return cached

      // Если нет в кеше — фетчим из сети и возвращаем ответ
      try {
        const networkResponse = await fetch(event.request)
        // Не кэшируем неуспешные ответы
        if (networkResponse && networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME)
          // Клонируем ответ т.к. его можно читать только один раз
          cache.put(event.request, networkResponse.clone()).catch(() => {
            /* игнорируем ошибки кэширования */
          })
        }
        return networkResponse
      } catch (err) {
        // Можно вернуть fallback-страницу или просто пробросить ошибку
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
      }
    })(),
  )
})
