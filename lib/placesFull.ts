import { placeList } from "./places";
import { placeExtra } from "./placeExtra";
import type { Place } from "./types";

/** Temel durak kaydı + araştırılmış içerik/koordinat (placeExtra). */
export const placeListFull: Place[] = placeList.map((p) => ({ ...p, ...placeExtra[p.id] }));
export const placesFull: Record<string, Place> = Object.fromEntries(placeListFull.map((p) => [p.id, p]));
