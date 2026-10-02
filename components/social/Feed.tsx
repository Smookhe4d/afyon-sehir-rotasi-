"use client";
import { useState, useTransition } from "react";
import { addPostComment, createPost, deleteComment, deletePost, toggleLike } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

export type PostRow = {
  id: string; body: string; photo_url: string | null; route_title: string | null; created_at: string;
  user_id: string; author: string; likes: number; liked: boolean;
  comments: { id: string; body: string; user_id: string; author: string }[];
};

const fmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const MAX = 5 * 1024 * 1024;

export function Composer({ userId, canPost }: { userId: string; canPost: boolean }) {
  const [text, setText] = useState(""); const [slug, setSlug] = useState(""); const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (!canPost) return <p className="mx-5 rounded-2xl bg-sand px-4 py-3 text-sm text-ink-2">Paylaşım yapmak için misafir oturumundan çıkıp hesap oluşturun.</p>;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      let photoPath: string | undefined;
      if (file) {
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Yalnızca JPG, PNG veya WebP yükleyin.");
        if (file.size > MAX) throw new Error("Fotoğraf en fazla 5 MB olabilir.");
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        photoPath = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await createClient().storage.from("post-photos").upload(photoPath, file, { contentType: file.type });
        if (error) throw new Error("Fotoğraf yüklenemedi.");
      }
      const r = await createPost({ body: text, routeSlug: slug || undefined, photoPath });
      if (!r.ok) { if (photoPath) await createClient().storage.from("post-photos").remove([photoPath]); throw new Error(r.error); }
      setText(""); setSlug(""); setFile(null);
    } catch (x) { setErr(x instanceof Error ? x.message : "Paylaşılamadı."); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mx-5 rounded-[28px] border border-line bg-white p-3 shadow-sm">
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} required rows={3} placeholder="Bugünkü rotanı paylaş…" aria-label="Paylaşım metni" className="w-full resize-none rounded-2xl bg-cream px-3.5 py-3 text-sm outline-none" />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label="Rota" className="h-10 min-w-0 flex-1 rounded-full border border-line bg-white px-3 text-xs font-semibold">
          <option value="">Rota seç (isteğe bağlı)</option>
          {routes.map((r) => <option key={r.slug} value={r.slug}>{r.title}</option>)}
        </select>
        <label className="flex h-10 cursor-pointer items-center rounded-full border border-line px-3.5 text-xs font-bold">
          {file ? "Fotoğraf seçildi" : "Fotoğraf"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button disabled={busy} className="h-10 rounded-full bg-navy px-5 text-xs font-bold text-white disabled:opacity-60">{busy ? "Gönderiliyor…" : "Paylaş"}</button>
      </div>
      {err && <p role="alert" className="mt-2 text-xs font-semibold text-[#8E2C12]">{err}</p>}
    </form>
  );
}

export function PostCard({ p, userId, canComment }: { p: PostRow; userId: string; canComment: boolean }) {
  const [pending, run] = useTransition();
  const [liked, setLiked] = useState(p.liked); const [likes, setLikes] = useState(p.likes);
  const [open, setOpen] = useState(false); const [c, setC] = useState(""); const [err, setErr] = useState("");
  return (
    <article className="mx-5 rounded-[28px] border border-line bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div><p className="text-sm font-bold">{p.author}</p><p className="text-[11px] text-mute">{p.route_title ? `${p.route_title} · ` : ""}{fmt.format(new Date(p.created_at))}</p></div>
        {p.user_id === userId && <button type="button" onClick={() => run(async () => { await deletePost(p.id); })} className="text-[11px] font-bold text-terra">Sil</button>}
      </div>
      {p.photo_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.photo_url} alt="" loading="lazy" className="mt-2.5 max-h-[420px] w-full rounded-[20px] object-cover" />}
      <p className="mt-2.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-2">{p.body}</p>
      <div className="mt-2.5 flex items-center gap-5 text-[12.5px] font-semibold text-ink-2">
        <button type="button" aria-pressed={liked} disabled={pending} onClick={() => { const n = !liked; setLiked(n); setLikes((x) => x + (n ? 1 : -1)); run(async () => { const r = await toggleLike(p.id); if (!r.ok) { setLiked(!n); setLikes((x) => x + (n ? -1 : 1)); } }); }} className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#A64B22" : "none"} stroke={liked ? "#A64B22" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" /></svg>{likes}
        </button>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{p.comments.length}
        </button>
      </div>
      {open && (
        <div className="mt-3 border-t border-line pt-3">
          <ul className="flex flex-col gap-2">{p.comments.map((x) => (
            <li key={x.id} className="text-[13px]"><b>{x.author}</b> <span className="text-ink-2">{x.body}</span>{x.user_id === userId && <button type="button" onClick={() => run(async () => { await deleteComment(x.id, "/sosyal"); })} className="ml-2 text-[11px] font-bold text-terra">Sil</button>}</li>
          ))}</ul>
          {canComment ? (
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = c; run(async () => { setErr(""); const r = await addPostComment(p.id, t); if (r.ok) setC(""); else setErr(r.error); }); }}>
              <input value={c} onChange={(e) => setC(e.target.value)} maxLength={500} required placeholder="Yorum yaz" aria-label="Yorum" className="h-10 min-w-0 flex-1 rounded-full border border-line px-3.5 text-sm outline-none focus:border-terra" />
              <button disabled={pending} className="h-10 rounded-full bg-navy px-4 text-xs font-bold text-white">Gönder</button>
            </form>
          ) : <p className="mt-2 text-xs text-mute">Yorum yazmak için hesap oluşturun.</p>}
          {err && <p role="alert" className="mt-1 text-xs font-semibold text-[#8E2C12]">{err}</p>}
        </div>
      )}
    </article>
  );
}
