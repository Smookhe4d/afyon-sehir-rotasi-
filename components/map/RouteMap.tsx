"use client";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/app/map.css";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AttributionControl, LngLatBounds, Map as MLMap, Marker, setWorkerUrl } from "maplibre-gl";
import { loadWarmStyle } from "@/lib/map/style";
import { circlePolygon, directionsUrl, formatDistance, haversineM, type LngLat } from "@/lib/map/geo";

export type MapStop = { id: string; name: string; area: string; coords: LngLat; approx: boolean; index: number; note?: string };
type Props = { stops: MapStop[]; line?: LngLat[]; title?: string; backHref?: string; className?: string; initialStopId?: string; bottomInset?: number };

// MapLibre 6 çalışma dosyası (worker) ayrı bir modüldür; aynı kökenli bir blob üzerinden CDN'den içe aktarılır.
const MAPLIBRE_VERSION = "6.11.2";
function workerBlobUrl() {
  const src = `import "https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl-worker.mjs";`;
  return URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
}
const TERRA = "#B4532A";
const AFYON: LngLat = [30.5387, 38.7507];

function pinEl(label: string, approx: boolean) {
  const el = document.createElement("button");
  el.type = "button"; el.setAttribute("aria-label", label);
  el.className = "afy-pin";
  el.innerHTML = `<span class="afy-pin-dot${approx ? " approx" : ""}">${label}</span>`;
  return el;
}

export default function RouteMap({ stops, line, title, backHref, className = "", initialStopId, bottomInset = 12 }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const meMarker = useRef<Marker | null>(null);
  const watchId = useRef<number | null>(null);
  const follow = useRef(false);
  const roRef = useRef<ResizeObserver | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(initialStopId ?? stops[0]?.id ?? null);
  const [me, setMe] = useState<{ pos: LngLat; acc: number } | null>(null);
  const [geoState, setGeoState] = useState<"off" | "asking" | "on" | "denied" | "error">("off");
  const [full, setFull] = useState(false);

  const sel = useMemo(() => stops.find((s) => s.id === selected) ?? null, [stops, selected]);
  const selIdx = sel ? stops.findIndex((s) => s.id === sel.id) : -1;
  const nearest = useMemo(() => {
    if (!me || !stops.length) return null;
    let best = stops[0], d = Infinity;
    for (const s of stops) { const x = haversineM(me.pos, s.coords); if (x < d) { d = x; best = s; } }
    return { stop: best, d };
  }, [me, stops]);

  const fitAll = useCallback(() => {
    const m = map.current; if (!m) return;
    const pts: LngLat[] = [...stops.map((s) => s.coords), ...(me ? [me.pos] : [])];
    if (!pts.length) { m.jumpTo({ center: AFYON, zoom: 11 }); return; }
    if (pts.length === 1) { m.easeTo({ center: pts[0], zoom: 15, duration: 700 }); return; }
    const b = new LngLatBounds(pts[0], pts[0]); pts.forEach((p) => b.extend(p));
    m.fitBounds(b, { padding: { top: 90, bottom: 230 + (bottomInset - 12), left: 40, right: 40 }, duration: 800, maxZoom: 15 });
  }, [stops, me, bottomInset]);

  // Harita kurulumu
  useEffect(() => {
    let cancelled = false;
    let m: MLMap | null = null;
    (async () => {
      const style = await loadWarmStyle();
      if (cancelled || !box.current) return;
      setWorkerUrl(workerBlobUrl());
      m = new MLMap({ container: box.current, style, center: stops[0]?.coords ?? AFYON, zoom: 11, attributionControl: false, pitchWithRotate: true, maxPitch: 60 });
      map.current = m;
      const ro = new ResizeObserver(() => m?.resize()); ro.observe(box.current); roRef.current = ro;
      m.addControl(new AttributionControl({ compact: true }), "bottom-left");
      m.on("load", () => {
        if (!m) return;
        m.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: line && line.length > 1 ? line : stops.map((s) => s.coords) } } });
        const real = Boolean(line && line.length > 1);
        m.addLayer({ id: "route-casing", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#FFFFFF", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5, 15, 10], "line-opacity": 0.95 } });
        m.addLayer({ id: "route-line", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": TERRA, "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2.5, 15, 5], ...(real ? {} : { "line-dasharray": [1.5, 2] }) } });
        m.addSource("acc", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        m.addLayer({ id: "acc-fill", type: "fill", source: "acc", paint: { "fill-color": "#2F7BF6", "fill-opacity": 0.14 } }, "route-casing");
        m.addLayer({ id: "acc-line", type: "line", source: "acc", paint: { "line-color": "#2F7BF6", "line-opacity": 0.35, "line-width": 1 } }, "route-casing");
        setReady(true);
      });
      m.on("dragstart", () => { follow.current = false; });
    })();
    return () => { cancelled = true; roRef.current?.disconnect(); if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current); markers.current.forEach((k) => k.remove()); meMarker.current?.remove(); m?.remove(); map.current = null; setReady(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Durak işaretçileri
  useEffect(() => {
    const m = map.current; if (!m || !ready) return;
    markers.current.forEach((k) => k.remove()); markers.current = [];
    for (const s of stops) {
      const el = pinEl(String(s.index), s.approx);
      el.addEventListener("click", (e) => { e.stopPropagation(); setSelected(s.id); follow.current = false; });
      markers.current.push(new Marker({ element: el, anchor: "center" }).setLngLat(s.coords).addTo(m));
    }
    fitAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, stops]);

  // Seçili işaretçi vurgusu + haritayı o durağa getirme
  useEffect(() => {
    const els = markers.current.map((k) => k.getElement());
    els.forEach((el, i) => el.classList.toggle("sel", stops[i]?.id === selected));
  }, [selected, stops, ready]);
  const focusStop = useCallback((id: string) => {
    const s = stops.find((x) => x.id === id); if (!s) return;
    setSelected(id); follow.current = false;
    map.current?.easeTo({ center: s.coords, zoom: Math.max(map.current.getZoom(), 14.2), duration: 650, padding: { top: 60, bottom: 200 + (bottomInset - 12), left: 20, right: 20 } });
  }, [stops]);
  useEffect(() => { if (ready && initialStopId) focusStop(initialStopId); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [ready]);

  // Canlı konum
  const startLive = useCallback(() => {
    if (!("geolocation" in navigator)) { setGeoState("error"); return; }
    setGeoState("asking");
    follow.current = true;
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    let first = true;
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        const pos: LngLat = [p.coords.longitude, p.coords.latitude];
        setMe({ pos, acc: p.coords.accuracy }); setGeoState("on");
        const m = map.current; if (!m) return;
        if (!meMarker.current) {
          const el = document.createElement("div"); el.className = "afy-me"; el.innerHTML = '<span class="pulse"></span><span class="dot"></span>';
          meMarker.current = new Marker({ element: el }).setLngLat(pos).addTo(m);
        } else meMarker.current.setLngLat(pos);
        (m.getSource("acc") as unknown as { setData: (d: GeoJSON.FeatureCollection) => void } | undefined)?.setData({ type: "FeatureCollection", features: [circlePolygon(pos, Math.max(p.coords.accuracy, 8))] });
        if (first || follow.current) { m.easeTo({ center: pos, zoom: Math.max(m.getZoom(), 15), duration: 800 }); first = false; }
      },
      (err) => setGeoState(err.code === 1 ? "denied" : "error"),
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 20000 },
    );
  }, []);
  const stopLive = useCallback(() => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null; follow.current = false; meMarker.current?.remove(); meMarker.current = null;
    (map.current?.getSource("acc") as unknown as { setData: (d: GeoJSON.FeatureCollection) => void } | undefined)?.setData({ type: "FeatureCollection", features: [] });
    setMe(null); setGeoState("off");
  }, []);

  useEffect(() => { const t = setTimeout(() => map.current?.resize(), 60); return () => clearTimeout(t); }, [full]);
  const go = (d: number) => { const n = stops[(selIdx + d + stops.length) % stops.length]; if (n) focusStop(n.id); };
  const live = geoState === "on";

  return (
    <div className={`${full ? "fixed inset-0 z-[60]" : "relative"} overflow-hidden bg-[#F4EDE0] ${className}`}>
      <div ref={box} style={{ position: "absolute", inset: 0 }} role="application" aria-label="Rota haritası" />

      {/* Üst: başlık + kontroller */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
        <div className="pointer-events-auto flex min-w-0 items-center gap-2">
          {backHref && <Link href={backHref} aria-label="Geri" className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy">‹</Link>}
          {title && <div className="glass min-w-0 rounded-full px-4 py-2.5"><p className="truncate text-[13px] font-bold text-navy">{title}</p></div>}
        </div>
        <div className="pointer-events-auto flex flex-col gap-2">
          <button type="button" aria-label="Tam ekran" onClick={() => setFull((f) => !f)} className="glass flex h-11 w-11 items-center justify-center rounded-full text-navy">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{full ? <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /> : <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />}</svg>
          </button>
          <button type="button" aria-label="Tüm durakları göster" onClick={fitAll} className="glass flex h-11 w-11 items-center justify-center rounded-full text-navy">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15" /></svg>
          </button>
          <button type="button" aria-label={live ? "Canlı konumu kapat" : "Konumumu göster"} aria-pressed={live} onClick={() => (live ? stopLive() : startLive())}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${live ? "bg-[#2F7BF6] text-white shadow-[0_6px_16px_rgba(47,123,246,.45)]" : "glass text-navy"}`}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill={live ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
          </button>
        </div>
      </div>

      {/* Alt: durak kartı */}
      <div className="absolute inset-x-3 z-10 flex flex-col gap-2" style={{ bottom: full ? 12 : bottomInset }}>
        {geoState === "asking" && <p className="glass self-center rounded-full px-4 py-2 text-xs font-semibold text-navy">Konumunuz aranıyor…</p>}
        {geoState === "denied" && <p role="alert" className="self-center rounded-2xl bg-[#FBE4DC] px-4 py-2 text-xs font-semibold text-[#8E2C12]">Konum izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz.</p>}
        {geoState === "error" && <p role="alert" className="self-center rounded-2xl bg-[#FBE4DC] px-4 py-2 text-xs font-semibold text-[#8E2C12]">Konum alınamadı. Daha açık bir alanda tekrar deneyin.</p>}
        {live && nearest && <button type="button" onClick={() => focusStop(nearest.stop.id)} className="glass self-center rounded-full px-4 py-2 text-xs font-semibold text-navy">En yakın durak: <b>{nearest.stop.name}</b> · {formatDistance(nearest.d)}</button>}
        {sel && (
          <div className="glass rounded-[26px] p-3.5">
            <div className="flex items-start gap-3">
              <span className={`afy-pin-dot static ${sel.approx ? "approx" : ""}`}>{sel.index}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[17px] font-semibold leading-tight text-navy">{sel.name}</p>
                <p className="text-[11px] font-semibold text-mute">{sel.area}{live && me ? ` · ${formatDistance(haversineM(me.pos, sel.coords))} uzaklıkta` : ""}</p>
                {sel.approx && <p className="mt-1 text-[11px] font-semibold text-terra">Konum yaklaşıktır; bina doğrulanmadı.</p>}
              </div>
              {stops.length > 1 && (
                <div className="flex shrink-0 gap-1">
                  <button type="button" aria-label="Önceki durak" onClick={() => go(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-navy">‹</button>
                  <button type="button" aria-label="Sonraki durak" onClick={() => go(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-navy">›</button>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/duraklar/${sel.id}`} className="terra-grad flex h-11 flex-1 items-center justify-center rounded-full text-sm font-bold text-white">Durak bilgisi</Link>
              <a href={directionsUrl(sel.coords, me?.pos)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-navy">Yol tarifi</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
