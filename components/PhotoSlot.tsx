export default function PhotoSlot({ className = "", label = true }: { className?: string; label?: boolean }) {
  return (
    <div className={`photo-ph flex items-center justify-center ${className}`} role="img" aria-label="Fotoğraf alanı">
      {label && <span className="text-[11px] font-semibold text-mute">Fotoğraf</span>}
    </div>
  );
}
