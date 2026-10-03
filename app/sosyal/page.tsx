import PageHeader from "@/components/PageHeader";
import SignInPrompt from "@/components/SignInPrompt";
import { Composer, PostCard, type PostRow } from "@/components/social/Feed";
import { getRoute } from "@/lib/routes";
import { getSession } from "@/lib/session";
import { supabaseUrl } from "@/lib/supabase/env";

export const metadata = { title: "Sosyal" };
export const dynamic = "force-dynamic";

type Prof = { display_name: string } | { display_name: string }[] | null;
const nameOf = (p: Prof) => (Array.isArray(p) ? p[0]?.display_name : p?.display_name) ?? "Gezgin";

export default async function Sosyal() {
  const { supabase, user, profile } = await getSession();
  if (!user) return (<main><PageHeader eyebrow="TOPLULUK" title="Sosyal" /><SignInPrompt title="Topluluğa katılın" text="Gezginlerin fotoğraflarını ve rota yorumlarını görmek, kendi paylaşımınızı yapmak için giriş yapın." /></main>);
  const { data, error } = await supabase
    .from("posts")
    .select("id, body, photo_path, route_slug, created_at, user_id, profiles(display_name), post_likes(user_id), comments(id, body, user_id, created_at, profiles(display_name))")
    .order("created_at", { ascending: false }).limit(40);

  const rows: PostRow[] = (data ?? []).map((p) => ({
    id: p.id, body: p.body, created_at: p.created_at, user_id: p.user_id, author: nameOf(p.profiles as unknown as Prof),
    photo_url: p.photo_path ? `${supabaseUrl}/storage/v1/object/public/post-photos/${p.photo_path}` : null,
    route_title: p.route_slug ? getRoute(p.route_slug)?.title ?? null : null,
    likes: (p.post_likes as { user_id: string }[]).length, liked: (p.post_likes as { user_id: string }[]).some((l) => l.user_id === user.id),
    comments: (p.comments as unknown as { id: string; body: string; user_id: string; created_at: string; profiles: Prof }[])
      .sort((a, b) => a.created_at.localeCompare(b.created_at)).map((c) => ({ id: c.id, body: c.body, user_id: c.user_id, author: nameOf(c.profiles) })),
  }));
  const registered = Boolean(profile && !profile.is_guest);

  return (
    <main>
      <PageHeader eyebrow="TOPLULUK" title="Sosyal" />
      <div className="flex flex-col gap-3">
        <Composer userId={user.id} canPost={registered} />
        {error && <p role="alert" className="mx-5 rounded-2xl bg-[#FBE4DC] px-4 py-3 text-sm text-[#8E2C12]">Akış yüklenemedi. Lütfen sayfayı yenileyin.</p>}
        {!error && rows.length === 0 && <p className="mx-5 rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-mute">Henüz paylaşım yok. İlk paylaşımı siz yapın.</p>}
        {rows.map((p) => <PostCard key={p.id} p={p} userId={user.id} canComment={registered} />)}
      </div>
    </main>
  );
}
