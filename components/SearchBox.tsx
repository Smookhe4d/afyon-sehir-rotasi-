"use client";
import {useTranslations as useUiTranslations} from "next-intl";

import { Link } from "@/i18n/navigation";
import { useId, useMemo, useState } from "react";

export type SearchItem = { href: string; label: string; sub: string };
const fold = (s: string) => s.toLocaleLowerCase("tr").replace(/[â]/g, "a").replace(/[î]/g, "i").replace(/[û]/g, "u");

export default function SearchBox({ items }: { items: SearchItem[] }) {
  const tx = useUiTranslations("ui");

  const [q, setQ] = useState("");
  const id = useId();
  const hits = useMemo(() => {
    const n = fold(q.trim());
    if (n.length < 2) return [];
    return items.filter((i) => fold(`${i.label} ${i.sub}`).includes(n)).slice(0, 7);
  }, [q, items]);
  return (
    <div className="relative z-20">
      <label htmlFor={id} className="sr-only">{tx("searchRoutesOrPlaces_22b9d")}</label>
      <svg aria-hidden width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className="pointer-events-none absolute left-3.5 top-3.5 text-mute"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("searchRoutesOrPlaces_22b9d")} autoComplete="off"
        className="h-12 w-full rounded-2xl bg-[rgba(60,30,80,.07)] pl-11 pr-4 text-[16px] font-medium text-navy outline-none placeholder:text-mute focus:ring-2 focus:ring-ac/40" />
      {q.trim().length >= 2 && (
        <ul className="mt-2 max-h-[340px] overflow-y-auto rounded-3xl bg-white p-1.5 text-navy shadow-card">
          {hits.length === 0 && <li className="px-3.5 py-3 text-sm text-mute">{tx("noResultsFound_5d2ab")}</li>}
          {hits.map((h) => (
            <li key={h.href}><Link href={h.href} className="block rounded-2xl px-3.5 py-2.5 hover:bg-sand"><span className="block text-sm font-bold">{h.label}</span><span className="text-[11px] text-mute">{h.sub}</span></Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
