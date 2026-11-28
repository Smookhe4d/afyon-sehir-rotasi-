"use client";
import {useFormatter as useUiFormatter} from "next-intl";

import {useLocale as useUiLocale} from "next-intl";
import {useContent} from "@/i18n/useContent";
import {useTranslations as useUiTranslations} from "next-intl";

import { useState, useTransition } from "react";
import { addPostComment, adminDeleteComment, adminDeletePost, createPost, deleteComment, deletePost, reportPost, toggleLike } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { kufurVar } from "@/lib/kufur";

export type PostRow = {
  id: string; body: string; photo_url: string | null; route_title: string | null; created_at: string;
  user_id: string; author: string; likes: number; liked: boolean;
  comments: { id: string; body: string; user_id: string; author: string }[];
};

const MAX = 5 * 1024 * 1024;
const RAW_MAX = 25 * 1024 * 1024;

/** G-027: Fotoğraf yüklenmeden önce telefonda küçültülür (uzun kenar 1600 px, JPEG). Mobil veri ve depolama korunur. */
async function shrink(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? new File([blob], "foto.jpg", { type: "image/jpeg" }) : file;
  } catch { return file; }
}

/** G-027: Oturumu olmayan ziyaretçi adını yazıp misafir olarak sosyal alana katılır. */
export function GuestJoin() {
  const g = useUiTranslations("g027");
  const router = useRouter();
  const [name, setName] = useState(() => { try { return localStorage.getItem("afyon-ad") ?? ""; } catch { return ""; } });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function join(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const n = name.trim();
    if (n.length < 2 || n.length > 40) { setErr(g("nameLength")); return; }
    if (kufurVar(n)) { setErr(g("profanity")); return; }
    setBusy(true);
    const { error } = await createClient().auth.signInAnonymously({ options: { data: { display_name: n } } });
    if (error) { setErr(g("joinFailed")); setBusy(false); return; }
    try { localStorage.setItem("afyon-ad", n); } catch { /* yok say */ }
    router.refresh();
  }
  return (
    <form onSubmit={join} className="mx-5 rounded-[28px] border border-line bg-white p-4 shadow-card">
      <p className="font-display text-lg font-semibold text-navy">{g("joinTitle")}</p>
      <p className="mt-1 text-[13px] leading-snug text-ink-2">{g("joinText")}</p>
      <div className="mt-3 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required autoComplete="nickname" placeholder={g("namePlaceholder")} aria-label={g("namePlaceholder")} className="h-11 min-w-0 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-terra" />
        <button disabled={busy} className="h-11 rounded-full bg-navy px-5 text-sm font-bold text-white disabled:opacity-60">{g("join")}</button>
      </div>
      {err && <p role="alert" className="mt-2 text-xs font-semibold text-[#8E2C12]">{err}</p>}
    </form>
  );
}

export function Composer({ userId, name: initialName, isGuest }: { userId: string; name: string; isGuest: boolean }) {
  const g = useUiTranslations("g027");
  const {routes} = useContent();

  const language = useUiLocale();
  const fmt = new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const tx = useUiTranslations("ui");

  const [text, setText] = useState(""); const [slug, setSlug] = useState(""); const [picked, setFile] = useState<File | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [name, setName] = useState(initialName === "Gezgin" ? "" : initialName);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    let file = picked;
    try {
      let photoPath: string | undefined;
      if (isGuest && name.trim().length < 2) throw new Error(g("nameLength"));
      if (kufurVar(text) || kufurVar(name)) throw new Error(g("profanity"));
      if (file) {
        if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) throw new Error(tx("uploadJpgPngOrWebp_9d765"));
        if (file.size > RAW_MAX) throw new Error(tx("photosMustBe5Mb_35e1b"));
        file = await shrink(file);
        if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > MAX) throw new Error(tx("photosMustBe5Mb_35e1b"));
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        photoPath = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await createClient().storage.from("post-photos").upload(photoPath, file, { contentType: file.type });
        if (error) throw new Error(tx("thePhotoCouldNotBe_89fdd"));
      }
      const r = await createPost({ body: text, routeSlug: slug || undefined, photoPath, name: isGuest ? name.trim() : undefined });
      if (!r.ok) { if (photoPath) await createClient().storage.from("post-photos").remove([photoPath]); throw new Error(r.error); }
      setText(""); setSlug(""); setFile(null);
    } catch (x) { setErr(x instanceof Error ? x.message : tx("couldNotShare_dc312")); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mx-5 rounded-[28px] border border-line bg-white shadow-card p-3">
      {isGuest && <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required autoComplete="nickname" placeholder={g("namePlaceholder")} aria-label={g("namePlaceholder")} className="mb-2 h-11 w-full rounded-full bg-cream px-4 text-sm outline-none" />}
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} required rows={3} placeholder={tx("shareTodaySRoute_f2d0f")} aria-label={tx("postText_e0a16")} className="w-full resize-none rounded-2xl bg-cream px-3.5 py-3 text-sm outline-none" />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label={tx("route_5dd9b")} className="h-10 min-w-0 flex-1 rounded-full border border-line bg-white shadow-card px-3 text-xs font-semibold">
          <option value="">{tx("selectARouteOptional_0df72")}</option>
          {routes.map((r) => <option key={r.slug} value={r.slug}>{r.title}</option>)}
        </select>
        <label className="flex h-10 cursor-pointer items-center rounded-full border border-line px-3.5 text-xs font-bold">
          {picked ? tx("photoSelected_1657d") : tx("photo_03cb4")}<input type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button disabled={busy} className="h-10 rounded-full bg-navy px-5 text-xs font-bold text-white disabled:opacity-60">{busy ? tx("sending_56205") : tx("share_474ee")}</button>
      </div>
      <p className="mt-2 px-1 text-[11.5px] leading-snug text-mute">{g("rules")}</p>
      {err && <p role="alert" className="mt-2 text-xs font-semibold text-[#8E2C12]">{err}</p>}
    </form>
  );
}

export function PostCard({ p, userId, isAdmin = false }: { p: PostRow; userId: string; isAdmin?: boolean }) {
  const g = useUiTranslations("g027");
  const [reported, setReported] = useState(false);
  const [gone, setGone] = useState(false);
  const num = useUiFormatter().number;

  const {routes} = useContent();

  const language = useUiLocale();
  const fmt = new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"});
  const tx = useUiTranslations("ui");

  const [pending, run] = useTransition();
  const [liked, setLiked] = useState(p.liked); const [likes, setLikes] = useState(p.likes);
  const [open, setOpen] = useState(false); const [c, setC] = useState(""); const [err, setErr] = useState("");
  if (gone) return null;
  return (
    <article className="mx-5 rounded-[28px] border border-line bg-white shadow-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div><p className="text-sm font-bold">{p.author}</p><p className="text-[11px] text-mute">{p.route_title ? `${p.route_title} · ` : ""}{fmt.format(new Date(p.created_at))}</p></div>
        <div className="flex shrink-0 items-center gap-3">
          {p.user_id === userId && <button type="button" onClick={() => run(async () => { await deletePost(p.id); })} className="min-h-[44px] text-[11px] font-bold text-terra">{tx("delete_353ad")}</button>}
          {isAdmin && p.user_id !== userId && <button type="button" onClick={() => { if (confirm(g("removeConfirm"))) run(async () => { const r = await adminDeletePost(p.id); if (r.ok) setGone(true); }); }} className="min-h-[44px] text-[11px] font-bold text-terra">{g("remove")}</button>}
          {!isAdmin && p.user_id !== userId && <button type="button" disabled={reported} onClick={() => run(async () => { const r = await reportPost(p.id); if (r.ok) setReported(true); })} className="min-h-[44px] text-[11px] font-bold text-mute disabled:opacity-70">{reported ? g("reported") : g("report")}</button>}
        </div>
      </div>
      {p.photo_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.photo_url} alt="" loading="lazy" className="mt-2.5 max-h-[420px] w-full rounded-[20px] object-cover" />}
      <p className="mt-2.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-2">{p.body}</p>
      <div className="mt-2.5 flex items-center gap-5 text-[12.5px] font-semibold text-ink-2">
        <button type="button" aria-pressed={liked} disabled={pending} onClick={() => { const n = !liked; setLiked(n); setLikes((x) => x + (n ? 1 : -1)); run(async () => { const r = await toggleLike(p.id); if (!r.ok) { setLiked(!n); setLikes((x) => x + (n ? -1 : 1)); } }); }} className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#A64B22" : "none"} stroke={liked ? "#A64B22" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" /></svg>{num(likes)}
        </button>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{num(p.comments.length)}
        </button>
      </div>
      {open && (
        <div className="mt-3 border-t border-line pt-3">
          <ul className="flex flex-col gap-2">{p.comments.map((x) => (
            <li key={x.id} className="text-[13px]"><b>{x.author}</b> <span className="text-ink-2">{x.body}</span>{x.user_id === userId ? <button type="button" onClick={() => run(async () => { await deleteComment(x.id, "/sosyal"); })} className="ml-2 text-[11px] font-bold text-terra">{tx("delete_353ad")}</button> : isAdmin && <button type="button" onClick={() => run(async () => { await adminDeleteComment(x.id); })} className="ml-2 text-[11px] font-bold text-terra">{g("remove")}</button>}</li>
          ))}</ul>
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = c; run(async () => { setErr(""); const r = await addPostComment(p.id, t); if (r.ok) setC(""); else setErr(r.error); }); }}>
            <input value={c} onChange={(e) => setC(e.target.value)} maxLength={500} required placeholder={tx("writeAComment_25b41")} aria-label={tx("comment_a3b70")} className="h-10 min-w-0 flex-1 rounded-full border border-line px-3.5 text-sm outline-none focus:border-terra" />
            <button disabled={pending} className="h-10 rounded-full bg-navy px-4 text-xs font-bold text-white">{tx("send_6a23e")}</button>
          </form>
          

          {err && <p role="alert" className="mt-1 text-xs font-semibold text-[#8E2C12]">{err}</p>}
        </div>
      )}
    </article>
  );
}
