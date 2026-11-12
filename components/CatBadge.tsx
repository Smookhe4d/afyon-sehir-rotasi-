import Icon from "./Icon";
import { CAT_STYLE } from "@/lib/categories";
import type { RouteCategory } from "@/lib/types";

/** G-011: renkli köşeli kategori rozeti. */
export default function CatBadge({ cat, size = 32, radius = 11 }: { cat: RouteCategory; size?: number; radius?: number }) {
  const c = CAT_STYLE[cat];
  return <span aria-hidden className="inline-flex shrink-0 items-center justify-center text-white" style={{ width: size, height: size, borderRadius: radius, background: c.color }}><Icon name={c.icon} size={Math.round(size * 0.56)} fill /></span>;
}
