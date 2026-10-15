"use client";
import {useTranslations} from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";

const links = [["/", "home"], ["/rotalar", "routes"], ["/harita", "map"], ["/rotani-belirle", "plan"], ["/sosyal", "community"], ["/hakkinda", "about"]] as const;

/** Yalnızca geniş ekranda görünen üst menü; telefonda alttaki sekme çubuğu kullanılır. */
export default function TopNav() {
  const t = useTranslations("nav");
  const path = usePathname();
  const on = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <header className="sticky top-0 z-50 hidden h-16 border-b border-line/70 bg-cream/85 backdrop-blur-xl lg:block">
      <nav aria-label={t("menu")} className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/apple-icon.png" alt="" className="h-9 w-9 rounded-xl shadow-card" />
          <span className="font-display text-[19px] font-semibold leading-none">{t("brand")}</span>
        </Link>
        <ul className="flex flex-1 items-center gap-1">
          {links.map(([h, l]) => (
            <li key={h}><Link href={h} aria-current={on(h) ? "page" : undefined} className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${on(h) ? "bg-navy text-white" : "text-ink-2 hover:bg-sand"}`}>{t(l)}</Link></li>
          ))}
        </ul>
        <Link href="/profil" className="terra-grad rounded-full px-5 py-2.5 text-sm font-bold text-white">{t("profile")}</Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
