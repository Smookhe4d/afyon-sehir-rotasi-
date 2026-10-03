import PageHeader from "@/components/PageHeader";

export default function LegalPage({ eyebrow, title, items }: { eyebrow: string; title: string; items: [string, string][] }) {
  return (
    <main className="pb-10">
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="space-y-5 px-5 pt-5 text-[14.5px] leading-relaxed text-ink-2">
        {items.map(([h, t]) => (<section key={h}><h2 className="font-display text-lg font-semibold text-navy">{h}</h2><p className="mt-1">{t}</p></section>))}
        <p className="text-xs text-mute">Son güncelleme: Ekim 2026</p>
      </div>
    </main>
  );
}
