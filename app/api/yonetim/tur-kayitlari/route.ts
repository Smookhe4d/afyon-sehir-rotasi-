import { createClient } from "@/lib/supabase/server";

/** G-027: Yönetici için son 90 günün tur kayıtlarını Excel'de açılabilen CSV olarak indirir. */
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) return new Response("Yetki yok", { status: 403 });
  const since = new Date(Date.now() - 90 * 864e5).toISOString();
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; from < 50000; from += 1000) {
    const { data, error } = await supabase.from("tour_events").select("happened_at, route_slug, kind, stop_id, value, mode, role, sid").gte("happened_at", since).order("happened_at").range(from, from + 999);
    if (error) return new Response("Kayıtlar okunamadı", { status: 500 });
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const cols = ["happened_at", "route_slug", "kind", "stop_id", "value", "mode", "role", "sid"];
  const head = ["zaman", "rota", "olay", "durak", "deger", "ulasim", "rol", "cihaz"];
  const esc = (v: unknown) => { const s = v == null ? "" : String(v); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const csv = "﻿" + [head.join(";"), ...rows.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="tur-kayitlari-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
}
