import {useTranslations as useUiTranslations} from "next-intl";
import { photos } from "@/lib/photos";

type Props = { className?: string; label?: boolean; /** Tek durak */ id?: string; /** Küçük telif etiketi */ credit?: boolean; /** Sayfa geçişinde ortak görsel adı (G-014) */ vt?: string; eager?: boolean; /** G-016: küçük görsel (kart, liste) */ small?: boolean };

export default function PhotoSlot({ className = "", label = true, id, credit = false, vt, eager, small = false }: Props) {
  const photoText = useUiTranslations("photos");
  const tx = useUiTranslations("ui");
  const g15 = useUiTranslations("g015");

  const ph = id ? photos[id] : undefined;
  if (!ph) {
    return (
      <div className={`photo-ph flex items-center justify-center ${className}`} role="img" aria-label={tx("aPhotoWillBeAdded_1bced")}>
        {label && <span className="text-[11px] font-semibold text-mute">{tx("photoComingSoon_e7f34")}</span>}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={small && id ? `/photos/t/${id}.webp` : ph.src} alt={id ? photoText(id) : ph.alt} loading={eager ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: ph.pos ?? "center", viewTransitionName: vt }} />
      {ph.rep && label && <span className="absolute right-2.5 top-[max(0.625rem,env(safe-area-inset-top))] rounded-full bg-black/50 px-2 py-0.5 text-[10.5px] font-semibold text-white backdrop-blur-sm">{g15("rep")}</span>}
      {credit && <a href={ph.page} target="_blank" rel="noopener noreferrer" className="absolute bottom-9 right-3 max-w-[70%] truncate rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white">{tx("photo_98f27")} {ph.author} · {ph.license}</a>}
    </div>
  );
}
