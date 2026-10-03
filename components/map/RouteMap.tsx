"use client";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/app/map.css";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AttributionControl, LngLatBounds, Map as MLMap, Marker, setWorkerUrl } from "maplibre-gl";
import { setVisited } from "@/app/actions";
import { bearingText, fetchNav, formatDuration, type NavResult, type TravelMode } from "@/lib/map/nav";
import { useGroup } from "@/lib/map/useGroup";
import { loadWarmStyle } from "@/lib/map/style";
import { circlePolygon, directionsUrl, formatDistance, haversineM, type LngLat } from "@/lib/map/geo";

export type MapStop = { id: string; name: string; area: string; coords: LngLat; approx: boolean; index: number; note?: string };
type Props = { stops: MapStop[]; line?: LngLat[]; title?: string; backHref?: string; className?: string; initialStopId?: string; bottomInset?: number; guide?: boolean; routeSlug?: string; travelMode?: TravelMode; grup?: string; lider?: boolean };

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

export default function RouteMap({ stops, line, title, backHref, className = "", initialStopId, bottomInset = 12, guide = false, routeSlug, travelMode = "yuruyus", grup, lider = false }: Props) {
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
  // Yönlendirme modu
  const [cur, setCur] = useState(0);
  const [nav, setNav] = useState<NavResult | null>(null);
  const [navFail, setNavFail] = useState(false);
  const [arrivedId, setArrivedId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const lastFetch = useRef<{ t: number; pos: LngLat; cur: number } | null>(null);
  const lastSpoken = useRef("");
  const target = guide ? stops[cur] ?? null : null;
  const [gname, setGname] = useState("");
  const [gdraft, setGdraft] = useState("");
  const [gopen, setGopen] = useState(false);
  const [copied, setCopied] = useState(false);
  const gMarkers = useRef<globalThis.Map<string, Marker>>(new globalThis.Map());
  useEffect(() => { try { setGname(localStorage.getItem("afyon-ad") ?? ""); } catch { /* yok say */ } }, []);
  const applyStop = useCallback((n: number) => {
    if (n < 0 || n >= stops.length) return;
    setCur(n); setArrivedId(null); setNav(null); setFinished(false); lastFetch.current = null; follow.current = true;
  }, [stops.length]);
  const group = useGroup({ code: grup, leader: lider, name: gname, pos: me?.pos ?? null, cur, onStop: applyStop });

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
        m.addSource("nav", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        m.addLayer({ id: "nav-casing", type: "line", source: "nav", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#FFFFFF", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 6, 17, 13] } });
        m.addLayer({ id: "nav-line", type: "line", source: "nav", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#2F7BF6", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3.5, 17, 7.5] } });
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

  // Canlı konum: önce önbellekteki/ağ tabanlı hızlı konum, ardından yüksek doğruluklu takip
  const startLive = useCallback(() => {
    if (!("geolocation" in navigator)) { setGeoState("error"); return; }
    setGeoState("asking");
    follow.current = true;
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    let first = true;
    const handle = (p: GeolocationPosition) => {
      const pos: LngLat = [p.coords.longitude, p.coords.latitude];
      setMe({ pos, acc: p.coords.accuracy }); setGeoState("on");
      const m = map.current; if (!m) return;
      if (!meMarker.current) {
        const el = document.createElement("div"); el.className = "afy-me"; el.innerHTML = '<span class="pulse"></span><span class="dot"></span>';
        meMarker.current = new Marker({ element: el }).setLngLat(pos).addTo(m);
      } else meMarker.current.setLngLat(pos);
      (m.getSource("acc") as unknown as { setData: (d: GeoJSON.FeatureCollection) => void } | undefined)?.setData({ type: "FeatureCollection", features: [circlePolygon(pos, Math.max(p.coords.accuracy, 8))] });
      if (first || follow.current) { m.easeTo({ center: pos, zoom: Math.max(m.getZoom(), 15), duration: first ? 500 : 800 }); first = false; }
    };
    navigator.geolocation.getCurrentPosition(handle, () => {}, { enableHighAccuracy: false, maximumAge: 600000, timeout: 6000 });
    watchId.current = navigator.geolocation.watchPosition(
      handle,
      (err) => setGeoState((g) => (g === "on" ? g : err.code === 1 ? "denied" : "error")),
      { enableHighAccuracy: true, maximumAge: 8000, timeout: 20000 },
    );
  }, []);
  const stopLive = useCallback(() => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null; follow.current = false; meMarker.current?.remove(); meMarker.current = null;
    (map.current?.getSource("acc") as unknown as { setData: (d: GeoJSON.FeatureCollection) => void } | undefined)?.setData({ type: "FeatureCollection", features: [] });
    setMe(null); setGeoState("off");
  }, []);

  // Grup üyelerinin işaretçileri
  useEffect(() => {
    const m = map.current; if (!m || !ready) return;
    const seen = new Set<string>();
    for (const g of group.members) {
      if (g.id === group.myId || !g.pos) continue;
      seen.add(g.id);
      let mk = gMarkers.current.get(g.id);
      if (!mk) {
        const el = document.createElement("div");
        el.style.cssText = `width:30px;height:30px;border-radius:50%;background:${g.color};color:#fff;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font:700 12px sans-serif`;
        el.textContent = g.name.slice(0, 1).toLocaleUpperCase("tr"); el.title = g.name;
        mk = new Marker({ element: el }).setLngLat(g.pos).addTo(m); gMarkers.current.set(g.id, mk);
      } else mk.setLngLat(g.pos);
    }
    gMarkers.current.forEach((mk, id) => { if (!seen.has(id)) { mk.remove(); gMarkers.current.delete(id); } });
  }, [group.members, group.myId, ready]);

  // Yönlendirme: açılışta canlı konumu başlat, ekranı açık tut
  useEffect(() => {
    if (!guide || !ready) return;
    startLive();
    let lock: { release: () => Promise<void> } | null = null;
    (navigator as unknown as { wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> } }).wakeLock?.request("screen").then((l) => { lock = l; }).catch(() => {});
    return () => { lock?.release().catch(() => {}); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide, ready]);

  // Hedef durağa yürüyüş/sürüş yönlendirmesi (konum 40 m değişince veya 30 sn'de bir tazelenir)
  useEffect(() => {
    if (!guide || !target || !me || arrivedId === target.id || finished) return;
    const lf = lastFetch.current;
    if (lf && lf.cur === cur && Date.now() - lf.t < 30000 && haversineM(lf.pos, me.pos) < 40) return;
    lastFetch.current = { t: Date.now(), pos: me.pos, cur };
    const ctl = new AbortController();
    const slow = setTimeout(() => ctl.abort(), 9000);
    // Yol hesaplanırken anında düz çizgi göster
    (map.current?.getSource("nav") as unknown as { setData: (d: GeoJSON.Feature) => void } | undefined)?.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [me.pos, target.coords] } });
    fetchNav(me.pos, target.coords, travelMode, ctl.signal).then((r) => {
      clearTimeout(slow);
      if (ctl.signal.aborted && !r) { setNav(null); setNavFail(true); return; }
      setNav(r); setNavFail(!r);
      (map.current?.getSource("nav") as unknown as { setData: (d: GeoJSON.Feature | GeoJSON.FeatureCollection) => void } | undefined)?.setData(
        r ? { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: r.coords } } : { type: "FeatureCollection", features: [] });
    });
    return () => { clearTimeout(slow); ctl.abort(); };
  }, [guide, target, me, cur, arrivedId, finished, travelMode]);

  // Varış algılama (45 m)
  useEffect(() => {
    if (!guide || !target || !me || arrivedId === target.id || finished) return;
    if (haversineM(me.pos, target.coords) <= 45) {
      setArrivedId(target.id);
      if (routeSlug) setVisited(routeSlug, target.id, true).catch(() => {});
      if ("vibrate" in navigator) navigator.vibrate?.(200);
    }
  }, [guide, target, me, arrivedId, finished, routeSlug]);

  const nextStop = useCallback(() => {
    const n = cur + 1;
    if (n >= stops.length) { setFinished(true); setNav(null); (map.current?.getSource("nav") as unknown as { setData: (d: GeoJSON.FeatureCollection) => void } | undefined)?.setData({ type: "FeatureCollection", features: [] }); return; }
    setCur(n); setArrivedId(null); setNav(null); lastFetch.current = null; focusStop(stops[n].id); follow.current = true;
    if (grup && lider) group.broadcastStop(n);
  }, [cur, stops, focusStop, grup, lider, group]);

  const step = nav?.steps[0];
  const straightD = target && me ? haversineM(me.pos, target.coords) : null;
  // Sesli yönlendirme
  useEffect(() => {
    if (!guide || !voiceOn || !step || !("speechSynthesis" in window)) return;
    const msg = step.dist < 400 ? `${Math.round(step.dist / 10) * 10} metre sonra, ${step.text}` : "";
    if (msg && msg !== lastSpoken.current && step.dist < 200) { lastSpoken.current = msg; const u = new SpeechSynthesisUtterance(msg); u.lang = "tr-TR"; u.rate = 0.95; window.speechSynthesis.speak(u); }
  }, [guide, voiceOn, step]);

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

      {grup && !gname && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-navy/50 p-6">
          <form className="glass w-full max-w-[340px] rounded-[28px] p-5" onSubmit={(e) => { e.preventDefault(); const n = gdraft.trim().slice(0, 24); if (n.length < 2) return; try { localStorage.setItem("afyon-ad", n); } catch { /* yok say */ } setGname(n); }}>
            <p className="font-display text-xl font-semibold text-navy">Gruba katılın</p>
            <p className="mt-1 text-xs text-ink-2">Kod: <b className="tracking-[2px]">{grup}</b>. Grup arkadaşlarınız adınızı ve konumunuzu haritada görecek.</p>
            <input value={gdraft} onChange={(e) => setGdraft(e.target.value)} placeholder="Adınız" maxLength={24} autoFocus className="mt-3 h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra" />
            <button disabled={gdraft.trim().length < 2} className="terra-grad mt-3 h-12 w-full rounded-full text-sm font-bold text-white disabled:opacity-50">Katıl</button>
          </form>
        </div>
      )}

      {/* Yönlendirme: sıradaki manevra */}
      {guide && target && !finished && arrivedId !== target.id && (
        <div className="absolute left-3 right-[68px] top-[64px] z-10 flex items-center gap-3 rounded-[22px] bg-navy/95 p-3 text-white shadow-lift backdrop-blur">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${step?.rot ?? 0}deg)`, transition: "transform .3s" }}><path d="M12 20V5M5 11l7-7 7 7" /></svg>
          </span>
          <div className="min-w-0 flex-1">
            {step ? (<><p className="font-display text-[20px] font-semibold leading-none">{step.dist < 950 ? `${Math.round(step.dist / 10) * 10} m` : formatDistance(step.dist)}</p><p className="mt-1 truncate text-[13px] font-medium opacity-90">{step.text}</p></>)
              : me ? (<p className="text-[13px] font-semibold leading-snug">{straightD != null ? `${target.name} ${bearingText(me.pos, target.coords)} yönünde, ${formatDistance(straightD)}${navFail ? "" : " · yol hesaplanıyor"}` : "Yol hesaplanıyor…"}</p>) : <p className="text-[13px] font-semibold">Konumunuz bekleniyor…</p>}
          </div>
          <button type="button" aria-pressed={voiceOn} aria-label="Sesli yönlendirme" onClick={() => setVoiceOn((v) => !v)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${voiceOn ? "bg-white text-navy" : "bg-white/15 text-white"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
          </button>
        </div>
      )}

      {/* Alt: durak kartı */}
      <div className="absolute inset-x-3 z-10 flex flex-col gap-2" style={{ bottom: full ? 12 : bottomInset }}>
        {grup && gname && (
          <div className="flex flex-col items-center gap-2">
            {gopen && (
              <div className="glass w-full rounded-[22px] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-mute">Grup kodu <b className="ml-1 font-display text-[17px] tracking-[3px] text-navy">{grup}</b></p>
                  <button type="button" onClick={() => { const u = `${location.origin}/harita?rota=${routeSlug ?? ""}&takip=1&mod=${travelMode}&grup=${grup}`; if (navigator.share) { navigator.share({ title: "Afyon turuna katıl", text: `Afyon Şehir Rotası grup turuna katıl (kod ${grup})`, url: u }).catch(() => {}); } else { navigator.clipboard?.writeText(u); setCopied(true); setTimeout(() => setCopied(false), 1800); } }} className="rounded-full bg-navy px-3 py-1.5 text-[11px] font-bold text-white">{copied ? "Kopyalandı" : "Davet et"}</button>
                </div>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {[{ id: group.myId, name: `${gname} (siz)`, color: "#B4532A", pos: me?.pos ?? null, cur, leader: lider }, ...group.members.filter((g) => g.id !== group.myId)].map((g) => (
                    <li key={g.id} className="flex items-center gap-2 text-[13px] font-semibold">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: g.color }}>{g.name.slice(0, 1).toLocaleUpperCase("tr")}</span>
                      <span className="min-w-0 flex-1 truncate">{g.name}{g.leader ? " · rehber" : ""}</span>
                      <span className="text-[11px] text-mute">{g.id === group.myId ? "" : g.pos && me ? formatDistance(haversineM(me.pos, g.pos)) : "konum yok"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button type="button" onClick={() => setGopen((o) => !o)} aria-expanded={gopen} className="glass rounded-full px-4 py-2 text-xs font-bold text-navy">
              <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${group.status === "ok" ? "bg-[#1F9D6B]" : group.status === "error" ? "bg-[#C2410C]" : "bg-[#CA8A04]"}`} />
              Grup {grup} · {Math.max(1, group.members.length)} kişi{group.status === "error" ? " · bağlantı yok" : group.status === "connecting" ? " · bağlanıyor" : ""}
            </button>
          </div>
        )}
        {geoState === "asking" && <p className="glass self-center rounded-full px-4 py-2 text-xs font-semibold text-navy">Konumunuz aranıyor…</p>}
        {geoState === "denied" && <p role="alert" className="self-center rounded-2xl bg-[#FBE4DC] px-4 py-2 text-xs font-semibold text-[#8E2C12]">Konum izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz.</p>}
        {geoState === "error" && <p role="alert" className="self-center rounded-2xl bg-[#FBE4DC] px-4 py-2 text-xs font-semibold text-[#8E2C12]">Konum alınamadı. Daha açık bir alanda tekrar deneyin.</p>}
        {live && nearest && <button type="button" onClick={() => focusStop(nearest.stop.id)} className="glass self-center rounded-full px-4 py-2 text-xs font-semibold text-navy">En yakın durak: <b>{nearest.stop.name}</b> · {formatDistance(nearest.d)}</button>}
        {guide && target && !finished && (
          <div className="glass rounded-[26px] p-3.5">
            {arrivedId === target.id ? (
              <>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4F6B2F]">Vardınız · {cur + 1}/{stops.length}</p>
                <p className="mt-0.5 font-display text-[19px] font-semibold leading-tight text-navy">{target.name}</p>
                <p className="mt-1 text-xs text-ink-2">Durak ziyaret edildi olarak işaretlendi.</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/duraklar/${target.id}`} className="flex h-11 items-center justify-center rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-navy shadow-card">Anlatımı dinle</Link>
                  {grup && !lider ? <p className="flex h-11 flex-1 items-center rounded-full bg-sand px-4 text-xs font-semibold text-ink-2">Rehber ilerletince grup sonraki durağa geçer</p> : <button type="button" onClick={nextStop} className="terra-grad h-11 flex-1 rounded-full text-sm font-bold text-white">{cur + 1 < stops.length ? `Sonraki: ${stops[cur + 1].name}` : "Rotayı bitir"}</button>}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <span className={`afy-pin-dot static ${target.approx ? "approx" : ""}`}>{target.index}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-mute">Sıradaki durak · {cur + 1}/{stops.length}</p>
                    <p className="font-display text-[18px] font-semibold leading-tight text-navy">{target.name}</p>
                    <p className="mt-0.5 text-[12px] font-semibold text-terra">{nav ? `${formatDistance(nav.dist)} · yaklaşık ${formatDuration(nav.dur)}` : straightD != null ? `${formatDistance(straightD)} (kuş uçuşu)` : "Konum bekleniyor"}</p>
                    {target.approx && <p className="mt-1 text-[11px] font-semibold text-terra">Konum yaklaşıktır; varış algılanmazsa “Atla”yı kullanın.</p>}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/duraklar/${target.id}`} className="flex h-11 flex-1 items-center justify-center rounded-full border border-line bg-white/80 text-sm font-bold text-navy shadow-card">Durak bilgisi</Link>
                  {!(grup && !lider) && <button type="button" onClick={nextStop} className="flex h-11 items-center justify-center rounded-full border border-line bg-white/80 px-5 text-sm font-bold text-navy shadow-card">Atla</button>}
                </div>
              </>
            )}
          </div>
        )}
        {guide && finished && (
          <div className="glass rounded-[26px] p-4 text-center">
            <p className="font-display text-xl font-semibold text-navy">Rotayı tamamladınız!</p>
            <p className="mt-1 text-xs text-ink-2">Tüm duraklar bitti. Yolculuğunuz için teşekkürler.</p>
            <Link href={routeSlug ? `/rotalar/${routeSlug}` : "/"} className="terra-grad mt-3 flex h-11 items-center justify-center rounded-full text-sm font-bold text-white">Rotaya dön</Link>
          </div>
        )}
        {sel && !guide && (
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
              <a href={directionsUrl(sel.coords, me?.pos)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center rounded-full border border-line bg-white/80 shadow-card px-4 text-sm font-bold text-navy">Yol tarifi</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
