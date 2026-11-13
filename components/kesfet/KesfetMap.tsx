"use client";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/app/map.css";
import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { AttributionControl, LngLatBounds, Map as MLMap, Marker, Popup, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import { loadWarmStyle } from "@/lib/map/style";
import type { LngLat } from "@/lib/map/geo";

export type KStop = { id: string; c: LngLat; cat: string; color: string; name: string };
export type KRoute = { slug: string; line: LngLat[]; stops: { id: string; c: LngLat }[] };

const MAPLIBRE_VERSION = "6.11.2";
const workerBlobUrl = () => URL.createObjectURL(new Blob([`import "https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl-worker.mjs";`], { type: "text/javascript" }));
const ac = () => getComputedStyle(document.documentElement).getPropertyValue("--ac").trim() || "#60117B";
const fc = (features: GeoJSON.Feature[]) => ({ type: "FeatureCollection" as const, features });

/**
 * G-011: Keşfet haritası. İl içi duraklar tema rengindeki noktalarla görünür.
 * Panelde öne gelen rota haritada baştan sona çizilir, durakları sırayla belirir.
 * Tema seçimi ("kesfet-cat") noktaları süzer, tema rengi ("afyon-theme") çizgiyi boyar.
 */
export default function KesfetMap({ stops, routes, label, poiLabel = {} }: { stops: KStop[]; routes: KRoute[]; label: string; poiLabel?: Record<string, string> }) {
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    let m: MLMap | null = null, cancelled = false, raf = 0;
    let pins: Marker[] = [];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pad = () => ({ top: 160, left: 30, right: 70, bottom: Math.round(innerHeight * 0.5) + 20 });
    const draw = (slug: string | null) => {
      if (!m) return;
      cancelAnimationFrame(raf); pins.forEach((p) => p.remove()); pins = [];
      const src = m.getSource("rl") as GeoJSONSource | undefined;
      const r = routes.find((x) => x.slug === slug);
      m.setPaintProperty("stops", "circle-opacity", r ? 0.3 : 1); m.setPaintProperty("stops-h", "circle-opacity", r ? 0.35 : 0.92);
      if (!r || !src) { src?.setData(fc([])); return; }
      const pts = r.line.length > 1 ? r.line : r.stops.map((s) => s.c);
      const b = pts.reduce((bb, p) => bb.extend(p), new LngLatBounds(pts[0], pts[0]));
      m.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
      m.fitBounds(b, { padding: pad(), maxZoom: 13.5, duration: reduce ? 0 : 1300 });
      const t0 = performance.now(), dur = reduce ? 0 : 1600;
      const step = () => {
        const k = dur ? Math.min(1, Math.max(0, (performance.now() - t0 - 450) / dur)) : 1;
        const n = Math.max(2, Math.round(pts.length * (1 - Math.pow(1 - k, 3))));
        src.setData(fc([{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: pts.slice(0, n) } }]));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      r.stops.forEach((s, i) => {
        const el = document.createElement("div");
        el.innerHTML = `<span class="kz-pin" style="animation-delay:${reduce ? 0 : 500 + i * 90}ms">${i + 1}</span>`;
        pins.push(new Marker({ element: el }).setLngLat(s.c).addTo(m!));
      });
    };
    (async () => {
      const style = await loadWarmStyle();
      if (cancelled || !box.current) return;
      setWorkerUrl(workerBlobUrl());
      m = new MLMap({ container: box.current, style, center: [30.62, 38.9], zoom: 6.9, minZoom: 5.5, attributionControl: false, pitchWithRotate: true, maxPitch: 60 });
      m.addControl(new AttributionControl({ compact: true }), "top-left");
      m.on("load", () => {
        if (!m) return;
        m.addSource("stops", { type: "geojson", data: fc(stops.map((s) => ({ type: "Feature", properties: { id: s.id, cat: s.cat, color: s.color }, geometry: { type: "Point", coordinates: s.c } }))) });
        m.addLayer({ id: "stops-h", type: "circle", source: "stops", paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 6, 13, 12], "circle-color": "#fff", "circle-opacity": 0.92 } });
        m.addLayer({ id: "stops", type: "circle", source: "stops", paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 4, 13, 8.5], "circle-color": ["get", "color"], "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } });
        m.addSource("rl", { type: "geojson", data: fc([]) });
        m.addLayer({ id: "rl-c", type: "line", source: "rl", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#fff", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 6, 15, 11] } });
        m.addLayer({ id: "rl", type: "line", source: "rl", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": ac(), "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3.5, 15, 7] } });
        m.on("click", "stops", (e) => { const id = e.features?.[0]?.properties?.id; if (id) router.push(`/duraklar/${id}`); });
        m.on("mouseenter", "stops", () => { m!.getCanvas().style.cursor = "pointer"; });
        m.on("mouseleave", "stops", () => { m!.getCanvas().style.cursor = ""; });
        // G-015: yakın zoomda OpenStreetMap kayıtlı yemek, cami ve tuvalet noktaları.
        let poisOn = false;
        const POI_COL = ["match", ["get", "k"], "food", "#E9762B", "mosque", "#1F8A7A", "#2F6FD6"];
        const loadPois = async () => {
          if (poisOn || !m || m.getZoom() < 14) return; poisOn = true;
          try {
            const data = await (await fetch("/pois.geojson")).json();
            if (!m || m.getSource("pois")) return;
            m.addSource("pois", { type: "geojson", data });
            m.addLayer({ id: "pois", type: "circle", source: "pois", minzoom: 14, paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 3.5, 17, 6.5], "circle-color": POI_COL as never, "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } }, "stops-h");
            m.on("click", "pois", (e) => {
              const f = e.features?.[0]; if (!f) return;
              const pr = f.properties as { n?: string; k: string };
              new Popup({ closeButton: false, offset: 10, className: "kz-pop" }).setLngLat((f.geometry as GeoJSON.Point).coordinates as LngLat).setText(pr.n || poiLabel[pr.k] || "").addTo(m!);
            });
            m.on("mouseenter", "pois", () => { m!.getCanvas().style.cursor = "pointer"; });
            m.on("mouseleave", "pois", () => { m!.getCanvas().style.cursor = ""; });
          } catch { poisOn = false; }
        };
        m.on("zoomend", loadPois);
        m.flyTo({ center: [30.6, 38.7], zoom: 8.3, duration: reduce ? 0 : 2400, curve: 1.2, padding: pad(), essential: true });
      });
    })();
    const onCat = (e: Event) => {
      const c = (e as CustomEvent<string | null>).detail;
      if (!m?.getLayer("stops")) return;
      const f = c ? ["==", ["get", "cat"], c] : null;
      m.setFilter("stops", f as never); m.setFilter("stops-h", f as never);
      const pts = stops.filter((s) => !c || s.cat === c).map((s) => s.c);
      if (c && pts.length) m.setPadding({ top: 0, bottom: 0, left: 0, right: 0 }), m.fitBounds(pts.reduce((bb, p) => bb.extend(p), new LngLatBounds(pts[0], pts[0])), { padding: pad(), maxZoom: 13, duration: reduce ? 0 : 1300 });
    };
    const onRoute = (e: Event) => draw((e as CustomEvent<string | null>).detail);
    const onTheme = () => { if (m?.getLayer("rl")) m.setPaintProperty("rl", "line-color", ac()); };
    const onLocate = () => {
      navigator.geolocation?.getCurrentPosition((p) => m?.flyTo({ center: [p.coords.longitude, p.coords.latitude], zoom: 15, duration: 1500 }), () => {}, { enableHighAccuracy: true, timeout: 8000 });
    };
    let pitched = false;
    const on3d = () => { pitched = !pitched; m?.easeTo({ pitch: pitched ? 55 : 0, bearing: pitched ? -18 : 0, duration: 1100 }); };
    addEventListener("kesfet-cat", onCat); addEventListener("kesfet-route", onRoute); addEventListener("afyon-theme", onTheme);
    addEventListener("kesfet-locate", onLocate); addEventListener("kesfet-3d", on3d);
    return () => {
      cancelled = true; cancelAnimationFrame(raf); pins.forEach((p) => p.remove()); m?.remove();
      removeEventListener("kesfet-cat", onCat); removeEventListener("kesfet-route", onRoute); removeEventListener("afyon-theme", onTheme);
      removeEventListener("kesfet-locate", onLocate); removeEventListener("kesfet-3d", on3d);
    };
  }, [stops, routes, router]);
  return <div ref={box} role="application" aria-label={label} className="kz-map bg-[#F4EDE0]" style={{ position: "absolute", inset: 0 }} />;
}
