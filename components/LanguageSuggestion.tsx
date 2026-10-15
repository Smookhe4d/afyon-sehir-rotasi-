"use client";
import {Suspense, useEffect, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {rememberLanguage, useCurrentHref} from "./LanguageSwitcher";

function Suggestion() {
  const locale = useLocale();
  const t = useTranslations("languageSuggestion");
  const href = useCurrentHref();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const cookies = document.cookie.split(";").map(value => value.trim());
    setVisible(locale === "tr" && navigator.language.toLowerCase().startsWith("en") &&
      !cookies.some(value => value.startsWith("NEXT_LOCALE=") || value.startsWith("afyon-language-suggestion=")));
  }, [locale]);
  if (!visible) return null;
  function dismiss() {
    document.cookie = "afyon-language-suggestion=closed; path=/; max-age=31536000; samesite=lax";
    setVisible(false);
  }
  return <aside aria-label={t("text")} className="fixed inset-x-0 top-0 z-[60] border-b border-line bg-cream px-4 py-2 text-navy shadow-card lg:top-16">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-sm">
      <p>{t("text")} <Link href={href} locale="en" onClick={() => {rememberLanguage("en"); setVisible(false);}} className="inline-flex min-h-11 items-center font-bold text-terra underline">{t("switch")}</Link></p>
      <button type="button" onClick={dismiss} aria-label={t("close")} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-line">×</button>
    </div>
  </aside>;
}
export default function LanguageSuggestion() {
  return <Suspense fallback={null}><Suggestion /></Suspense>;
}
