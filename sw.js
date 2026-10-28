// Service worker – deixa o site abrir e funcionar 100% offline após a 1ª visita.
var V = 'jmsm-v13';
var ARQ = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'img/logo.png', 'img/tuba.png', 'img/supermix.png', 'img/fundo.jpg', 'img/salmao.jpg', 'img/tilapia.jpg', 'img/camarao.jpg', 'img/mexilhao.jpg', 'img/lula.jpg',
  'img/caneta.jpg', 'img/sacola.jpg', 'img/chaveiro.jpg'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(ARQ); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // Apps Script/Google nunca passa pelo cache
  // cache primeiro (rápido e offline); atualiza em segundo plano quando há internet
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (hit) {
    var rede = fetch(r).then(function (resp) { if (resp && resp.ok) { var c = resp.clone(); caches.open(V).then(function (ch) { ch.put(r, c); }); } return resp; }).catch(function () { return hit || caches.match('index.html'); });
    return hit || rede;
  }));
});
