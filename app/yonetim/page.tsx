import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SignInPrompt from "@/components/SignInPrompt";
import { AnnouncementsAdmin, FeedbackList, type AnnRow, type FeedbackRow } from "@/components/admin/AdminClient";
import { getSession } from "@/lib/session";
import { places } from "@/lib/places";

export const metadata = { title: "Yönetim", robots: { index: false } };
export const dynamic = "force-dynamic";

type Stats = { users: number; guests: number; posts: number; comments: number; favorites: number; started_routes: number; completed_routes: number; feedback_new: number; views_today: number; visitors_today: number; views_7d: number; visitors_7d: number; daily: { d: string; views: number; visitors: number }[]; top_pages: { path: string; views: number }[] };

function Note({ title, text }: { title: string; text: string }) {
  return <div className="glass mx-5 mt-6 rounded-[28px] p-6"><p className="font-display text-xl font-semibold">{title}</p><p className="mt-2 text-sm leading-relaxed text-ink-2">{text}</p></div>;
}

export default async function Yonetim() {
  const { supabase, user } = await getSession();
  const head = <PageHeader eyebrow="SİTE YÖNETİMİ" title="Yönetim" />;
  if (!user) return <main>{head}<SignInPrompt title="Yönetici girişi" text="Bu sayfa yalnızca site yöneticileri içindir." /></main>;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) return <main>{head}<Note title="Kurulum gerekli" text="Yönetim tabloları henüz oluşturulmamış. Supabase SQL Editor'de supabase/migrations/002_yonetim.sql dosyasını çalıştırın." /></main>;
  if (isAdmin !== true) return <main>{head}<Note title="Yetkiniz yok" text="Hesabınız yönetici olarak tanımlı değil." /></main>;

  const [st, fb, an] = await Promise.all([
    supabase.rpc("admin_stats"),
    supabase.from("feedback").select("id, kind, place_id, message, contact, status, admin_note, created_at").order("created_at", { ascending: false }).limit(150),
    supabase.from("announcements").select("id, title, body, active").order("created_at", { ascending: false }).limit(30),
  ]);
  const s = st.data as Stats | null;
  const rows: FeedbackRow[] = (fb.data ?? []).map((r) => ({ ...r, place_name: r.place_id ? places[r.place_id]?.name ?? r.place_id : null }));
  const max = Math.max(1, ...(s?.daily ?? []).map((d) => d.views));
  const tile = (label: string, v: number | string | undefined) => (
    <div className="rounded-2xl border border-line bg-white p-3.5 shadow-card"><p className="text-[11px] font-semibold text-mute">{label}</p><p className="font-display text-[26px] font-semibold leading-tight">{v ?? "–"}</p></div>
  );

  return (
    <main className="pb-10">
      {head}
      <div className="px-5">
        <h2 className="mt-4 font-display text-xl font-semibold">Özet</h2>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {tile("Bugün görüntüleme", s?.views_today)}{tile("Bugün ziyaretçi", s?.visitors_today)}
          {tile("7 gün görüntüleme", s?.views_7d)}{tile("7 gün ziyaretçi", s?.visitors_7d)}
          {tile("Kayıtlı kullanıcı", s?.users)}{tile("Misafir hesap", s?.guests)}
          {tile("Başlatılan rota", s?.started_routes)}{tile("Tamamlanan rota", s?.completed_routes)}
          {tile("Paylaşım / yorum", s ? `${s.posts} / ${s.comments}` : undefined)}{tile("Favori", s?.favorites)}
        </div>
        {s && s.daily.length > 0 && (
          <div className="mt-4 rounded-2xl border border-line bg-white p-3.5 shadow-card">
            <p className="text-xs font-bold text-mute">Son 14 gün · sayfa görüntüleme</p>
            <div className="mt-3 flex h-24 items-end gap-1" role="img" aria-label="Günlük görüntüleme grafiği">
              {s.daily.map((d) => <div key={d.d} title={`${d.d}: ${d.views} görüntüleme, ${d.visitors} ziyaretçi`} className="terra-grad min-w-0 flex-1 rounded-t" style={{ height: `${Math.max(4, (d.views / max) * 100)}%` }} />)}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-mute"><span>{s.daily[0].d.slice(5)}</span><span>{s.daily[s.daily.length - 1].d.slice(5)}</span></div>
          </div>
        )}
        {s && s.top_pages.length > 0 && (
          <div className="mt-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
            <p className="text-xs font-bold text-mute">En çok açılan sayfalar (7 gün)</p>
            <ul className="mt-2 space-y-1">{s.top_pages.map((p) => <li key={p.path} className="flex justify-between gap-3 text-[13px]"><span className="truncate font-medium">{p.path}</span><b>{p.views}</b></li>)}</ul>
          </div>
        )}
        {st.error && <p className="mt-3 rounded-2xl bg-[#FBE4DC] px-3.5 py-2.5 text-xs font-semibold text-[#8E2C12]">Özet alınamadı: SQL dosyasının tamamını çalıştırdığınızdan emin olun.</p>}

        <h2 className="mt-8 font-display text-xl font-semibold">Geri bildirimler {s ? <span className="text-sm font-medium text-mute">· {s.feedback_new} yeni</span> : null}</h2>
        <FeedbackList rows={rows} />

        <h2 className="mt-8 font-display text-xl font-semibold">Duyurular</h2>
        <AnnouncementsAdmin rows={(an.data ?? []) as AnnRow[]} />

        <p className="mt-8 text-center text-xs text-mute"><Link href="/" className="underline">Siteye dön</Link></p>
      </div>
    </main>
  );
}
