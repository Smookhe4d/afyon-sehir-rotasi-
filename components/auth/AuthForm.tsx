"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "giris" | "kayit" | "sifre";

const errorText = (m: string) => {
  if (/Invalid login credentials/i.test(m)) return "E-posta veya şifre hatalı.";
  if (/already registered|already been registered/i.test(m)) return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.";
  if (/Password should be at least/i.test(m)) return "Şifre en az 8 karakter olmalı.";
  if (/rate limit|too many/i.test(m)) return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.";
  if (/Email not confirmed/i.test(m)) return "E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzdaki bağlantıya tıklayın.";
  if (/Anonymous sign-ins are disabled/i.test(m)) return "Misafir girişi şu an kapalı.";
  return "Bir sorun oluştu. Lütfen tekrar deneyin.";
};

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const [mode, setMode] = useState<Mode>("giris");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "err" | "ok"; text: string } | null>(
    params.get("hata") ? { type: "err", text: "Oturum açılamadı. Lütfen tekrar deneyin." } : null,
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const name = String(f.get("name") ?? "").trim();
    const supabase = createClient();
    try {
      if (mode === "giris") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(safeNext); router.refresh();
      } else if (mode === "kayit") {
        if (password.length < 8) throw new Error("Password should be at least 8");
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: name }, emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}` },
        });
        if (error) throw error;
        if (data.session) { router.replace(safeNext); router.refresh(); }
        else setMsg({ type: "ok", text: "Doğrulama bağlantısı e-posta adresinize gönderildi. Bağlantıya tıkladıktan sonra giriş yapabilirsiniz." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/profil` });
        if (error) throw error;
        setMsg({ type: "ok", text: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." });
      }
    } catch (err) {
      setMsg({ type: "err", text: errorText(err instanceof Error ? err.message : "") });
    } finally { setBusy(false); }
  }

  async function google() {
    setBusy(true); setMsg(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}` },
    });
    if (error) { setBusy(false); setMsg({ type: "err", text: "Google ile giriş şu an kullanılamıyor." }); }
  }

  async function guest() {
    setBusy(true); setMsg(null);
    const { error } = await createClient().auth.signInAnonymously();
    if (error) { setBusy(false); setMsg({ type: "err", text: errorText(error.message) }); return; }
    router.replace(safeNext); router.refresh();
  }

  const field = "h-[52px] w-full rounded-2xl border border-line bg-white px-4 text-[15px] text-navy outline-none placeholder:text-mute focus:border-terra focus:ring-2 focus:ring-terra/20";
  return (
    <div className="glass rounded-[32px] p-5">
      {mode !== "sifre" && (
        <div role="tablist" aria-label="Giriş türü" className="mb-4 flex rounded-full bg-sand p-1">
          {(["giris", "kayit"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setMsg(null); }} type="button"
              className={`h-10 flex-1 rounded-full text-sm font-bold ${mode === m ? "bg-navy text-white" : "text-ink-2"}`}>{m === "giris" ? "Giriş yap" : "Kayıt ol"}</button>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex flex-col gap-3" noValidate={false}>
        {mode === "kayit" && <input name="name" required minLength={2} maxLength={40} autoComplete="name" placeholder="Ad Soyad" aria-label="Ad Soyad" className={field} />}
        <input name="email" type="email" required autoComplete="email" placeholder="E-posta" aria-label="E-posta" className={field} />
        {mode !== "sifre" && <input name="password" type="password" required minLength={8} autoComplete={mode === "giris" ? "current-password" : "new-password"} placeholder="Şifre (en az 8 karakter)" aria-label="Şifre" className={field} />}
        {msg && <p role="alert" className={`rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold ${msg.type === "err" ? "bg-[#FBE4DC] text-[#8E2C12]" : "bg-[#E6EDD7] text-[#3F5A24]"}`}>{msg.text}</p>}
        <button disabled={busy} className="terra-grad h-[54px] rounded-full text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(166,75,34,.4)] disabled:opacity-60">
          {busy ? "Lütfen bekleyin…" : mode === "giris" ? "Giriş yap" : mode === "kayit" ? "Hesap oluştur" : "Sıfırlama bağlantısı gönder"}
        </button>
      </form>
      {mode === "giris" && <button type="button" onClick={() => { setMode("sifre"); setMsg(null); }} className="mt-3 w-full text-center text-[13px] font-semibold text-terra">Şifremi unuttum</button>}
      {mode === "sifre" && <button type="button" onClick={() => { setMode("giris"); setMsg(null); }} className="mt-3 w-full text-center text-[13px] font-semibold text-terra">Girişe dön</button>}
      {mode !== "sifre" && (
        <>
          <div className="my-4 flex items-center gap-3 text-xs font-semibold text-mute"><span className="h-px flex-1 bg-line" />veya<span className="h-px flex-1 bg-line" /></div>
          <button type="button" onClick={google} disabled={busy} className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white text-[14.5px] font-bold disabled:opacity-60">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
            Google ile devam et
          </button>
          <button type="button" onClick={guest} disabled={busy} className="mt-2.5 h-11 w-full text-[13.5px] font-bold text-navy underline-offset-4 hover:underline disabled:opacity-60">Misafir olarak devam et</button>
        </>
      )}
    </div>
  );
}
