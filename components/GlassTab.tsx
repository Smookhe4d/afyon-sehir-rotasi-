"use client";
import {useTranslations} from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import Icon from "./Icon";

// G-011: yüzen sekme çubuğu (G-015: opak beyaz zemin) ve ayrı QR düğmesi. Harita Keşfet'in içinde, Rotanı belirle Rotalar sayfasında.
const TABS = [
  { id: "kesfet", label: "home", href: "/", icon: "compass" },
  { id: "rotalar", label: "routes", href: "/rotalar", icon: "path" },
  { id: "sosyal", label: "community", href: "/sosyal", icon: "users" },
  { id: "profil", label: "profile", href: "/profil", icon: "user-circle" },
] as const;

export default function GlassTab() {
  const tNav = useTranslations("nav");
  const tx = useTranslations("ui");
  const path = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const activeId = TABS.find((t) => (t.href === "/" ? path === "/" || path.startsWith("/harita") : path.startsWith(t.href) || (t.id === "rotalar" && (path.startsWith("/rotani-belirle") || path.startsWith("/duraklar")))))?.id;
  useLayoutEffect(() => {
    const b = bar.current?.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
    setPill(b ? { x: b.offsetLeft, w: b.offsetWidth } : null);
  }, [activeId]);
  if (path.startsWith("/giris")) return null;
  return (
    <nav data-tabbar aria-label={tNav("tabs")} className="fixed inset-x-2.5 bottom-[max(0.625rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-[520px] items-center gap-2.5 lg:hidden">
      <div ref={bar} className="relative flex h-16 flex-1 rounded-full border border-line bg-white p-1 shadow-[0_14px_32px_-16px_rgba(40,10,60,.35)]">
        {pill && <span aria-hidden className="absolute bottom-1 top-1 rounded-full bg-ac-soft transition-[transform,width] duration-500 [transition-timing-function:var(--ease-spring)]" style={{ width: pill.w, transform: `translateX(${pill.x - 4}px)`, left: 4 }} />}
        {TABS.map((t) => {
          const on = t.id === activeId;
          return (
            <Link key={t.id} data-tab={t.id} href={t.href} aria-current={on ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${on ? "font-bold text-ac" : "font-semibold text-mute"}`}>
              <Icon name={t.icon} size={24} fill={on} />
              <span className="whitespace-nowrap leading-none">{tNav(t.label)}</span>
            </Link>
          );
        })}
      </div>
      <Link href="/qr" aria-label={tx("startARouteWithQr_8ea80")} className="flex h-16 w-16 items-center justify-center rounded-full bg-ac2 text-navy shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_14px_26px_-12px_var(--ac2)]">
        <Icon name="qr-code" size={28} />
      </Link>
    </nav>
  );
}
