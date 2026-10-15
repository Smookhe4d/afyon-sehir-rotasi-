import {useTranslations as useUiTranslations} from "next-intl";
import { photos } from "@/lib/photos";

type Props = { className?: string; label?: boolean; /** Tek durak */ id?: string; /** Küçük telif etiketi */ credit?: boolean };

export default function PhotoSlot({ className = "", label = true, id, credit = false }: Props) {
  const photoText = useUiTranslations("photos");
  const tx = useUiTranslations("ui");

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
      <img src={ph.src} alt={id ? photoText(id) : ph.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: ph.pos ?? "center" }} />
      {credit && <a href={ph.page} target="_blank" rel="noopener noreferrer" className="absolute bottom-9 right-3 max-w-[70%] truncate rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white">{tx("photo_98f27")} {ph.author} · {ph.license}</a>}
    </div>
  );
}
