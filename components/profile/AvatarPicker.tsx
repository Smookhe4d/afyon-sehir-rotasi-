"use client";
import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Avatar from "./Avatar";
import Icon from "@/components/Icon";
import { AVATARS, AVATAR_BUCKET, AVATAR_CACHE } from "@/lib/avatars";
import { createClient } from "@/lib/supabase/client";
import { setAvatar } from "@/app/actions";

/** Fotoğrafı 512 piksel kare webp olarak küçültür. */
async function squareWebp(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(bmp.width, bmp.height), n = Math.min(512, s);
  const c = document.createElement("canvas"); c.width = c.height = n;
  c.getContext("2d")!.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, n, n);
  return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error("blob"))), "image/webp", 0.86));
}

export default function AvatarPicker({ userId, value, name, canUpload }: { userId: string; value: string | null; name: string; canUpload: boolean }) {
  const t = useTranslations("g015");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(value);
  const [err, setErr] = useState("");
  const [pending, run] = useTransition();
  const file = useRef<HTMLInputElement>(null);

  const save = (v: string | null) => run(async () => {
    const r = await setAvatar(v);
    if (!r.ok) { setErr(r.error); return; }
    setCur(v); setErr(""); setOpen(false);
    try { if (v) localStorage.setItem(AVATAR_CACHE, JSON.stringify({ v, name })); else localStorage.removeItem(AVATAR_CACHE); } catch {}
    router.refresh();
  });
  const upload = (f?: File) => {
    if (!f) return;
    run(async () => {
      try {
        const blob = await squareWebp(f);
        const sb = createClient();
        const path = `${userId}/${Date.now()}.webp`;
        const { error } = await sb.storage.from(AVATAR_BUCKET).upload(path, blob, { contentType: "image/webp" });
        if (error) throw error;
        const url = sb.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
        const r = await setAvatar(url);
        if (!r.ok) throw new Error(r.error);
        setCur(url); setErr(""); setOpen(false);
        try { localStorage.setItem(AVATAR_CACHE, JSON.stringify({ v: url, name })); } catch {}
        router.refresh();
      } catch { setErr(t("uploadFail")); }
    });
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={t("change")} className="relative shrink-0 rounded-full shadow-[0_0_0_3px_#fff,0_10px_24px_-12px_rgba(40,10,60,.5)]">
        <Avatar value={cur} name={name} size={76} />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-ac shadow-card"><Icon name="camera" size={16} fill /></span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/35 [animation:fade-in_.2s_both]" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal aria-label={t("change")} onClick={(e) => e.stopPropagation()} className="w-full max-w-[520px] rounded-t-[28px] bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 [animation:sheet-up_.35s_var(--ease-spring)_both]">
            <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-line" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-navy">{t("change")}</h2>
            {canUpload ? (
              <button type="button" disabled={pending} onClick={() => file.current?.click()} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ac text-sm font-bold text-white disabled:opacity-60">
                <Icon name="upload-simple" size={18} />{pending ? t("uploading") : t("upload")}
              </button>
            ) : <p className="mt-2 text-sm text-mute">{t("guestUpload")}</p>}
            <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files?.[0])} />
            <p className="mt-5 text-[13px] font-bold text-mute">{t("orPick")}</p>
            <ul className="mt-2 grid grid-cols-5 gap-3" role="radiogroup" aria-label={t("orPick")}>
              {AVATARS.map((a) => { const v = `avatar:${a.id}`; const on = cur === v; return (
                <li key={a.id}><button type="button" role="radio" aria-checked={on} aria-label={a.id} disabled={pending} onClick={() => save(v)} className={`mx-auto block rounded-full transition-transform ${on ? "scale-105 shadow-[0_0_0_3px_#fff,0_0_0_5px_var(--ac)]" : ""}`}><Avatar value={v} size={52} /></button></li>); })}
              <li><button type="button" disabled={pending || !cur} onClick={() => save(null)} aria-label={t("remove")} className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full border border-dashed border-line text-mute disabled:opacity-40"><Icon name="x" size={20} /></button></li>
            </ul>
            {err && <p role="alert" className="mt-3 text-sm font-semibold text-[#8E2C12]">{err}</p>}
          </div>
        </div>
      )}
    </>
  );
}
