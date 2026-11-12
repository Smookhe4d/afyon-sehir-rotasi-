import { ICONS } from "@/lib/icons";

/** G-011: Phosphor simgesi. `fill` etkin durumda dolu sürümü gösterir. */
export default function Icon({ name, size = 22, fill = false, className = "" }: { name: string; size?: number; fill?: boolean; className?: string }) {
  const d = ICONS[fill ? `${name}-fill` : name] ?? ICONS[name] ?? "";
  return <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden className={`shrink-0 ${className}`} dangerouslySetInnerHTML={{ __html: d }} />;
}
