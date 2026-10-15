"use client";
import {Suspense} from "react";
import {useParams, useSearchParams} from "next/navigation";
import {useLocale, useTranslations} from "next-intl";
import {LanguageLink, usePathname} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";

export function rememberLanguage(locale: Locale) {
  document.cookie = "NEXT_LOCALE=" + locale + "; path=/; max-age=31536000; samesite=lax";
}
export function useCurrentHref() {
  const pathname = usePathname();
  const params = useParams();
  const query = useSearchParams();
  const path = pathname.replace(/\[([^\]]+)\]/g, (_, key: string) => encodeURIComponent(String(params[key] ?? "")));
  return path + (query.size ? "?" + query.toString() : "");
}
function Switcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const href = useCurrentHref();
  return <nav aria-label={t("language")} className="flex shrink-0 items-center gap-1 text-sm font-bold">
    {(["tr", "en"] as const).map(language =>
      <LanguageLink key={language} href={href} locale={language}
        onClick={() => rememberLanguage(language)}
        aria-label={t(language === "tr" ? "turkish" : "english")}
        aria-current={locale === language ? "page" : undefined}
        className={"inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line " + (locale === language ? "bg-navy text-white" : "bg-cream text-navy")}>
        {language.toUpperCase()}
      </LanguageLink>
    )}
  </nav>;
}
export default function LanguageSwitcher() {
  return <Suspense fallback={null}><Switcher /></Suspense>;
}
