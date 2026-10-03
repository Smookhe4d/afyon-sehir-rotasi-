"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabs } from "@/lib/tabs";

export default function GlassTab() {
  const path = usePathname();
  if (path.startsWith("/giris")) return null;
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <nav aria-label="Ana gezinme" className="glass fixed inset-x-3.5 lg:hidden bottom-6 z-50 mx-auto flex h-[70px] max-w-[520px] items-center justify-between rounded-[35px] px-1.5">
      {tabs.map((t) => {
        const on = isActive(t.href);
        return (
          <Link key={t.id} href={t.href} aria-current={on ? "page" : undefined}
            className={`flex min-h-[58px] flex-1 flex-col items-center justify-center gap-[3px] ${on ? "text-navy" : "text-ink-2"}`}>
            <span className={`flex h-[30px] w-[46px] items-center justify-center rounded-full ${on ? "terra-grad text-white shadow-[0_4px_12px_rgba(166,75,34,.4)]" : ""}`}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={t.d} /></svg>
            </span>
            <span className={`whitespace-nowrap text-[10px] leading-none ${on ? "font-bold" : "font-semibold"}`}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
