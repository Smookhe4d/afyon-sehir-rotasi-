"use client";
import { useState, useTransition } from "react";
import { addRouteComment, deleteComment } from "@/app/actions";

export type CommentRow = { id: string; body: string; created_at: string; user_id: string; author: string };

export default function Comments({ slug, rows, userId, canWrite }: { slug: string; rows: CommentRow[]; userId: string; canWrite: boolean }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, run] = useTransition();
  const fmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <section aria-label="Yorumlar" className="mt-8">
      <h2 className="font-display text-xl font-semibold">Yorumlar <span className="text-sm font-medium text-mute">· {rows.length}</span></h2>
      {canWrite ? (
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = text; run(async () => { setError(""); const r = await addRouteComment(slug, t); if (r.ok) setText(""); else setError(r.error); }); }}>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} required placeholder="Bu rota hakkında ne düşünüyorsunuz?" aria-label="Yorum" className="h-12 min-w-0 flex-1 rounded-full border border-line bg-white shadow-card px-4 text-sm outline-none focus:border-terra" />
          <button disabled={pending} className="h-12 rounded-full bg-navy px-5 text-sm font-bold text-white disabled:opacity-60">Gönder</button>
        </form>
      ) : <p className="mt-3 rounded-2xl bg-sand px-4 py-3 text-sm text-ink-2">Yorum yazmak için misafir oturumundan çıkıp hesap oluşturun.</p>}
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-[#8E2C12]">{error}</p>}
      <ul className="mt-4 flex flex-col gap-2.5">
        {rows.length === 0 && <li className="text-sm text-mute">Henüz yorum yok. İlk yorumu siz yazın.</li>}
        {rows.map((c) => (
          <li key={c.id} className="rounded-2xl border border-line bg-white shadow-card p-3">
            <div className="flex items-center justify-between text-xs"><span className="font-bold">{c.author}</span><span className="text-mute">{fmt.format(new Date(c.created_at))}</span></div>
            <p className="mt-1 text-sm text-ink-2">{c.body}</p>
            {c.user_id === userId && <button type="button" onClick={() => run(async () => { await deleteComment(c.id, `/rotalar/${slug}`); })} className="mt-1 text-[11px] font-bold text-terra">Sil</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
