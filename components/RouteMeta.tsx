import {useLocale} from "next-intl";
import {createTranslator} from "next-intl";
import type {Route} from "@/lib/types";
import type {Locale} from "@/i18n/routing";
import {getContent} from "@/lib/content";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

export function routeMetaLine(r: Route, locale: Locale = "tr"): string {
  const messages = locale === "en" ? en : tr;
  const t = createTranslator({locale, messages: messages.dynamic});
  const parts: string[] = [];
  if (r.distanceKm) {
    const approximate = /^(Yaklaşık|Toplam, yaklaşık|Approximate|Total, approximate)/i.test(r.distanceNote ?? "");
    parts.push(`${approximate ? "~" : ""}${new Intl.NumberFormat(locale).format(r.distanceKm)} km`);
  }
  parts.push(t("stopCount", {count: r.stops.length}));
  if (r.difficulty) parts.push(messages.labels.difficulty[r.difficulty]);
  return parts.join(" · ");
}
export function CategoryChip({r, motionOrder}: {r: Route; motionOrder?: string}) {
  const {categoryLabels} = getContent(useLocale() as Locale);
  return <span data-enter={motionOrder} className="self-start rounded-full bg-sand px-2.5 py-0.5 text-[10.5px] font-bold">{categoryLabels[r.category]}</span>;
}
