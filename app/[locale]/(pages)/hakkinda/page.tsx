import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import LegalPage from "@/components/LegalPage";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/hakkinda", pageTitle(locale, "about"));
}
export default async function Hakkinda({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  return (
    <>
      <LegalPage eyebrow={tx("information_af09b")} title={tx("about_12a5d")} items={[
        [tx("whatIsAfyonCityRoutes_3b2c7"), tx("aFreeDigitalGuideFor_cb532")],
        [tx("whereDoesTheInformationCome_122a3"), tx("stopDescriptionsAndRoutesAre_a100b")],
        [tx("howCanIContribute_2734f"), tx("useTheFeedbackPageTo_a6ac8")],
        [tx("groupTour_72adb"), tx("createACodeBySelecting_5b418")],
      ]} />
      <div className="-mt-4 px-5 pb-10"><Link href="/geri-bildirim" className="terra-grad flex h-14 items-center justify-center rounded-full font-bold text-white">{tx("sendFeedback_a9ddf")}</Link></div>
    </>
  );
}
