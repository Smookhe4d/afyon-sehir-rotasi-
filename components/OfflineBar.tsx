"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** G-027: İnternet kesilince ekranın üstünde kısa bir bilgi şeridi gösterir. */
export default function OfflineBar() {
  const t = useTranslations("g027");
  const [off, setOff] = useState(false);
  useEffect(() => {
    const set = () => setOff(!navigator.onLine);
    set();
    addEventListener("online", set); addEventListener("offline", set);
    return () => { removeEventListener("online", set); removeEventListener("offline", set); };
  }, []);
  if (!off) return null;
  return (
    <div role="status" className="fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-[max(env(safe-area-inset-top),6px)] pointer-events-none">
      <p className="rounded-full bg-navy px-4 py-2 text-[12.5px] font-semibold text-white shadow-card">{t("offline")}</p>
    </div>
  );
}
