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

export default function RouteBrowser({ lead }: { lead?: React.ReactNode }) {
  const num = useUiFormatter().number;

  const {categoryLabels, routes, scopeLabels, getPlace, locale} = useContent();

  const dx = useUiTranslations("dynamic");
  const tx = useUiTranslations("ui");

  const [q, setQ] = useState("");
  const g = useUiTranslations("g011");
  const sp = useSearchParams();
  const [cat, setCat] = useState<RouteCategory | "">((sp.get("tema") as RouteCategory | null) ?? "");
  // G-018: rotalar iki sekmede: şehir içi ve şehir dışıyla bağlantılı
  const [scope, setScope] = useState<"il-ici" | "cevre-il">(sp.get("kapsam") === "cevre-il" ? "cevre-il" : "il-ici");
  const cats = useMemo(() => [...new Set(routes.map((r) => r.category))], []);
  const filtered = useMemo(() => {
    const n = q.trim().toLocaleLowerCase("tr");
    return routes.filter((r) => (!cat || r.category === cat) && (!n ||
      `${r.title} ${r.summary} ${r.stops.map((s) => getPlace(s.placeId).name).join(" ")}`.toLocaleLowerCase("tr").includes(n)));
  }, [q, cat, routes, getPlace]);
  const groups = (q.trim() ? (["il-ici", "cevre-il"] as const) : [scope]).map((s) => ({ s, items: filtered.filter((r) => r.scope === s) })).filter((g) => g.items.length);

  return (
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-5">
      <div className="lg:sticky lg:top-24">
      {lead}
      <div className="px-5 lg:px-0">
        <div role="tablist" aria-label={tx("routes_c1ecc")} className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-[rgba(60,30,80,.07)] p-1 lg:grid-cols-1 lg:rounded-[22px]">
          {(["il-ici", "cevre-il"] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={scope === v} onClick={() => setScope(v)} className={`h-11 rounded-full px-3 text-[13.5px] font-bold leading-tight transition-colors lg:rounded-[18px] lg:px-4 lg:text-left ${scope === v ? "bg-white text-ac shadow-card" : "text-mute"}`}>{scopeLabels[v]}</button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("searchRoutesOrPlacesE_9bc2d")} aria-label={tx("searchRoutes_51ab6")} className="h-12 w-full rounded-2xl bg-[rgba(60,30,80,.07)] px-4 text-[16px] font-medium outline-none placeholder:text-mute focus:ring-2 focus:ring-ac/40" />
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0" role="group" aria-label={tx("category_b7964")}>
          {([["", tx("all_8daf7")], ...cats.map((c) => [c, categoryLabels[c]])] as [RouteCategory | "", string][]).map(([v, l]) => (
            <button key={v || "all"} type="button" aria-pressed={cat === v} onClick={() => setCat(v)} className={`flex h-[42px] shrink-0 items-center gap-2 rounded-full text-sm font-bold ${v ? "pl-[5px] pr-3.5" : "px-4"} ${cat === v ? "bg-ac text-white shadow-btn" : "bg-white text-navy shadow-card"}`}>{v && <CatBadge cat={v} size={32} radius={999} />}{l}</button>
          ))}
        </div>
      </div>
      </div>
      <div>
      {groups.length === 0 && <p className="mt-8 px-5 text-center text-sm text-mute">{tx("noRoutesMatchYourSearch_ab753")}</p>}
      {groups.map(({ s, items }) => (
        <section key={s} className="mt-6 lg:mb-8 lg:mt-0">
          <h2 className="px-5 pb-3 font-display text-lg font-semibold lg:px-0 lg:text-2xl">{scopeLabels[s]} <span className="text-sm font-medium text-mute">· {dx("routeCount", {count: items.length})}</span></h2>
          <ul className="stagger flex flex-col gap-2.5 px-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:px-0 xl:grid-cols-3">
            {items.map((r) => (
              <li key={r.slug}>
                <Link href={`/rotalar/${r.slug}`} className="flex items-center gap-3 rounded-[24px] bg-white p-2.5 shadow-card lg:h-full lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-hidden lg:p-0">
                  <PhotoSlot id={routeCover[r.slug]} label={false} small className="h-[84px] w-[84px] shrink-0 rounded-[18px] lg:h-[160px] lg:w-full lg:rounded-none" />
                  <div className="flex min-w-0 flex-col gap-1.5 lg:p-4"><CategoryChip r={r} /><span className="font-display text-[16px] leading-tight lg:text-[18px]">{r.title}</span>
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
      </div>
    </div>
  );
}
