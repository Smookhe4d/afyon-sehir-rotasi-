// Çevrimdışı destek. G-027: sürüm v6.
// Adı değişmeyen görseller (logo, ikon, fotoğraf) önbellekten hemen gösterilir ama arkada yenilenir, eski logo kalıcı olarak takılı kalmaz.
// Yalnızca adı içeriğine göre değişen /_next/static dosyaları kalıcı önbellekten okunur. Sayfalar önce ağdan gelir.
// G-027: Tur açılınca rotanın fotoğrafları ve sesli anlatımları kullanıcıya bir şey göstermeden arka planda indirilir.
// Ses dosyaları parça parça (Range) istendiği için önbellekteki tam dosyadan istenen parça kesilip verilir.
// Harita altlığı (OpenFreeMap) görüldükçe saklanır, internet kesilince son görülen bölge açılır.
const V = "afyon-v6";
const MAP = "afyon-harita-v1";
const MAP_MAX = 1500;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V && k !== MAP).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });

async function rangeFrom(res, range) {
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range || "");
  const size = buf.byteLength;
  let a = m && m[1] ? Number(m[1]) : 0;
  let b = m && m[2] ? Number(m[2]) : size - 1;
  if (m && !m[1] && m[2]) { a = Math.max(0, size - Number(m[2])); b = size - 1; }
  b = Math.min(b, size - 1);
  if (a > b) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(buf.slice(a, b + 1), { status: 206, headers: { "Content-Type": res.headers.get("Content-Type") || "audio/mpeg", "Content-Range": `bytes ${a}-${b}/${size}`, "Content-Length": String(b - a + 1), "Accept-Ranges": "bytes" } });
}

async function store(url) {
  const c = await caches.open(V);
  if (await c.match(url)) return;
  const res = await fetch(url, { cache: "no-cache" });
  if (res.ok && res.status === 200) await c.put(url, res);
}

async function trimMap() {
  const c = await caches.open(MAP);
  const ks = await c.keys();
  if (ks.length > MAP_MAX) await Promise.all(ks.slice(0, ks.length - MAP_MAX).map((k) => c.delete(k)));
}

self.addEventListener("message", (e) => {
  const d = e.data;
  if (!d || d.type !== "onbellek" || !Array.isArray(d.urls)) return;
  const urls = d.urls.filter((u) => typeof u === "string" && u.startsWith("/")).slice(0, 300);
  // Teker teker indirilir, telefonun bağlantısını tıkamaz
  e.waitUntil((async () => { for (const u of urls) { try { await store(u); } catch { /* bağlantı yoksa sonra tekrar denenir */ } } })());
});

self.addEventListener("fetch", (e) => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== "GET") return;
  if (u.hostname === "tiles.openfreemap.org") {
    e.respondWith(caches.open(MAP).then((c) => c.match(r).then((hit) => {
      const net = fetch(r).then((res) => { if (res.ok) { c.put(r, res.clone()).then(trimMap); } return res; }).catch(() => hit || Response.error());
      return hit && !/\/styles\//.test(u.pathname) ? (e.waitUntil(net.catch(() => {})), hit) : net;
    })));
    return;
  }
  if (u.origin !== location.origin || u.pathname.startsWith("/auth") || u.pathname.startsWith("/api")) return;
  if (u.pathname.startsWith("/_next/static/")) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })));
    return;
  }
  if (/\.mp3$/.test(u.pathname)) {
    e.respondWith(caches.open(V).then((c) => c.match(u.pathname).then((hit) => {
      if (hit) return r.headers.get("range") ? rangeFrom(hit, r.headers.get("range")) : hit;
      // Önbellekte yoksa ağdan çalınır, tam dosya arkada saklanır
      e.waitUntil(store(u.pathname).catch(() => {}));
      return fetch(r);
    })));
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
      .catch(() => caches.match(r).then((hit) => hit || caches.match(r, { ignoreSearch: true }) || caches.match("/"))));
  }
});
