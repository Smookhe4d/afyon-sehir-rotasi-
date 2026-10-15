import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import PageHeader from "@/components/PageHeader";
import RouteBrowser from "@/components/RouteBrowser";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/rotalar", pageTitle(locale, "routes"));
}

export default async function Rotalar({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  return (
    <main className="wide lg:px-4">
      <PageHeader eyebrow={tx("afyonkarahSar_6ac24")} title={tx("routes_c1ecc")} />
      <RouteBrowser />
    </main>
  );
}
