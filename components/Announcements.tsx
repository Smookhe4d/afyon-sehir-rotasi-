import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";

type A = { id: string; title: string; body: string };
// Çerez kullanmadan REST ile okunur; sayfa statik kalır, 5 dakikada bir tazelenir. Tablo yoksa sessizce boş döner.
async function load(): Promise<A[]> {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/announcements?select=id,title,body&active=eq.true&order=created_at.desc&limit=2`, { headers: { apikey: supabaseKey }, next: { revalidate: 300 } });
    if (!r.ok) return [];
    return (await r.json()) as A[];
  } catch { return []; }
}
export default async function Announcements() {
  const items = await load();
  if (!items.length) return null;
  return (
    <div className="mx-5 mt-5 flex flex-col gap-2.5">
      {items.map((a) => (
        <aside key={a.id} className="flex gap-3 rounded-[22px] border border-[#EAD2B0] bg-[#FFF3DF] p-3.5 shadow-card">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terra/15 text-terra" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1ZM16 8a5 5 0 0 1 0 8" /></svg>
          </span>
          <div className="min-w-0"><p className="text-sm font-bold">{a.title}</p><p className="mt-0.5 text-[13px] leading-snug text-ink-2">{a.body}</p></div>
        </aside>
      ))}
    </div>
  );
}
