"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

type Active = { slug: string; grup: string; lider: boolean; mode: string; t: number };

/** G-025: devam eden grup turu varsa tur dışındaki sayfalarda gruba dönme şeridi gösterir. */
export default function GroupResume() {
  const t = useTranslations("g025");
  const path = usePathname();
  const [a, setA] = useState<Active | null>(null);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("afyon-grup-aktif") ?? "null") as Active | null;
      setA(v && Date.now() - v.t < 12 * 3600_000 ? v : null);
    } catch { setA(null); }
  }, [path]);
  if (!a || path.endsWith("/tur")) return null;
  return (
    <Link href={`/rotalar/${a.slug}/tur?mod=${a.mode}&grup=${a.grup}${a.lider ? "&lider=1" : ""}`}
      className="terra-grad fixed inset-x-3 top-[calc(env(safe-area-inset-top)+10px)] z-[90] mx-auto flex min-h-12 max-w-[480px] items-center justify-between gap-3 rounded-full px-5 text-[14px] font-bold text-white shadow-card">
      <span>{t("resume")}</span><span className="rounded-full bg-white/20 px-3 py-1 text-[13px]">{t("resumeGo")}</span>
    </Link>
  );
}
