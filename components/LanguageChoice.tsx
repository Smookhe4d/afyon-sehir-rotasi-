"use client";
import {Suspense, useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {LanguageLink} from "@/i18n/navigation";
import {rememberLanguage, useCurrentHref} from "./LanguageSwitcher";

function Choice() {
  const t = useTranslations("languageChoice");
  const href = useCurrentHref();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!document.cookie.split(";").some(value => value.trim().startsWith("NEXT_LOCALE="))) setOpen(true);
  }, []);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  function choose(language: "tr" | "en") {
    rememberLanguage(language);
    setOpen(false);
    window.dispatchEvent(new Event("afyon-language-chosen"));
  }
  return <dialog ref={dialog} aria-labelledby="language-choice-title" onCancel={event => event.preventDefault()}
    className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md rounded-3xl border border-line bg-cream p-6 text-navy shadow-lift backdrop:bg-navy/60">
    <h2 id="language-choice-title" className="font-display text-2xl font-semibold"><span lang="tr">{t("titleTr")}</span><br /><span lang="en">{t("titleEn")}</span></h2>
    <p className="mt-3 text-sm text-ink-2"><span lang="tr">{t("descriptionTr")}</span><br /><span lang="en">{t("descriptionEn")}</span></p>
    <div className="mt-6 grid gap-3">
      {(["tr", "en"] as const).map(language => <LanguageLink key={language} href={href} locale={language} lang={language} hrefLang={language}
        onClick={() => choose(language)} className="flex min-h-12 items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-base font-bold shadow-card hover:bg-sand">
        {t(language === "tr" ? "turkish" : "english")}<span aria-hidden>›</span>
      </LanguageLink>)}
    </div>
  </dialog>;
}
export default function LanguageChoice() { return <Suspense fallback={null}><Choice /></Suspense>; }
