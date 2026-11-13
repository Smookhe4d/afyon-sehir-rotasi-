import Icon from "@/components/Icon";
import { avatarById } from "@/lib/avatars";

/** G-015: profil görseli. Yüklenen fotoğraf, hazır avatar ya da adın baş harfi. */
export default function Avatar({ value, name = "", size = 64, className = "" }: { value?: string | null; name?: string; size?: number; className?: string }) {
  const box = { width: size, height: size };
  if (value?.startsWith("https://"))
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={value} alt="" width={size} height={size} style={box} className={`shrink-0 rounded-full object-cover ${className}`} />;
  const a = avatarById(value);
  if (a) return <span aria-hidden style={{ ...box, background: `linear-gradient(140deg, ${a.a}, ${a.b})` }} className={`flex shrink-0 items-center justify-center rounded-full text-white ${className}`}><Icon name={a.icon} size={Math.round(size * 0.5)} fill /></span>;
  const ch = name.trim().charAt(0).toLocaleUpperCase("tr");
  return <span aria-hidden style={box} className={`flex shrink-0 items-center justify-center rounded-full bg-ac font-display text-white ${className}`}>{ch ? <span style={{ fontSize: size * 0.42 }}>{ch}</span> : <Icon name="user-circle" size={Math.round(size * 0.6)} fill />}</span>;
}
