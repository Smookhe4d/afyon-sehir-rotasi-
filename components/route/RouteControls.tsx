"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { resetRoute, setVisited, startRoute, toggleFavorite } from "@/app/actions";
import PhotoSlot from "@/components/PhotoSlot";
import type { Place, RouteStop } from "@/lib/types";

type Stop = RouteStop & { place: Place; hasMap?: boolean };
const roleLabel = { baslangic: "Başlangıç", bitis: "Bitiş", mola: "Mola", konaklama: "Konaklama" } as const;

export function FavoriteButton({ slug, initial }: { slug: string; initial: boolean }) {
  const [fav, setFav] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} aria-pressed={fav} aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
      onClick={() => { const next = !fav; setFav(next); start(async () => { const r = await toggleFavorite(slug); if (!r.ok) setFav(!next); }); }}
      className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white disabled:opacity-60">
      <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" /></svg>
    </button>
  );
}

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = `${location.origin}/rotalar/${slug}`;
    if (navigator.share) { try { await navigator.share({ title, url }); } catch { /* iptal */ } return; }
    await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button type="button" onClick={share} aria-label="Paylaş" className="glass-dark flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-xs font-bold text-white">
      {copied ? "Kopyalandı" : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>}
    </button>
  );
}

export function StopChecklist({ slug, stops, started, visited }: { slug: string; stops: Stop[]; started: boolean; visited: string[] }) {
  const [pending, run] = useTransition();
  const [local, setLocal] = useState(new Set(visited));
  const [isStarted, setStarted] = useState(started);
  const [error, setError] = useState("");
  const total = new Set(stops.map((s) => s.placeId)).size;
  const done = [...local].filter((id) => stops.some((s) => s.placeId === id)).length;

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, rollback: () => void) =>
    run(async () => { setError(""); const r = await fn(); if (!r.ok) { rollback(); setError(r.error ?? "İşlem başarısız."); } });

  function begin() {
    setStarted(true);
    act(() => startRoute(slug), () => setStarted(false));
  }
  function toggle(id: string) {
    const next = new Set(local); const on = !next.has(id); if (on) next.add(id); else next.delete(id);
    const prev = local; setLocal(next);
    act(() => setVisited(slug, id, on), () => setLocal(prev));
  }
  function reset() {
    const prev = local; setLocal(new Set()); setStarted(false);
    act(() => resetRoute(slug), () => { setLocal(prev); setStarted(true); });
  }

  return (
    <section aria-label="Duraklar">
      <div className="mt-7 flex items-end justify-between">
        <h2 className="font-display text-xl font-semibold">Duraklar <span className="text-sm font-medium text-mute">· {stops.length}</span></h2>
        {isStarted && <span className="text-xs font-bold text-terra">{done} / {total} ziyaret edildi</span>}
      </div>
      {isStarted && <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}><div className="terra-grad h-full rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} /></div>}
      {error && <p role="alert" className="mt-2 rounded-xl bg-[#FBE4DC] px-3 py-2 text-xs font-semibold text-[#8E2C12]">{error}</p>}
      <ol className="mt-3 flex flex-col gap-2.5">
        {stops.map((s, i) => {
          const seen = local.has(s.placeId);
          return (
            <li key={`${s.placeId}-${i}`} className={`flex gap-3 rounded-3xl border p-2.5 ${seen ? "border-[#C9D8A8] bg-[#F3F7E8]" : "border-line bg-white"}`}>
              <PhotoSlot id={s.placeId} className="h-[64px] w-[72px] shrink-0 rounded-xl" label={false} />
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold leading-tight"><Link href={`/duraklar/${s.placeId}`}><span className="text-terra">{i + 1}</span> · {s.place.name}</Link></p>
                <p className="text-[11px] font-semibold text-mute">{s.place.area}{s.role ? ` · ${roleLabel[s.role]}` : ""}</p>
                {(s.note || s.place.note) && <p className="mt-1 text-xs leading-snug text-ink-2">{s.note ? `${s.note}. ` : ""}{s.place.note}</p>}
                <div className="mt-1.5 flex gap-3 text-[11px] font-bold text-terra"><Link href={`/duraklar/${s.placeId}`}>Bilgi ›</Link>{s.hasMap && <Link href={`/harita?rota=${slug}&durak=${s.placeId}`}>Haritada ›</Link>}</div>
              </div>
              {isStarted && (
                <button type="button" onClick={() => toggle(s.placeId)} disabled={pending} aria-pressed={seen} aria-label={`${s.place.name} ziyaret edildi`}
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${seen ? "border-[#4F6B2F] bg-[#4F6B2F] text-white" : "border-line text-transparent"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {!isStarted ? (
        <button type="button" onClick={begin} disabled={pending} className="terra-grad mt-5 flex h-14 w-full items-center justify-center rounded-full font-bold text-white shadow-[0_8px_20px_rgba(166,75,34,.4)] disabled:opacity-60">Rotayı Başlat</button>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-2">{done === total ? "Tebrikler, rotayı tamamladınız!" : "Rota devam ediyor."}</p>
          <button type="button" onClick={reset} disabled={pending} className="h-10 rounded-full border border-line bg-white px-4 text-xs font-bold">Sıfırla</button>
        </div>
      )}
    </section>
  );
}
