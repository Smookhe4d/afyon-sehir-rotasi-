"use client";
import { useTranslations } from "next-intl";
import { START_EVENT } from "@/components/AppTour";

/** G-023: giriş sonrası uygulama tanıtımını profil sayfasından yeniden başlatır. */
export default function TourReplay() {
  const t = useTranslations("g023");
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(START_EVENT))}
      className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-ac/10 px-4 text-[15px] font-bold text-ac">{t("replay")}</button>
  );
}
