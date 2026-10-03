"use client";
import { useState, useTransition } from "react";
import { addAnnouncement, deleteAnnouncement, deleteFeedback, setFeedbackStatus, toggleAnnouncement } from "@/app/yonetim/actions";

export type FeedbackRow = { id: string; kind: string; place_id: string | null; place_name: string | null; message: string; contact: string | null; status: string; admin_note: string | null; created_at: string };
export type AnnRow = { id: string; title: string; body: string; active: boolean };
const kindLabel: Record<string, string> = { oneri: "Öneri", sikayet: "Şikayet", katki: "Katkı", hata: "Hata" };
const statusLabel: Record<string, string> = { yeni: "Yeni", inceleniyor: "İnceleniyor", cozuldu: "Çözüldü", reddedildi: "Reddedildi" };
const kindTone: Record<string, string> = { oneri: "bg-[#E4EEF9] text-[#1F4E86]", katki: "bg-[#E6EDD7] text-[#3F5A24]", sikayet: "bg-[#FBE4DC] text-[#8E2C12]", hata: "bg-[#F3E3F5] text-[#6B2B78]" };

export function FeedbackList({ rows }: { rows: FeedbackRow[] }) {
  const [filter, setFilter] = useState("");
  const [pending, run] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const shown = rows.filter((r) => !filter || r.status === filter);
  return (
    <>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {[["", "Tümü"], ...Object.entries(statusLabel)].map(([v, l]) => (
          <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)} className={`h-9 shrink-0 rounded-full border px-3.5 text-xs font-bold ${filter === v ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{l}{v ? ` · ${rows.filter((r) => r.status === v).length}` : ` · ${rows.length}`}</button>
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {shown.length === 0 && <li className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-mute">Kayıt yok.</li>}
        {shown.map((r) => (
          <li key={r.id} className="rounded-2xl border border-line bg-white p-3.5 shadow-card">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${kindTone[r.kind] ?? ""}`}>{kindLabel[r.kind] ?? r.kind}</span>
              {r.place_name && <span className="text-[11px] font-semibold text-mute">{r.place_name}</span>}
              <span className="ml-auto text-[11px] text-mute">{new Date(r.created_at).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{r.message}</p>
            {r.contact && <p className="mt-1.5 text-xs font-semibold text-terra">İletişim: {r.contact}</p>}
            <input value={notes[r.id] ?? r.admin_note ?? ""} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} placeholder="Yönetici notu" maxLength={1000} className="mt-2.5 h-10 w-full rounded-xl border border-line bg-cream px-3 text-[13px] outline-none focus:border-terra" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.entries(statusLabel).map(([v, l]) => (
                <button key={v} type="button" disabled={pending} onClick={() => run(async () => { await setFeedbackStatus(r.id, v, notes[r.id] ?? r.admin_note ?? ""); })}
                  className={`h-8 rounded-full border px-3 text-[11px] font-bold ${r.status === v ? "border-terra bg-terra text-white" : "border-line bg-white"}`}>{l}</button>
              ))}
              <button type="button" disabled={pending} onClick={() => { if (confirm("Bu kayıt silinsin mi?")) run(async () => { await deleteFeedback(r.id); }); }} className="ml-auto h-8 px-2 text-[11px] font-bold text-[#8E2C12]">Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function AnnouncementsAdmin({ rows }: { rows: AnnRow[] }) {
  const [t, setT] = useState(""); const [b, setB] = useState("");
  const [err, setErr] = useState(""); const [pending, run] = useTransition();
  const f = "w-full rounded-xl border border-line bg-white px-3.5 text-[14px] outline-none focus:border-terra";
  return (
    <>
      <form className="mt-2 flex flex-col gap-2 rounded-2xl border border-line bg-white p-3.5 shadow-card" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await addAnnouncement(t, b); if (r.ok) { setT(""); setB(""); setErr(""); } else setErr(r.error); }); }}>
        <input value={t} onChange={(e) => setT(e.target.value)} maxLength={100} placeholder="Başlık" className={`${f} h-11`} />
        <textarea value={b} onChange={(e) => setB(e.target.value)} maxLength={600} rows={3} placeholder="Duyuru metni (Keşfet sayfasında görünür)" className={`${f} py-2.5`} />
        {err && <p role="alert" className="text-xs font-semibold text-[#8E2C12]">{err}</p>}
        <button disabled={pending || t.trim().length < 3 || b.trim().length < 3} className="terra-grad h-11 rounded-full text-sm font-bold text-white disabled:opacity-50">Yayınla</button>
      </form>
      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((a) => (
          <li key={a.id} className="rounded-2xl border border-line bg-white p-3 shadow-card">
            <p className="text-sm font-bold">{a.title} {!a.active && <span className="text-[11px] font-semibold text-mute">(gizli)</span>}</p>
            <p className="mt-0.5 text-[13px] text-ink-2">{a.body}</p>
            <div className="mt-2 flex gap-4 text-[12px] font-bold">
              <button type="button" disabled={pending} onClick={() => run(async () => { await toggleAnnouncement(a.id, !a.active); })} className="text-navy">{a.active ? "Gizle" : "Yayınla"}</button>
              <button type="button" disabled={pending} onClick={() => { if (confirm("Duyuru silinsin mi?")) run(async () => { await deleteAnnouncement(a.id); }); }} className="text-[#8E2C12]">Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
