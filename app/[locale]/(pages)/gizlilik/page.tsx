import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import LegalPage from "@/components/LegalPage";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/gizlilik", pageTitle(locale, "privacy"));
}
export default async function Gizlilik({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  return (
    <LegalPage eyebrow={tx("legal_02c08")} title={tx("privacy_9e93e")} items={[
      [tx("whatDataDoWeCollect_cf9b3"), tx("whenYouCreateAnAccount_07f6a")],
      [tx("visitMeasurement_d8087"), tx("pageViewsAreCountedAnonymously_d2b4f")],
      [tx("feedbackAndGroupTours_573ea"), tx("onlyTheSiteAdministratorCan_92660")],
      [tx("locationData_8aa1d"), tx("yourLiveLocationOnThe_3790d")],
      [tx("howDataIsUsed_e831f"), tx("dataIsUsedOnlyTo_edef6")],
      [tx("yourRights_ffa3f"), tx("youMayRequestThatYour_c9b34")],
    ]} />
  );
}
