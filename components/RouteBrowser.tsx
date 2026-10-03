"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import PhotoSlot from "@/components/PhotoSlot";
import { CategoryChip, routeMetaLine } from "@/components/RouteMeta";
import { categoryLabels, routes, scopeLabels } from "@/lib/routes";
import { getPlace } from "@/lib/places";
import type { RouteCategory } from "@/lib/types";

export default function RouteBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<RouteCategory | "">("");
  const cats = useMemo(() => [...new Set(routes.map((r) => r.category))], []);
  const filtered = useMemo(() => {
    const n = q.trim().toLocaleLowerCase("tr");
    return routes.filter((r) => (!cat || r.category === cat) && (!n ||
      `${r.title} ${r.summary} ${r.stops.map((s) => getPlace(s.placeId).name).join(" ")}`.toLocaleLowerCase("tr").includes(n)));
  }, [q, cat]);
  const groups = (["il-ici", "cevre-il"] as const).map((s) => ({ s, items: filtered.filter((r) => r.scope === s) })).filter((g) => g.items.length);

  return (
    <>
      <div className="px-5">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rota veya mekân ara (ör. Ulu Cami)" aria-label="Rota ara" className="h-12 w-full rounded-full border border-line bg-white px-5 text-[15px] outline-none focus:border-terra" />
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Kategori">
          {([["", "Tümü"], ...cats.map((c) => [c, categoryLabels[c]])] as [RouteCategory | "", string][]).map(([v, l]) => (
            <button key={v || "all"} type="button" aria-pressed={cat === v} onClick={() => setCat(v)} className={`h-10 shrink-0 rounded-full border px-4 text-[13px] font-semibold ${cat === v ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{l}</button>
          ))}
        </div>
      </div>
      {groups.length === 0 && <p className="mt-8 px-5 text-center text-sm text-mute">Aramanızla eşleşen rota bulunamadı.</p>}
      {groups.map(({ s, items }) => (
        <section key={s} className="mt-6">
          <h2 className="px-5 pb-3 font-display text-lg font-semibold">{scopeLabels[s]} <span className="text-sm font-medium text-mute">· {items.length} rota</span></h2>
          <ul className="flex flex-col gap-2.5 px-5">
            {items.map((r) => (
              <li key={r.slug}>
                <Link href={`/rotalar/${r.slug}`} className="flex gap-3 rounded-3xl border border-line bg-white p-2.5 shadow-sm">
                  <PhotoSlot ids={r.stops.map((s) => s.placeId)} label={false} className="h-[88px] w-[88px] shrink-0 rounded-2xl" />
                  <div className="flex min-w-0 flex-col gap-1"><CategoryChip r={r} /><span className="font-display text-[16px] font-semibold leading-tight">{r.title}</span><span className="mt-auto text-xs font-semibold text-mute">{routeMetaLine(r)}</span></div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
