import { photos } from "@/lib/photos";

type Props = { className?: string; label?: boolean; /** Tek durak */ id?: string; /** Küçük telif etiketi */ credit?: boolean };

export default function PhotoSlot({ className = "", label = true, id, credit = false }: Props) {
  const ph = id ? photos[id] : undefined;
  if (!ph) {
    return (
      <div className={`photo-ph flex items-center justify-center ${className}`} role="img" aria-label="Fotoğraf yakında eklenecek">
        {label && <span className="text-[11px] font-semibold text-mute">Fotoğraf yakında</span>}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: ph.pos ?? "center" }} />
      {credit && <a href={ph.page} target="_blank" rel="noopener noreferrer" className="absolute bottom-9 right-3 max-w-[70%] truncate rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white">Foto: {ph.author} · {ph.license}</a>}
    </div>
  );
}
