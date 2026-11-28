import audio from "./audio.json";
import type { NarrationLine } from "@/components/NarrationPlayer";
export type Narration = { src: string; dur: number; lines: NarrationLine[] };
export const narrations = audio as unknown as Record<string, Narration>;
export const narrationFor = (placeId: string, locale: string): Narration | undefined => (locale === "tr" ? narrations[placeId] : undefined);
export const surveys: Record<string, string> = { "merkez-kultur-rotasi": "https://forms.gle/sj3rS998NDWRi2Lv6" };
/** Rotanın belirli bir durağında, durak anlatımından önce çalınan ek kayıt (örneğin otobüste karşılama). */
export const intros: Record<string, { at: string; key: string }> = { "merkez-kultur-rotasi": { at: "ulu-cami", key: "merkez-otobus" } };
/** Rotada bu gün gezilmeyen duraklar: sesli anlatım gösterilmez. */
export const silentStops: Record<string, string[]> = { "merkez-kultur-rotasi": ["alimoglu-muzik", "afyon-muzesi"] };
