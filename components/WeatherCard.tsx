"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { placeListFull } from "@/lib/placesFull";
import { haversineM, formatDistance, type LngLat } from "@/lib/map/geo";

const AFYON: LngLat = [30.5387, 38.7507];
type W = { temp: number; feels: number; code: number; wind: number; day: boolean; hi: number; lo: number; rain: number; days: { d: string; hi: number; lo: number; code: number }[] };

function info(code: number): { label: string; kind: "sun" | "part" | "cloud" | "fog" | "rain" | "snow" | "storm" } {
  if (code === 0) return { label: "Açık", kind: "sun" };
  if (code <= 2) return { label: "Parçalı bulutlu", kind: "part" };
  if (code === 3) return { label: "Kapalı", kind: "cloud" };
  if (code <= 48) return { label: "Sisli", kind: "fog" };
  if (code <= 57) return { label: "Çisenti", kind: "rain" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Yağmurlu", kind: "rain" };
  if (code <= 77 || code === 85 || code === 86) return { label: "Karlı", kind: "snow" };
  return { label: "Gök gürültülü fırtına", kind: "storm" };
}
function Icon({ kind, day = true, size = 44 }: { kind: ReturnType<typeof info>["kind"]; day?: boolean; size?: number }) {
  const sun = <><circle cx="24" cy="24" r="8" fill={day ? "#F5B041" : "#C9D3E6"} />{day && <g stroke="#F5B041" strokeWidth="2.5" strokeLinecap="round">{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M24 6v5" transform={`rotate(${a} 24 24)`} />)}</g>}</>;
  const cloud = <path d="M15 36a8 8 0 0 1-1-15.9A10 10 0 0 1 33 18a8.5 8.5 0 0 1 1 17Z" fill="#FFFFFF" stroke="#B9C4D6" strokeWidth="1.5" />;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      {kind === "sun" && sun}
      {kind === "part" && <><g transform="translate(-6 -6) scale(.8)">{sun}</g><g transform="translate(4 6)">{cloud}</g></>}
      {(kind === "cloud" || kind === "fog") && <g transform="translate(0 2)">{cloud}{kind === "fog" && <path d="M10 40h28M14 44h20" stroke="#B9C4D6" strokeWidth="2.5" strokeLinecap="round" />}</g>}
      {kind === "rain" && <><g transform="translate(0 -4)">{cloud}</g><path d="M17 38l-2 5M25 38l-2 5M33 38l-2 5" stroke="#3B82C4" strokeWidth="2.6" strokeLinecap="round" /></>}
      {kind === "snow" && <><g transform="translate(0 -4)">{cloud}</g><g fill="#8FB8E8"><circle cx="16" cy="40" r="2" /><circle cx="25" cy="42" r="2" /><circle cx="34" cy="40" r="2" /></g></>}
      {kind === "storm" && <><g transform="translate(0 -4)">{cloud}</g><path d="M26 33l-6 8h5l-2 6 8-9h-5l2-5Z" fill="#F5B041" /></>}
    </svg>
  );
}
const dayName = (iso: string, i: number) => (i === 0 ? "Bugün" : new Date(iso + "T12:00").toLocaleDateString("tr-TR", { weekday: "short" }));

export default function WeatherCard() {
  const [pos, setPos] = useState<LngLat | null>(null);
  const [w, setW] = useState<W | null>(null);
  const [err, setErr] = useState(false);
  const [geoBusy, setGeoBusy] = useState(false);

  const load = useCallback(async (p: LngLat) => {
    try {
      const u = `https://api.open-meteo.com/v1/forecast?latitude=${p[1].toFixed(3)}&longitude=${p[0].toFixed(3)}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=4`;
      const j = await (await fetch(u)).json();
      const c = j.current, d = j.daily;
      setW({ temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), code: c.weather_code, wind: Math.round(c.wind_speed_10m), day: c.is_day === 1,
        hi: Math.round(d.temperature_2m_max[0]), lo: Math.round(d.temperature_2m_min[0]), rain: d.precipitation_probability_max[0] ?? 0,
        days: d.time.slice(1, 4).map((t: string, i: number) => ({ d: dayName(t, i + 1), hi: Math.round(d.temperature_2m_max[i + 1]), lo: Math.round(d.temperature_2m_min[i + 1]), code: d.weather_code[i + 1] })) });
      setErr(false);
    } catch { setErr(true); }
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { const q: LngLat = [p.coords.longitude, p.coords.latitude]; setPos(q); setGeoBusy(false); load(q); },
      () => setGeoBusy(false), { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
  }, [load]);

  useEffect(() => {
    load(AFYON);
    // İzin daha önce verilmişse sormadan konumu kullan
    (navigator as unknown as { permissions?: { query: (o: { name: string }) => Promise<{ state: string }> } }).permissions?.query({ name: "geolocation" }).then((s) => { if (s.state === "granted") locate(); }).catch(() => {});
  }, [load, locate]);

  if (err && !w) return null;
  if (!w) return <div className="skeleton mx-5 mt-5 h-[132px] rounded-[28px]" aria-label="Hava durumu yükleniyor" />;
  const i = info(w.code);
  const nearby = pos ? placeListFull.filter((p) => p.coords).map((p) => ({ p, d: haversineM(pos, p.coords!) })).sort((a, b) => a.d - b.d).slice(0, 3) : [];
  const tip = i.kind === "rain" || i.kind === "storm" || i.kind === "snow" ? { t: "Yağış var: müze ve camilerin olduğu kapalı mekân rotası iyi bir seçim.", href: "/rotalar/merkez-kultur-rotasi", l: "Merkez Kültür Rotası" }
    : w.temp >= 32 ? { t: "Çok sıcak: yürüyüşleri sabaha alın, öğleden sonra termal ve müzeleri tercih edin.", href: "/rotalar", l: "Rotalara bak" }
    : w.temp <= 3 ? { t: "Soğuk bir gün: kalın giyinin, kapalı mekânlı rotaları seçin.", href: "/rotalar/merkez-kultur-rotasi", l: "Merkez Kültür Rotası" }
    : { t: "Dışarıda gezmek için güzel bir gün.", href: "/rotalar", l: "Rotalara bak" };

  return (
    <section aria-label="Hava durumu" className="mx-5 mt-5 overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-[#FFF8EC] to-[#F6E4CC] p-4 shadow-card">
      <div className="flex items-center gap-3">
        <Icon kind={i.kind} day={w.day} size={54} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-mute">{pos ? "Bulunduğunuz yer" : "Afyonkarahisar"} · şu an</p>
          <p className="font-display text-[34px] font-semibold leading-none">{w.temp}°<span className="ml-2 text-[14px] font-medium text-ink-2">{i.label}</span></p>
          <p className="mt-1 text-[11px] font-medium text-ink-2">Hissedilen {w.feels}° · Rüzgâr {w.wind} km/sa · Yağış %{w.rain} · {w.lo}°/{w.hi}°</p>
        </div>
        {!pos && <button type="button" onClick={locate} disabled={geoBusy} className="shrink-0 rounded-full border border-line bg-white px-3 py-2 text-[11px] font-bold text-navy shadow-card disabled:opacity-60">{geoBusy ? "Aranıyor…" : "Konumum"}</button>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {w.days.map((d) => (<div key={d.d} className="flex items-center gap-1.5 rounded-2xl bg-white/70 px-2.5 py-2"><Icon kind={info(d.code).kind} size={26} /><span className="text-[11px] font-semibold leading-tight">{d.d}<span className="block font-bold">{d.hi}° <span className="font-medium text-mute">{d.lo}°</span></span></span></div>))}
      </div>
      <p className="mt-3 text-[12px] leading-snug text-ink-2">{tip.t} <Link href={tip.href} className="font-bold text-terra">{tip.l} ›</Link></p>
      {nearby.length > 0 && (
        <div className="mt-3 border-t border-black/5 pt-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-mute">Yakınınızdaki duraklar</p>
          <ul className="mt-1.5 flex flex-col gap-1">{nearby.map(({ p, d }) => (<li key={p.id}><Link href={`/duraklar/${p.id}`} className="flex items-center justify-between rounded-xl px-1 py-1 text-[13px] font-semibold"><span>{p.name}</span><span className="text-xs text-terra">{formatDistance(d)}</span></Link></li>))}</ul>
        </div>
      )}
    </section>
  );
}
