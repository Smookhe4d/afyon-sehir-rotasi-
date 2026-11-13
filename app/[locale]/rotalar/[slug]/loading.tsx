"use client";
import {useTranslations} from "next-intl";
/** G-016: rota sayfası sunucudan gelirken anında görünen iskelet. Geçiş beklemeden başlar. */
export default function Loading() {
  const t = useTranslations("common");
  return (
    <main aria-busy="true" aria-label={t("loading")}>
      <div className="skeleton h-[340px] w-full" />
      <div className="relative -mt-9 space-y-3 rounded-t-[34px] bg-cream px-5 pt-6">
        <div className="skeleton h-4 w-24 rounded-lg" />
        <div className="skeleton h-8 w-3/4 rounded-xl" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-5/6 rounded-lg" />
        <div className="skeleton mt-4 h-[120px] w-full rounded-3xl" />
        <div className="skeleton h-[120px] w-full rounded-3xl" />
      </div>
    </main>
  );
}
