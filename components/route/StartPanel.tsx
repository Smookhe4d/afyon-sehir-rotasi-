"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { startRoute } from "@/app/actions";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () => { const b = new Uint32Array(6); crypto.getRandomValues(b); return [...b].map((x) => ALPHABET[x % ALPHABET.length]).join(""); };

/** Konum iznini ve ilk konumu, harita açılmadan önce ısıtır; yönlendirme daha hızlı başlar. */
const warmLocation = () => { try { navigator.geolocation?.getCurrentPosition(() => {}, () => {}, { enableHighAccuracy: false, maximumAge: 600000, timeout: 8000 }); } catch { /* yok say */ } };

export default function StartPanel({ slug, mode, defaultName = "" }: { slug: string; mode: string; defaultName?: string }) {
  const router = useRouter();
  const [sheet, setSheet] = useState<null | "kur" | "katil">(null);
  const [name, setName] = useState(defaultName);
  const [code, setCode] = useState("");
  const [join, setJoin] = useState("");
  const [copied, setCopied] = useState(false);
  const [, run] = useTransition();
  useEffect(() => { try { const n = localStorage.getItem("afyon-ad"); if (n) setName(n); } catch { /* yok say */ } }, []);

  const base = `/harita?rota=${slug}&takip=1&mod=${mode}`;
  const solo = () => { warmLocation(); run(async () => { await startRoute(slug); }); router.push(base); };
  const saveName = () => { try { localStorage.setItem("afyon-ad", name.trim().slice(0, 24)); } catch { /* yok say */ } };
  const link = (c: string) => `${typeof location !== "undefined" ? location.origin : ""}${base}&grup=${c}`;
  const go = (c: string, leader: boolean) => { saveName(); warmLocation(); run(async () => { await startRoute(slug); }); router.push(`${base}&grup=${c}${leader ? "&lider=1" : ""}`); };
  const okName = name.trim().length >= 2;
  const field = "h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra";

  return (
    <>
      <div className="mt-4 grid grid-cols-5 gap-2.5">
        <button type="button" onClick={solo} className="terra-grad col-span-3 flex h-14 items-center justify-center gap-2 rounded-full font-bold text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>Bireysel başla
        </button>
        <button type="button" onClick={() => { setSheet("kur"); setCode(newCode()); }} className="col-span-2 flex h-14 items-center justify-center gap-1.5 rounded-full border border-line bg-white text-sm font-bold text-navy shadow-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>Grupla
        </button>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-navy/50" role="dialog" aria-modal="true" aria-label="Grup turu" onClick={() => setSheet(null)} style={{ animation: "fade-in .2s both" }}>
          <div className="page-in w-full max-w-[520px] rounded-t-[32px] bg-cream p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
            <div role="tablist" className="mb-4 flex rounded-full bg-sand p-1">
              {(["kur", "katil"] as const).map((m) => (
                <button key={m} role="tab" aria-selected={sheet === m} type="button" onClick={() => { setSheet(m); if (m === "kur" && !code) setCode(newCode()); }} className={`h-10 flex-1 rounded-full text-sm font-bold ${sheet === m ? "bg-navy text-white" : "text-ink-2"}`}>{m === "kur" ? "Grup kur" : "Koda katıl"}</button>
              ))}
            </div>
            <label className="text-xs font-bold text-mute">Adınız
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="Grupta görünecek ad" className={`${field} mt-1`} />
            </label>
            {sheet === "kur" ? (
              <>
                <p className="mt-4 text-xs font-bold text-mute">Grup kodunuz</p>
                <p className="mt-1 rounded-2xl border border-dashed border-terra bg-[#FCEBDD] py-3 text-center font-display text-[34px] font-semibold tracking-[8px] text-terra">{code}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-2">Siz rehbersiniz: durakları siz ilerletirsiniz, grup birlikte ilerler. Herkes haritada birbirini canlı görür.</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`Afyon turuna katıl! Kod: ${code}\n${link(code)}`)}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-navy shadow-card">WhatsApp</a>
                  <button type="button" onClick={() => { navigator.clipboard?.writeText(link(code)); setCopied(true); setTimeout(() => setCopied(false), 1800); }} className="h-12 rounded-full border border-line bg-white text-sm font-bold text-navy shadow-card">{copied ? "Kopyalandı" : "Bağlantıyı kopyala"}</button>
                </div>
                <button type="button" disabled={!okName} onClick={() => go(code, true)} className="terra-grad mt-3 h-14 w-full rounded-full font-bold text-white disabled:opacity-50">Turu başlat</button>
              </>
            ) : (
              <>
                <label className="mt-4 block text-xs font-bold text-mute">Grup kodu
                  <input value={join} onChange={(e) => setJoin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))} placeholder="Örn. K7M2QX" inputMode="text" autoCapitalize="characters" className={`${field} mt-1 text-center font-display text-[22px] tracking-[6px]`} />
                </label>
                <button type="button" disabled={!okName || join.length < 4} onClick={() => go(join, false)} className="terra-grad mt-4 h-14 w-full rounded-full font-bold text-white disabled:opacity-50">Gruba katıl</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
