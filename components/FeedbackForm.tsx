"use client";
import { useState, useTransition } from "react";
import { sendFeedback } from "@/app/actions";
import { placeList } from "@/lib/places";

const kinds = [
  { v: "oneri", l: "Öneri", d: "Yeni rota, özellik, fikir" },
  { v: "katki", l: "Katkı", d: "Bilgi, fotoğraf, düzeltme" },
  { v: "sikayet", l: "Şikayet", d: "Memnuniyetsizlik, uygunsuz içerik" },
  { v: "hata", l: "Hata", d: "Çalışmayan veya yanlış olan" },
] as const;

export default function FeedbackForm({ placeId = "", kind0 = "oneri" }: { placeId?: string; kind0?: string }) {
  const [kind, setKind] = useState(kinds.some((k) => k.v === kind0) ? kind0 : "oneri");
  const [place, setPlace] = useState(placeId);
  const [msg, setMsg] = useState("");
  const [contact, setContact] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, run] = useTransition();
  const field = "w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra";

  if (state?.ok) return (
    <div className="glass mx-5 mt-5 rounded-[28px] p-6 text-center">
      <p className="font-display text-xl font-semibold">Teşekkürler!</p>
      <p className="mt-2 text-sm text-ink-2">Mesajınız bize ulaştı. Katkılarınız Afyonkarahisar rehberini daha iyi yapıyor.</p>
    </div>
  );
  return (
    <form className="mx-5 mt-5 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await sendFeedback({ kind, placeId: place, message: msg, contact, website: hp }); setState(r.ok ? { ok: true, text: "" } : { ok: false, text: r.error }); }); }}>
      <div role="radiogroup" aria-label="Tür" className="grid grid-cols-2 gap-2">
        {kinds.map((k) => (
          <button key={k.v} type="button" role="radio" aria-checked={kind === k.v} onClick={() => setKind(k.v)}
            className={`rounded-2xl border px-3.5 py-3 text-left shadow-card ${kind === k.v ? "border-terra bg-[#FCEBDD]" : "border-line bg-white"}`}>
            <span className="block text-sm font-bold">{k.l}</span><span className="text-[11px] text-mute">{k.d}</span>
          </button>
        ))}
      </div>
      <label className="text-xs font-bold text-mute">İlgili durak (isteğe bağlı)
        <select value={place} onChange={(e) => setPlace(e.target.value)} className={`${field} mt-1 h-12`}>
          <option value="">Genel</option>
          {placeList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="text-xs font-bold text-mute">Mesajınız
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} required minLength={5} maxLength={2000} rows={6} placeholder="Ne düşünüyorsunuz?" className={`${field} mt-1 py-3`} />
        <span className="mt-1 block text-right text-[10px] font-medium">{msg.length}/2000</span>
      </label>
      <label className="text-xs font-bold text-mute">E-posta veya telefon (isteğe bağlı, yanıt için)
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} className={`${field} mt-1 h-12`} />
      </label>
      <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
      {state && !state.ok && <p role="alert" className="rounded-2xl bg-[#FBE4DC] px-3.5 py-2.5 text-[13px] font-semibold text-[#8E2C12]">{state.text}</p>}
      <button disabled={pending || msg.trim().length < 5} className="terra-grad h-14 rounded-full font-bold text-white disabled:opacity-50">{pending ? "Gönderiliyor…" : "Gönder"}</button>
      <p className="text-center text-[11px] text-mute">Mesajlarınız yalnızca site yöneticisi tarafından görülür. <a href="/gizlilik" className="underline">Gizlilik</a></p>
    </form>
  );
}
