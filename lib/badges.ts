export type Badge = { id: string; label: string; hint: string; icon: string };
export const badgeDefs: Badge[] = [
  { id: "ilk", label: "İlk adım", hint: "Bir rota başlat", icon: "/art/badge-ilk.svg" },
  { id: "kale", label: "Kale", hint: "Merkez Kültür Rotası'nı tamamla", icon: "/art/badge-kale.svg" },
  { id: "frig", label: "Frig", hint: "Bir Frig rotasını tamamla", icon: "/art/badge-frig.svg" },
  { id: "lezzet", label: "Lezzet", hint: "Gastronomi Rotası'nı tamamla", icon: "/art/badge-lezzet.svg" },
  { id: "termal", label: "Termal", hint: "Termal Turizm Rotası'nı tamamla", icon: "/art/badge-termal.svg" },
  { id: "foto", label: "Fotoğraf", hint: "Fotoğraflı bir paylaşım yap", icon: "/art/badge-foto.svg" },
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
