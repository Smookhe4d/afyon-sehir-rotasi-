import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import PageHeader from "@/components/PageHeader";
import RouteBrowser from "@/components/RouteBrowser";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/Icon";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/rotalar", pageTitle(locale, "routes"));
}

export default async function Rotalar({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});
  const g = await getUiTranslations({locale: (await params).locale, namespace: "g011"});

  setRequestLocale((await params).locale);
  return (
    <main className="wide lg:px-4">
      <PageHeader eyebrow={tx("afyonkarahSar_6ac24")} title={tx("routes_c1ecc")} />
      <Link href="/rotani-belirle" className="mx-5 mb-4 flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-card lg:max-w-[720px]">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ac-soft text-ac"><Icon name="signpost" size={24} fill /></span>
        <span className="min-w-0 flex-1"><b className="block text-[15.5px] text-navy">{g("plan")}</b><span className="text-[13px] text-mute">{g("planText")}</span></span><Icon name="caret-right" size={18} className="text-mute/60" />
      </Link>
      <Suspense><RouteBrowser /></Suspense>
    </main>
  );
}
