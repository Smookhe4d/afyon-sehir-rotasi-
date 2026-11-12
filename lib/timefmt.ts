import { DAY_MIN } from "./durations";
type T = (key: string, values?: Record<string, string | number>) => string;
/** G-011: süre ve mesafe biçimleri. t, "g011" ad alanındaki çevirmendir. */
export function fmtMin(t: T, min: number) {
  min = Math.max(1, Math.round(min));
  if (min < 60) return t("min", { n: min });
  min = Math.round(min / 5) * 5;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? t("hm", { h, m }) : t("h", { h });
}
export function fmtTotal(t: T, min: number) {
  return min > DAY_MIN ? t("approx", { value: t("days", { n: Math.ceil(min / DAY_MIN) }) }) : fmtMin(t, min);
}
export function fmtDist(locale: string, m: number) {
  if (m < 950) return `${Math.round(m / 10) * 10} m`;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: m < 10000 ? 1 : 0 }).format(m / 1000)} km`;
}
