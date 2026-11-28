"use client";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

/** G-027: Tur kayıtları. Kişisel veri tutulmaz, yalnızca cihaza özel rastgele kimlik gönderilir.
 *  İnternet yoksa kayıt telefonda bekletilir, bağlantı gelince gönderilir. */
export type Olay = { kind: "tur_basla" | "durak" | "tur_bitir" | "ses_basla" | "ses_bitir" | "anket"; route_slug: string; stop_id?: string; mode?: string; role?: string; value?: number };
type Row = Olay & { sid: string; at: string };
const KEY = "afyon-olay-kuyruk";
let busy = false;

function sid() {
  try {
    let s = localStorage.getItem("afyon-cihaz");
    if (!s) { s = crypto.randomUUID().slice(0, 18); localStorage.setItem("afyon-cihaz", s); }
    return s;
  } catch { return "bilinmiyor"; }
}
const read = (): Row[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Row[]; } catch { return []; } };
const write = (q: Row[]) => { try { localStorage.setItem(KEY, JSON.stringify(q.slice(-500))); } catch { /* dolu */ } };

export async function flushOlay() {
  if (busy || !supabaseConfigured || !navigator.onLine) return;
  const q = read(); if (!q.length) return;
  busy = true;
  try {
    const batch = q.slice(0, 100);
    const { error } = await createClient().from("tour_events").insert(batch.map((r) => ({ kind: r.kind, route_slug: r.route_slug, stop_id: r.stop_id ?? null, mode: r.mode ?? null, role: r.role ?? null, value: r.value ?? null, sid: r.sid, happened_at: r.at })));
    if (!error) { write(read().slice(batch.length)); if (read().length) setTimeout(() => void flushOlay(), 500); }
  } catch { /* sonra tekrar denenir */ } finally { busy = false; }
}

export function olay(o: Olay) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  write([...read(), { ...o, sid: sid(), at: new Date().toISOString() }]);
  void flushOlay();
}

if (typeof window !== "undefined") addEventListener("online", () => void flushOlay());
