"use client";
import Link from "next/link";
import { useId, useMemo, useState } from "react";

export type SearchItem = { href: string; label: string; sub: string };
const fold = (s: string) => s.toLocaleLowerCase("tr").replace(/[â]/g, "a").replace(/[î]/g, "i").replace(/[û]/g, "u");

export default function SearchBox({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const id = useId();
  const hits = useMemo(() => {
    const n = fold(q.trim());
    if (n.length < 2) return [];
    return items.filter((i) => fold(`${i.label} ${i.sub}`).includes(n)).slice(0, 7);
  }, [q, items]);
  return (
    <div className="relative z-20">
      <label htmlFor={id} className="sr-only">Rota veya mekân ara</label>
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rota veya mekân ara" autoComplete="off"
        className="glass h-[52px] w-full rounded-full px-5 text-[15px] text-navy outline-none placeholder:text-ink-2 focus:ring-2 focus:ring-terra/40" />
      {q.trim().length >= 2 && (
        <ul className="absolute inset-x-0 top-[58px] max-h-[300px] overflow-y-auto rounded-3xl border border-line bg-white shadow-card p-1.5 text-navy shadow-xl">
          {hits.length === 0 && <li className="px-3.5 py-3 text-sm text-mute">Sonuç bulunamadı.</li>}
          {hits.map((h) => (
            <li key={h.href}><Link href={h.href} className="block rounded-2xl px-3.5 py-2.5 hover:bg-sand"><span className="block text-sm font-bold">{h.label}</span><span className="text-[11px] text-mute">{h.sub}</span></Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
