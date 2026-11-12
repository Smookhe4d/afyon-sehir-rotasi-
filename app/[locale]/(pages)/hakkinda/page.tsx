import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { photos } from "@/lib/photos";
import LegalPage from "@/components/LegalPage";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/hakkinda", pageTitle(locale, "about"));
}
export default async function Hakkinda({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});
  const g = await getUiTranslations({locale: (await params).locale, namespace: "g011"});
  const pt = await getUiTranslations({locale: (await params).locale, namespace: "photos"});

  setRequestLocale((await params).locale);
  return (
    <>
      <LegalPage eyebrow={tx("information_af09b")} title={tx("about_12a5d")} items={[
        [tx("whatIsAfyonCityRoutes_3b2c7"), tx("aFreeDigitalGuideFor_cb532")],
        [tx("whereDoesTheInformationCome_122a3"), tx("stopDescriptionsAndRoutesAre_a100b")],
        [tx("howCanIContribute_2734f"), tx("useTheFeedbackPageTo_a6ac8")],
        [tx("groupTour_72adb"), tx("createACodeBySelecting_5b418")],
      ]} />
      <div className="-mt-4 px-5 pb-6"><Link href="/geri-bildirim" className="terra-grad flex h-14 items-center justify-center rounded-full font-bold text-white">{tx("sendFeedback_a9ddf")}</Link></div>
      <section id="gorsel-kaynaklari" className="px-5 pb-12">
        <h2 className="font-display text-xl text-navy">{g("credits")}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{g("creditsIntro")}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {Object.entries(photos).map(([id, ph]) => (
            <li key={id} className="rounded-2xl bg-white px-3.5 py-2.5 text-[13px] leading-snug shadow-card"><b className="block text-navy">{pt(id)}</b><a href={ph.page} target="_blank" rel="noopener noreferrer" className="text-mute underline decoration-line underline-offset-2">{g("photoBy", {author: ph.author, license: ph.license})}</a></li>
          ))}
        </ul>
      </section>
    </>
  );
}
