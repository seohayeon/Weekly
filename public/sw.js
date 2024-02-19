const CACHE_NAME = 'my-cache';

// 캐시할 파일 목록
const urlsToCache = [
  '/',
  '/index.html'
];

// Service Worker 설치
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Service Worker 활성화
self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

// 요청에 대한 캐시 응답 반환
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});