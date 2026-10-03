"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

/** Çerezsiz, anonim sayfa görüntüleme sayacı: yalnızca yol ve oturuma özel rastgele kimlik gönderilir. */
export default function Track() {
  const path = usePathname();
  useEffect(() => {
    if (!supabaseConfigured || path.startsWith("/yonetim") || navigator.doNotTrack === "1") return;
    try {
      let sid = sessionStorage.getItem("afyon-sid");
      if (!sid) { sid = Math.random().toString(36).slice(2, 12); sessionStorage.setItem("afyon-sid", sid); }
      void createClient().from("events").insert({ path: path.slice(0, 200), sid }).then(() => {}, () => {});
    } catch { /* ölçüm başarısızsa sessizce geç */ }
  }, [path]);
  return null;
}
