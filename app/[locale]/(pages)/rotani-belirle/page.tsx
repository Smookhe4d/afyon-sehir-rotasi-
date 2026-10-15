import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import PageHeader from "@/components/PageHeader";
import Builder from "@/components/builder/Builder";
import { getSession } from "@/lib/session";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/rotani-belirle", pageTitle(locale, "plan"));
}

export default async function Belirle({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  const { supabase, user } = await getSession();
  const { data } = user ? await supabase.from("custom_routes").select("id, title, place_ids, is_public").eq("user_id", user.id).order("created_at", { ascending: false }) : { data: [] };
  return (
    <main>
      <PageHeader eyebrow={tx("newRoute_0cfdf")} title={tx("planYourRoute_cdc25")} />
      <Builder saved={data ?? []} />
    </main>
  );
}
