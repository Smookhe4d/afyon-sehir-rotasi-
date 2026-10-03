"use client";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteCustomRoute, saveCustomRoute } from "@/app/actions";
import { placeList } from "@/lib/places";

export type SavedRoute = { id: string; title: string; place_ids: string[]; is_public: boolean };
const names = Object.fromEntries(placeList.map((p) => [p.id, p]));

export default function Builder({ saved }: { saved: SavedRoute[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, run] = useTransition();

  const results = useMemo(() => {
    const n = q.trim().toLocaleLowerCase("tr");
    return placeList.filter((p) => !picked.includes(p.id) && (!n || `${p.name} ${p.area}`.toLocaleLowerCase("tr").includes(n))).slice(0, 8);
  }, [q, picked]);

  const move = (i: number, d: -1 | 1) => setPicked((l) => { const j = i + d; if (j < 0 || j >= l.length) return l; const c = [...l]; [c[i], c[j]] = [c[j], c[i]]; return c; });

  function save() {
    run(async () => {
      const r = await saveCustomRoute({ title, placeIds: picked, isPublic });
      if (r.ok) { setMsg({ ok: true, text: "Rota kaydedildi." }); setPicked([]); setTitle(""); setPublic(false); } else setMsg({ ok: false, text: r.error });
    });
  }

  return (
    <div className="px-5">
      <label className="block text-xs font-bold text-mute" htmlFor="title">Rota adı</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Örn. Hafta sonu şehir yürüyüşü" className="mt-1 h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra" />

      <label className="mt-5 block text-xs font-bold text-mute" htmlFor="q">Durak ekle</label>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Durak veya mekân ara" className="mt-1 h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra" />
      <ul className="mt-2 flex flex-col gap-1.5">
        {results.map((p) => (
          <li key={p.id}><button type="button" onClick={() => { setPicked((l) => [...l, p.id]); setQ(""); }} className="flex w-full items-center justify-between rounded-2xl border border-line bg-white px-3.5 py-2.5 text-left">
            <span><span className="block text-sm font-bold">{p.name}</span><span className="text-[11px] text-mute">{p.area}</span></span><span className="text-xl text-terra" aria-hidden>+</span></button></li>
        ))}
        {results.length === 0 && <li className="px-1 text-sm text-mute">Eşleşen durak yok.</li>}
      </ul>

      <h2 className="mt-6 font-display text-lg font-semibold">Seçilen duraklar <span className="text-sm font-medium text-mute">· {picked.length}</span></h2>
      {picked.length === 0 ? <p className="mt-1 text-sm text-mute">En az 2 durak seçin.</p> : (
        <ol className="mt-2 flex flex-col gap-2">
          {picked.map((id, i) => (
            <li key={id} className="flex items-center gap-2.5 rounded-2xl border border-line bg-white p-2">
              <span className="terra-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white">{i + 1}</span>
              <span className="min-w-0 flex-1 text-sm font-bold leading-tight">{names[id].name}</span>
              <button type="button" aria-label="Yukarı taşı" onClick={() => move(i, -1)} disabled={i === 0} className="h-9 w-9 rounded-full text-lg disabled:opacity-30">↑</button>
              <button type="button" aria-label="Aşağı taşı" onClick={() => move(i, 1)} disabled={i === picked.length - 1} className="h-9 w-9 rounded-full text-lg disabled:opacity-30">↓</button>
              <button type="button" aria-label="Kaldır" onClick={() => setPicked((l) => l.filter((x) => x !== id))} className="h-9 w-9 rounded-full text-lg text-terra">×</button>
            </li>
          ))}
        </ol>
      )}

      <label className="mt-4 flex items-center gap-2.5 text-sm font-semibold"><input type="checkbox" checked={isPublic} onChange={(e) => setPublic(e.target.checked)} className="h-5 w-5 accent-[#A64B22]" />Diğer kullanıcılar görebilsin</label>
      {msg && <p role="alert" className={`mt-3 rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold ${msg.ok ? "bg-[#E6EDD7] text-[#3F5A24]" : "bg-[#FBE4DC] text-[#8E2C12]"}`}>{msg.text}</p>}
      <Link href={`/harita?duraklar=${picked.join(",")}`} aria-disabled={picked.length < 2} tabIndex={picked.length < 2 ? -1 : 0}
        className={`terra-grad mt-4 flex h-14 w-full items-center justify-center rounded-full font-bold text-white shadow-[0_8px_20px_rgba(166,75,34,.4)] ${picked.length < 2 ? "pointer-events-none opacity-50" : ""}`}>Başla</Link>
      <button type="button" onClick={save} disabled={pending || picked.length < 2 || title.trim().length < 3} className="mt-2.5 h-12 w-full rounded-full border border-line bg-white text-sm font-bold text-navy disabled:opacity-50">Rotayı Kaydet</button>
      <p className="mt-1.5 text-center text-[11px] text-mute">Başla, rotayı haritada açar. Kaydetmek için giriş gerekir.</p>

      <h2 className="mt-9 font-display text-lg font-semibold">Kayıtlı rotalarım</h2>
      <ul className="mt-2 flex flex-col gap-2.5">
        {saved.length === 0 && <li className="text-sm text-mute">Henüz kayıtlı rota yok.</li>}
        {saved.map((r) => (
          <li key={r.id} className="rounded-2xl border border-line bg-white p-3">
            <div className="flex items-start justify-between gap-2"><p className="font-display font-semibold leading-tight">{r.title}</p><span className="shrink-0 text-[11px] font-bold text-mute">{r.is_public ? "Herkese açık" : "Özel"}</span></div>
            <p className="mt-1 text-xs text-ink-2">{r.place_ids.map((id) => names[id]?.name ?? id).join(" → ")}</p>
            <div className="mt-2 flex gap-4"><Link href={`/harita?duraklar=${r.place_ids.join(",")}`} className="text-[12px] font-bold text-navy">Başla</Link>
            <button type="button" onClick={() => run(async () => { await deleteCustomRoute(r.id); })} className="text-[12px] font-bold text-terra">Sil</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
