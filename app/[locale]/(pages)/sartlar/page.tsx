import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import LegalPage from "@/components/LegalPage";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/sartlar", pageTitle(locale, "terms"));
}
export default async function Sartlar({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  return (
    <LegalPage eyebrow={tx("legal_02c08")} title={tx("termsOfUse_8a73f")} items={[
      [tx("generalInformation_259f9"), tx("afyonCityRoutesIsA_47944")],
      [tx("safety_854c3"), tx("onNatureAndWalkingRoutes_48945")],
      [tx("communityContent_602a1"), tx("youAreResponsibleForThe_75912")],
      [tx("photosAndSources_03089"), tx("photosOfStopsAreDisplayed_303ed")],
    ]} />
  );
}
