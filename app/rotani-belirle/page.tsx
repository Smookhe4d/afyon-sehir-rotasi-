import PageHeader from "@/components/PageHeader";
import Builder from "@/components/builder/Builder";
import { getSession } from "@/lib/session";
export const metadata = { title: "Rotanı Belirle" };

export default async function Belirle() {
  const { supabase, user } = await getSession();
  const { data } = user ? await supabase.from("custom_routes").select("id, title, place_ids, is_public").eq("user_id", user.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <main>
      <PageHeader eyebrow="YENİ ROTA" title="Rotanı Belirle" />
      <Builder saved={data ?? []} />
    </main>
  );
}
