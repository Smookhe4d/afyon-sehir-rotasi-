"use client";
import {useTranslations} from "next-intl";
/** G-020: tur ekranı yüklenirken görünen iskelet. */
export default function Loading() {
  const t = useTranslations("common");
  return (
    <div aria-busy="true" aria-label={t("loading")} className="fixed inset-0 z-[65] bg-cream px-4 pt-4 lg:top-16 lg:w-[520px] lg:px-6">
      <div className="skeleton h-11 w-full rounded-full" />
      <div className="skeleton mt-4 h-[230px] w-full rounded-[28px]" />
      <div className="skeleton mt-4 h-5 w-24 rounded-lg" />
      <div className="skeleton mt-2 h-8 w-3/4 rounded-xl" />
      <div className="skeleton mt-4 h-[84px] w-full rounded-[26px]" />
    </div>
  );
}
