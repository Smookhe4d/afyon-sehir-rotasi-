// Çevrimdışı destek. G-017: sürüm v5.
// Adı değişmeyen görseller (logo, ikon, fotoğraf) önbellekten hemen gösterilir ama arkada yenilenir, eski logo kalıcı olarak takılı kalmaz.
// Yalnızca adı içeriğine göre değişen /_next/static dosyaları kalıcı önbellekten okunur. Sayfalar önce ağdan gelir.
const V = "afyon-v5";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/auth") || u.pathname.startsWith("/api")) return;
  if (u.pathname.startsWith("/_next/static/")) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })));
    return;
  }
  if (/\.(woff2?|svg|jpg|jpeg|png|webp|geojson)$/.test(u.pathname)) {
    e.respondWith(caches.open(V).then((c) => c.match(r).then((hit) => {
      const net = fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
      if (hit) { e.waitUntil(net); return hit; }
      return net;
    })));
    return;
  }
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r).then((hit) => hit || caches.match("/"))));
  }
});
