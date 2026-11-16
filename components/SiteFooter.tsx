"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** G-019: yalnızca geniş ekranda görünen sayfa sonu. Telefonda alttaki sekme çubuğu kullanılır. */
export default function SiteFooter() {
  const n = useTranslations("nav");
  const tx = useTranslations("ui");
  const g = useTranslations("g019");
  const explore = [["/rotalar", n("routes")], ["/harita", n("map")], ["/rotani-belirle", n("plan")], ["/sosyal", n("community")]] as const;
  const info = [["/hakkinda", n("about")], ["/gizlilik", tx("privacy_9e93e")], ["/sartlar", tx("termsOfUse_8a73f")], ["/geri-bildirim", tx("suggestionsContributionsAndComplaints_bedd0")]] as const;
  const col = (title: string, items: readonly (readonly [string, string])[]) => (
    <div>
      <h2 className="text-xs font-bold text-mute">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2">{items.map(([h, l]) => <li key={h}><Link href={h} className="text-sm font-semibold text-ink-2 hover:text-ac">{l}</Link></li>)}</ul>
    </div>
  );
  return (
    <footer data-site-footer className="mt-16 hidden border-t border-line/70 bg-white/60 lg:block">
      <nav aria-label={g("footNav")} className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-10 px-6 py-12">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/2/rotafyon-acik-480.webp" srcSet="/brand/2/rotafyon-acik-480.webp 1x, /brand/2/rotafyon-acik-960.webp 2x" width={120} height={36} alt={n("brand")} className="h-9 w-auto" />
          <p className="mt-3 max-w-[340px] text-sm leading-relaxed text-ink-2">{g("footTag")}</p>
          <p className="mt-6 text-xs text-mute">© 2026 rotAfyon</p>
        </div>
        {col(g("footExplore"), explore)}
        {col(g("footInfo"), info)}
      </nav>
    </footer>
  );
}
