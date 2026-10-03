// Çevrimdışı destek: statik dosyalar önbellekten, sayfalar önce ağdan (olmazsa son görülen kopya).
const V = "afyon-v3";
const SHELL = ["/", "/rotalar", "/harita", "/art/hero-kale.svg", "/art/pattern.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/auth") || u.pathname.startsWith("/api")) return;
  const isStatic = /^\/(_next\/static|photos|art)\//.test(u.pathname) || /\.(woff2?|svg|jpg|png|webp)$/.test(u.pathname);
  if (isStatic) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); return res; })));
    return;
  }
  if (r.mode === "navigate" || r.headers.get("accept")?.includes("text/html") || u.search.includes("_rsc")) {
    e.respondWith(fetch(r).then((res) => { if (res.ok && !u.search.includes("_rsc")) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r).then((hit) => hit || caches.match("/"))));
  }
});
