import audio from "./audio.json";
import type { NarrationLine } from "@/components/NarrationPlayer";

/** G-022: kayıtlı sesli anlatımı olan duraklar (yalnızca Türkçe). Ses dosyaları public/audio altında. */
export type Narration = { src: string; dur: number; lines: NarrationLine[] };
export const narrations = audio as unknown as Record<string, Narration>;
export const narrationFor = (placeId: string, locale: string): Narration | undefined => (locale === "tr" ? narrations[placeId] : undefined);

/** G-022: rota sonunda gösterilen değerlendirme anketi bağlantısı. */
export const surveys: Record<string, string> = {};
