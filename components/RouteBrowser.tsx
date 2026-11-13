"use client";
import {useFormatter as useUiFormatter} from "next-intl";

import {useContent} from "@/i18n/useContent";
import {useTranslations as useUiTranslations} from "next-intl";

import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CatBadge from "@/components/CatBadge";
import Icon from "@/components/Icon";
import { routeTimes } from "@/lib/durations";
import { fmtDist, fmtTotal } from "@/lib/timefmt";
import PhotoSlot from "@/components/PhotoSlot";
import { routeCover } from "@/lib/covers";
import { CategoryChip } from "@/components/RouteMeta";

import type { RouteCategory } from "@/lib/types";

export default function RouteBrowser() {
  const num = useUiFormatter().number;

  const {categoryLabels, routes, scopeLabels, getPlace, locale} = useContent();

  const dx = useUiTranslations("dynamic");
  const tx = useUiTranslations("ui");

  const [q, setQ] = useState("");
  const g = useUiTranslations("g011");
  const sp = useSearchParams();
  const [cat, setCat] = useState<RouteCategory | "">((sp.get("tema") as RouteCategory | null) ?? "");
  const cats = useMemo(() => [...new Set(routes.map((r) => r.category))], []);
  const filtered = useMemo(() => {
    const n = q.trim().toLocaleLowerCase("tr");
    return routes.filter((r) => (!cat || r.category === cat) && (!n ||
      `${r.title} ${r.summary} ${r.stops.map((s) => getPlace(s.placeId).name).join(" ")}`.toLocaleLowerCase("tr").includes(n)));
  }, [q, cat, routes, getPlace]);
  const groups = (["il-ici", "cevre-il"] as const).map((s) => ({ s, items: filtered.filter((r) => r.scope === s) })).filter((g) => g.items.length);

  return (
    <>
      <div className="px-5 lg:max-w-[720px]">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("searchRoutesOrPlacesE_9bc2d")} aria-label={tx("searchRoutes_51ab6")} className="h-12 w-full rounded-2xl bg-[rgba(60,30,80,.07)] px-4 text-[16px] font-medium outline-none placeholder:text-mute focus:ring-2 focus:ring-ac/40" />
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label={tx("category_b7964")}>
          {([["", tx("all_8daf7")], ...cats.map((c) => [c, categoryLabels[c]])] as [RouteCategory | "", string][]).map(([v, l]) => (
            <button key={v || "all"} type="button" aria-pressed={cat === v} onClick={() => setCat(v)} className={`flex h-[42px] shrink-0 items-center gap-2 rounded-full text-sm font-bold ${v ? "pl-[5px] pr-3.5" : "px-4"} ${cat === v ? "bg-ac text-white shadow-btn" : "bg-white text-navy shadow-card"}`}>{v && <CatBadge cat={v} size={32} radius={999} />}{l}</button>
          ))}
        </div>
      </div>
      {groups.length === 0 && <p className="mt-8 px-5 text-center text-sm text-mute">{tx("noRoutesMatchYourSearch_ab753")}</p>}
      {groups.map(({ s, items }) => (
        <section key={s} className="mt-6">
          <h2 className="px-5 pb-3 font-display text-lg font-semibold">{scopeLabels[s]} <span className="text-sm font-medium text-mute">· {dx("routeCount", {count: items.length})}</span></h2>
          <ul className="stagger flex flex-col gap-2.5 px-5 lg:grid lg:grid-cols-3 lg:gap-4">
            {items.map((r) => (
              <li key={r.slug}>
                <Link href={`/rotalar/${r.slug}`} className="flex items-center gap-3 rounded-[24px] bg-white p-2.5 shadow-card">
                  <PhotoSlot id={routeCover[r.slug]} label={false} small className="h-[84px] w-[84px] shrink-0 rounded-[18px]" />
                  <div className="flex min-w-0 flex-col gap-1.5"><CategoryChip r={r} /><span className="font-display text-[16px] leading-tight">{r.title}</span>
                    <span className="flex flex-wrap gap-1.5 text-xs font-bold text-mute">{(() => { const m = (r.modes?.find((x) => routeTimes[r.slug]?.[x]) ?? "arac"); const t = routeTimes[r.slug]?.[m]; return <>
                      <span className="rounded-full bg-ac/[.06] px-2.5 py-1">{g("stopCount", {count: r.stops.length})}</span>
                      {t && <span className="rounded-full bg-ac/[.06] px-2.5 py-1">{fmtDist(locale, t.dist)}</span>}
                      {t && <span className="flex items-center gap-1 rounded-full bg-ac/[.06] px-2.5 py-1"><Icon name={m === "arac" ? "car" : m === "yuruyus" ? "person-simple-walk" : "bicycle"} size={13} />{fmtTotal(g, t.total)}</span>}
                    </>; })()}</span></div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
