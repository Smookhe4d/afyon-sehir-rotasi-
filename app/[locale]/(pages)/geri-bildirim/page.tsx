import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import PageHeader from "@/components/PageHeader";
import FeedbackForm from "@/components/FeedbackForm";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/geri-bildirim", pageTitle(locale, "feedback"));
}

export default async function GeriBildirim({ params, searchParams }: { params: Promise<{locale: Locale}>; searchParams: Promise<{ durak?: string; tur?: string }> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  const { durak, tur } = await searchParams;
  return (
    <main className="pb-10">
      <PageHeader eyebrow={tx("contactUs_1ea2d")} title={tx("feedback_1c9ad")} />
      <p className="mx-5 mt-4 text-sm leading-relaxed text-ink-2">{tx("sendSuggestionsReportIncorrectInformation_ba40c")}</p>
      <FeedbackForm placeId={durak} kind0={tur} />
    </main>
  );
}
