import { getTranslations } from "next-intl/server";
import Icon from "@/components/Icon";
import { routeTimes, VISIT_MIN } from "@/lib/durations";
import { MUST_SEE } from "@/lib/mustsee";
import { POIS, type Poi } from "@/lib/pois";
import { fmtDist } from "@/lib/timefmt";
import type { Place, Route } from "@/lib/types";

/** G-015: durak sayfası için "Mutlaka gör", "Gitmeden önce bilmen gerekenler", trafik uyarısı ve çevredeki yerler.
 *  Hepsi mevcut verilerden türetilir: tanıtım metni, rota modları, OSRM yol mesafesi ve OpenStreetMap kayıtları. */
export default async function StopGuide({ place, routes, locale }: { place: Place; routes: Route[]; locale: string }) {
  const t = await getTranslations({ locale, namespace: "g015" });
  const ms = MUST_SEE[place.id]?.[locale === "en" ? "en" : "tr"] ?? [];
  const modes = new Set(routes.flatMap((r) => r.modes ?? []));
  const road = modes.has("arac") || modes.has("bisiklet");
  let snap = 0;
  for (const r of routes) for (const m of Object.values(routeTimes[r.slug] ?? {})) snap = Math.max(snap, m?.snap?.[place.id] ?? 0);
  const pois = POIS[place.id] ?? [];
  const wc = pois.find((p) => p.k === "wc");
  const food = pois.filter((p) => p.k === "food").slice(0, 6);
  const mosque = pois.filter((p) => p.k === "mosque").slice(0, 4);
  const visit = VISIT_MIN[place.kind];

  const tips: { icon: string; text: string }[] = [];
  if (visit) tips.push({ icon: "clock", text: t("visitTime", { min: visit }) });
  if (snap > 60) tips.push({ icon: "footprints", text: t("offroad", { dist: fmtDist(locale, snap) }) });
  if (place.coords && place.precision !== "exact") tips.push({ icon: "map-pin", text: t("approx") });
  const kindTip = ({ cami: "kindCami", turbe: "kindCami", muze: "kindMuze", hamam: "kindMuze", han: "kindMuze", doga: "kindDoga", kale: "kindDoga", "oren-yeri": "kindDoga", termal: "kindTermal" } as Record<string, string>)[place.kind];
  if (kindTip) tips.push({ icon: "info", text: t(kindTip) });
  for (const v of place.visitTips ?? []) tips.push({ icon: "check", text: v });
  if (place.coords) tips.push({ icon: "toilet", text: wc ? t("wcNear", { dist: fmtDist(locale, wc.d) }) : t("wcNone") });

  const Row = ({ p }: { p: Poi }) => (
    <li><a href={`https://www.openstreetmap.org/${p.osm}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5">
      <span className="min-w-0 flex-1"><b className="block truncate text-sm font-bold text-navy">{p.n || t(p.k === "mosque" ? "unnamedMosque" : "unnamedFood")}</b>{p.k === "food" && <span className="block truncate text-[11.5px] text-mute">{t(`t_${p.t}`)}{p.cu ? ` · ${p.cu.split(";")[0].replace(/_/g, " ")}` : ""}</span>}</span>
      <span className="shrink-0 text-[12px] font-semibold text-mute">{fmtDist(locale, p.d)}</span>
    </a></li>
  );

  return (
    <>
      {ms.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Icon name="star" size={20} fill className="text-ac2" />{t("mustSee")}</h2>
          <ul className="mt-2.5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-card">{ms.map((m) => <li key={m} className="flex items-start gap-3 px-4 py-3 text-[14px] font-semibold leading-snug text-navy"><Icon name="eye" size={19} className="mt-px text-ac" />{m}</li>)}</ul>
        </section>
      )}

      {road && (
        <aside role="note" className="mt-5 flex items-start gap-3 rounded-2xl border border-[#F2C46B] bg-[#FFF6E0] px-4 py-3 text-[13.5px] leading-snug text-[#5A3B00]">
          <span className="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FA9024] text-white"><Icon name="warning" size={18} fill /></span>
          <span><b className="block font-bold">{t("trafficTitle")}</b>{t("trafficText")}</span>
        </aside>
      )}

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">{t("before")}</h2>
        <ul className="mt-2.5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          {tips.map((x, i) => <li key={i} className="flex items-start gap-3 px-4 py-3 text-[14px] leading-snug text-ink-2"><Icon name={x.icon} size={19} className="mt-px text-ac" />{x.text}</li>)}
        </ul>
      </section>

      {(food.length > 0 || mosque.length > 0) && (
        <section className="mt-6">
          <h2 className="font-display text-xl font-semibold">{t("nearby")}</h2>
          {food.length > 0 && <><h3 className="mt-3 flex items-center gap-2 text-[13px] font-bold text-mute"><Icon name="fork-knife" size={16} />{t("food")}</h3>
            <ul className="mt-1.5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-card">{food.map((p) => <Row key={p.osm} p={p} />)}</ul></>}
          {mosque.length > 0 && <><h3 className="mt-4 flex items-center gap-2 text-[13px] font-bold text-mute"><Icon name="mosque" size={16} />{t("mosques")}</h3>
            <ul className="mt-1.5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-card">{mosque.map((p) => <Row key={p.osm} p={p} />)}</ul></>}
          <p className="mt-2 text-[11.5px] text-mute">{t("osmNote")}</p>
        </section>
      )}
    </>
  );
}
