import type { RouteCategory } from "./types";
/** G-011: tema (kategori) renkleri ve simgeleri. Haritadaki noktalar ve kategori rozetleri bunları kullanır. */
export const CAT_STYLE: Record<RouteCategory, { color: string; icon: string }> = {
  kultur: { color: "#60117B", icon: "bank" },
  frig: { color: "#E8820F", icon: "mountains" },
  termal: { color: "#0096C7", icon: "drop" },
  "savas-alanlari": { color: "#C9442C", icon: "flag" },
  gastronomi: { color: "#D63F6E", icon: "fork-knife" },
  doga: { color: "#2E9152", icon: "tree" },
  inanc: { color: "#7B4FC9", icon: "mosque" },
  "han-kervansaray": { color: "#A6721F", icon: "warehouse" },
};
export const CAT_ORDER: RouteCategory[] = ["kultur", "frig", "termal", "savas-alanlari", "gastronomi", "doga", "inanc", "han-kervansaray"];
