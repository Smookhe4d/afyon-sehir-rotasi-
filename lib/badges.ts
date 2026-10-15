import tr from "@/messages/tr.json";
export type Badge = { id: string; label: string; hint: string; icon: string };
export const badgeDefs: Badge[] = [
  { id: "ilk", ...tr.badges.ilk, icon: "/art/badge-ilk.svg" },
  { id: "kale", ...tr.badges.kale, icon: "/art/badge-kale.svg" },
  { id: "frig", ...tr.badges.frig, icon: "/art/badge-frig.svg" },
  { id: "lezzet", ...tr.badges.lezzet, icon: "/art/badge-lezzet.svg" },
  { id: "termal", ...tr.badges.termal, icon: "/art/badge-termal.svg" },
  { id: "foto", ...tr.badges.foto, icon: "/art/badge-foto.svg" },
];

export function earnedBadges(input: { started: string[]; completed: string[]; hasPhotoPost: boolean }): Set<string> {
  const s = new Set<string>();
  if (input.started.length > 0) s.add("ilk");
  if (input.completed.includes("merkez-kultur-rotasi")) s.add("kale");
  if (input.completed.some((x) => x.startsWith("frig-yolu"))) s.add("frig");
  if (input.completed.includes("gastronomi-rotasi")) s.add("lezzet");
  if (input.completed.includes("termal-turizm-rotasi")) s.add("termal");
  if (input.hasPhotoPost) s.add("foto");
  return s;
}
