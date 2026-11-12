import {getTranslations} from "next-intl/server";
/** G-011: sade iOS başlığı. Üst etiket küçük ve sakin, başlık büyük. */
export default async function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const t = await getTranslations("common");
  return (
    <header aria-label={t("header")} className="px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <p className="text-[13px] font-semibold text-mute">{eyebrow}</p>
      <h1 className="mt-0.5 font-display text-[34px] leading-none text-navy">{title}</h1>
    </header>
  );
}
