import { NextResponse } from "next/server";
import { placesFull } from "@/lib/placesFull";

/**
 * G-023: Google Places API (New) ile durağın güncel fotoğrafları.
 * Google kurallarına uygun olarak yalnızca yer kimliği (place ID) önbelleğe alınır. Fotoğraf listesi ve
 * fotoğraf adresleri her istekte Google'dan alınır, saklanmaz. Her fotoğrafla çekenlerin adı döner.
 * Anahtar yoksa ya da Google yanıt vermezse 204 döner, arayüz mevcut fotoğrafla devam eder.
 * Yalnızca aşağıdaki duraklar kabul edilir, böylece başka bir yerin fotoğrafı gelmez.
 */
const KEY = process.env.GOOGLE_MAPS_API_KEY;

// Google Haritalar'da doğrulanmış adlar (Kasım 2026, yürüyüş güzergâhı kontrolü).
const QUERY: Record<string, string> = {
  "ulu-cami": "Afyon Ulu Camii",
  "millet-hamami": "Millet Hamamı Afyonkarahisar",
  "mevlevihane": "Sultan Divani Mevlevihanesi Müzesi",
  "kadinanalar-turbesi": "Kadınana Türbesi Afyonkarahisar",
  "afyon-konaklari": "Afyonkarahisar Tarihî Konak ve Evleri",
  "tashan-merkez": "Tarihi Taşhan Alem-i Çarşı",
  "uzun-carsi": "Uzun Çarşı Afyonkarahisar",
  "imaret-cami": "Gedik Ahmet Paşa İmaret Camii",
  "anitpark": "Anıt Park Afyonkarahisar",
  "zafer-muzesi": "Zafer Müzesi Afyonkarahisar",
};

// Basit kötüye kullanım sınırı: aynı adresten dakikada en çok 60 istek (sunucu örneği başına).
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now(), h = hits.get(ip);
  if (!h || now - h.t > 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > 60;
}

const none = (why = "") => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store", "X-Yer-Foto": why } });

/** Yer kimliği Google kurallarına göre süresiz saklanabilir. Yalnızca kimlik istenir (ücretsiz SKU). */
let lastErr = "";
async function placeIdOf(id: string): Promise<string | null> {
  const p = placesFull[id];
  const body: Record<string, unknown> = { textQuery: QUERY[id], languageCode: "tr", maxResultCount: 1 };
  if (p?.coords) body.locationBias = { circle: { center: { latitude: p.coords[1], longitude: p.coords[0] }, radius: 300 } };
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY!, "X-Goog-FieldMask": "places.id" },
    body: JSON.stringify(body),
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (!r.ok) { lastErr = `arama-${r.status}`; console.error("yer-foto searchText", r.status, (await r.text()).slice(0, 300)); return null; }
  return ((await r.json()).places?.[0]?.id as string | undefined) ?? null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  if (!(id in QUERY)) return NextResponse.json({ error: "bilinmeyen durak" }, { status: 404 });
  if (!KEY) return none("anahtar-yok");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (limited(ip)) return new NextResponse(null, { status: 429 });

  try {
    const pid = await placeIdOf(id);
    if (!pid) return none(lastErr || "yer-bulunamadi");

    // Tek fotoğraf: Google'dan o anki adres alınır ve tarayıcı oraya yönlendirilir.
    const foto = url.searchParams.get("foto");
    if (foto) {
      if (!foto.startsWith(`places/${pid}/photos/`) || !/^[\w/-]+$/.test(foto)) return NextResponse.json({ error: "geçersiz fotoğraf" }, { status: 400 });
      const m = await fetch(`https://places.googleapis.com/v1/${foto}/media?maxWidthPx=1200&skipHttpRedirect=true`, { headers: { "X-Goog-Api-Key": KEY }, cache: "no-store" });
      const uri = m.ok ? ((await m.json()).photoUri as string | undefined) : undefined;
      if (!uri) return none();
      return NextResponse.redirect(uri, { status: 302, headers: { "Cache-Control": "no-store" } });
    }

    // Fotoğraf listesi ve atıflar. Her istekte Google'dan alınır, önbelleğe alınmaz.
    const p = placesFull[id];
    const body: Record<string, unknown> = { textQuery: QUERY[id], languageCode: "tr", maxResultCount: 1 };
    if (p?.coords) body.locationBias = { circle: { center: { latitude: p.coords[1], longitude: p.coords[0] }, radius: 300 } };
    const d = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST", cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "places.id,places.photos,places.googleMapsUri" },
      body: JSON.stringify(body),
    });
    if (!d.ok) { console.error("yer-foto search", d.status, (await d.text()).slice(0, 300)); return none(`arama-${d.status}`); }
    const js = await d.json();
    const place = (js.places?.[0] ?? {}) as { id?: string; googleMapsUri?: string; photos?: { name: string; authorAttributions?: { displayName?: string; uri?: string }[] }[] };
    if (place.id && place.id !== pid) return none("kimlik-farkli");
    const photos = (place.photos ?? []).slice(0, 6).map((p) => ({
      ref: p.name,
      authors: (p.authorAttributions ?? []).map((a) => ({ name: a.displayName ?? "", uri: a.uri ?? "" })).filter((a) => a.name),
    }));
    if (!photos.length) return none(`foto-yok-${js.places?.length ?? 0}-${Object.keys(place).join(".")}`);
    return NextResponse.json({ photos, maps: place.googleMapsUri ?? "" }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("yer-foto", e);
    return none();
  }
}
