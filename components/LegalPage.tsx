import {useLocale, useTranslations as useUiTranslations} from "next-intl";
import PageHeader from "@/components/PageHeader";

export default function LegalPage({ eyebrow, title, items }: { eyebrow: string; title: string; items: [string, string][] }) {
  const tx = useUiTranslations("ui");

  const legal = useUiTranslations("legal");
  const locale = useLocale();
  return (
    <main className="pb-10">
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="space-y-5 px-5 pt-5 text-[14.5px] leading-relaxed text-ink-2">
        {locale === "en" && <p className="rounded-2xl border border-line bg-sand p-4 text-sm font-semibold">{legal("translation")}</p>}
        {items.map(([h, t]) => (<section key={h}><h2 className="font-display text-lg font-semibold text-navy">{h}</h2><p className="mt-1">{t}</p></section>))}
        <p className="text-xs text-mute">{tx("lastUpdatedOctober2026_3d378")}</p>
      </div>
    </main>
  );
}
