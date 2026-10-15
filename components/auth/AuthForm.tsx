"use client";
import {useTranslations as useUiTranslations} from "next-intl";

import {useLocale} from "next-intl";
import type {Locale} from "@/i18n/routing";
import {safeReturnPath, localizePath} from "@/i18n/paths";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";

type Mode = "giris" | "kayit" | "sifre";

export default function AuthForm() {
  const tx = useUiTranslations("ui");

  const errorText = (m: string) => {
  if (/Invalid login credentials/i.test(m)) return tx("incorrectEmailOrPassword_c1fdb");
  if (/already registered|already been registered/i.test(m)) return tx("anAccountWithThisEmail_29fc7");
  if (/Password should be at least/i.test(m)) return tx("yourPasswordMustBeAt_b9918");
  if (/rate limit|too many/i.test(m)) return tx("tooManyAttemptsPleaseTry_0826b");
  if (/Email not confirmed/i.test(m)) return tx("yourEmailAddressHasNot_97ac2");
  if (/Anonymous sign-ins are disabled/i.test(m)) return tx("guestSignInIsCurrently_417a0");
  return tx("somethingWentWrongPleaseTry_ae720");
};

  const router = useRouter();
  const locale = useLocale() as Locale;
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const safeNext = safeReturnPath(next, locale);
  const [mode, setMode] = useState<Mode>("giris");
  const [busy, setBusy] = useState(false);
  // Google düğmesi yalnızca Supabase'de sağlayıcı etkinse gösterilir
  const [googleOn, setGoogleOn] = useState(false);
  useEffect(() => {
    fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: supabaseKey ?? "" } }).then((r) => r.json()).then((d) => setGoogleOn(Boolean(d?.external?.google))).catch(() => {});
  }, []);
  const [msg, setMsg] = useState<{ type: "err" | "ok"; text: string } | null>(
    params.get("hata") ? { type: "err", text: tx("couldNotSignInPlease_b582c") } : null,
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
          options: { data: { display_name: name }, emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}&locale=${locale}` },
        });
        if (error) throw error;
        if (data.session) { router.replace(safeNext); router.refresh(); }
        else setMsg({ type: "ok", text: tx("aVerificationLinkHasBeen_2ac2b") });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(localizePath("/profil", locale))}&locale=${locale}` });
        if (error) throw error;
        setMsg({ type: "ok", text: tx("aPasswordResetLinkHas_f6b5a") });
      }
    } catch (err) {
      setMsg({ type: "err", text: errorText(err instanceof Error ? err.message : "") });
    } finally { setBusy(false); }
  }

  async function google() {
    setBusy(true); setMsg(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}&locale=${locale}` },
    });
    if (error) { setBusy(false); setMsg({ type: "err", text: tx("googleSignInIsCurrently_5d883") }); }
  }

  async function guest() {
    setBusy(true); setMsg(null);
    const { error } = await createClient().auth.signInAnonymously();
    if (error) { setBusy(false); setMsg({ type: "err", text: errorText(error.message) }); return; }
    router.replace(safeNext); router.refresh();
  }

  const field = "h-[52px] w-full rounded-2xl border border-line bg-white shadow-card px-4 text-[15px] text-navy outline-none placeholder:text-mute focus:border-terra focus:ring-2 focus:ring-terra/20";
  return (
    <div className="glass rounded-[32px] p-5">
      {mode !== "sifre" && (
        <div role="tablist" aria-label={tx("signInType_2b724")} className="mb-4 flex rounded-full bg-sand p-1">
          {(["giris", "kayit"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setMsg(null); }} type="button"
              className={`h-10 flex-1 rounded-full text-sm font-bold ${mode === m ? "bg-navy text-white" : "text-ink-2"}`}>{m === "giris" ? tx("signIn_a7fbd") : tx("createAnAccount_45824")}</button>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex flex-col gap-3" noValidate={false}>
        {mode === "kayit" && <input name="name" required minLength={2} maxLength={40} autoComplete="name" placeholder={tx("fullName_e5f44")} aria-label={tx("fullName_e5f44")} className={field} />}
        <input name="email" type="email" required autoComplete="email" placeholder={tx("email_0ff61")} aria-label={tx("email_0ff61")} className={field} />
        {mode !== "sifre" && <input name="password" type="password" required minLength={8} autoComplete={mode === "giris" ? "current-password" : "new-password"} placeholder={tx("passwordAtLeast8Characters_f7b7f")} aria-label={tx("password_6f26a")} className={field} />}
        {msg && <p role="alert" className={`rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold ${msg.type === "err" ? "bg-[#FBE4DC] text-[#8E2C12]" : "bg-[#E6EDD7] text-[#3F5A24]"}`}>{msg.text}</p>}
        <button disabled={busy} className="terra-grad h-[54px] rounded-full text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(166,75,34,.4)] disabled:opacity-60">
          {busy ? tx("pleaseWait_85c41") : mode === "giris" ? tx("signIn_a7fbd") : mode === "kayit" ? tx("createAccount_97ff8") : tx("sendResetLink_92e99")}
        </button>
      </form>
      {mode === "giris" && <button type="button" onClick={() => { setMode("sifre"); setMsg(null); }} className="mt-3 w-full text-center text-[13px] font-semibold text-terra">{tx("forgotPassword_35c0e")}</button>}
      {mode === "sifre" && <button type="button" onClick={() => { setMode("giris"); setMsg(null); }} className="mt-3 w-full text-center text-[13px] font-semibold text-terra">{tx("backToSignIn_2d011")}</button>}
      {mode !== "sifre" && (
        <>
          {googleOn && <div className="my-4 flex items-center gap-3 text-xs font-semibold text-mute"><span className="h-px flex-1 bg-line" />{tx("or_a8c8c")}<span className="h-px flex-1 bg-line" /></div>}
          {googleOn && (
          <button type="button" onClick={google} disabled={busy} className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white shadow-card text-[14.5px] font-bold disabled:opacity-60">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
              {tx("continueWithGoogle_35b6b")}</button>
          )}
          <button type="button" onClick={guest} disabled={busy} className="mt-2.5 h-11 w-full text-[13.5px] font-bold text-navy underline-offset-4 hover:underline disabled:opacity-60">{tx("continueAsAGuest_14595")}</button>
        </>
      )}
    </div>
  );
}
