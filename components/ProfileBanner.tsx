"use client";
import { useState } from "react";

const themes = [
  { id: "gece", label: "Gece", a: "#16264F", b: "#B0586B", sun: "#F3C9A0" },
  { id: "gunbatimi", label: "Gün batımı", a: "#C25A2B", b: "#F0B35E", sun: "#FFF1C9" },
  { id: "hashas", label: "Haşhaş", a: "#5B2A6B", b: "#D9577A", sun: "#FFD4DE" },
  { id: "zeytin", label: "Zeytin", a: "#3C4A28", b: "#A8A04C", sun: "#F4EBB4" },
  { id: "termal", label: "Termal", a: "#0F4C5C", b: "#5FB3A8", sun: "#DFF6EE" },
  { id: "mermer", label: "Mermer", a: "#4A5568", b: "#C3CAD6", sun: "#FFFFFF" },
  { id: "lokum", label: "Lokum", a: "#B2456E", b: "#F5B8C8", sun: "#FFF4F6" },
  { id: "kale", label: "Kale", a: "#4B3426", b: "#B98B62", sun: "#F6E3C8" },
] as const;

export const themeIds: string[] = themes.map((t) => t.id);

export default function ProfileBanner({ initial }: { initial: string }) {
  const [id, setId] = useState(themes.some((t) => t.id === initial) ? initial : "gece");
  const [open, setOpen] = useState(false);
  const t = themes.find((x) => x.id === id) ?? themes[0];
  const pick = (v: string) => { setId(v); try { document.cookie = `afyon-tema=${v}; path=/; max-age=31536000; samesite=lax`; } catch {} };
  return (
    <section className="relative h-44 overflow-hidden transition-colors" style={{ background: `linear-gradient(170deg, ${t.a} 0%, ${t.b} 100%)` }}>
      <div className="absolute -right-10 top-4 h-40 w-40 rounded-full opacity-70 blur-[2px]" style={{ background: `radial-gradient(circle, ${t.sun} 0%, ${t.sun}00 68%)` }} />
      <svg aria-hidden viewBox="0 0 400 90" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[92px] w-full">
        <path fill="#fff" fillOpacity=".16" d="M0 90V58l30-4 14-8 18 8 24-2 12-8 20 6 18-4 22 4 14-18 22-14 10-14 8 6 12-10 14 8 16-10 18 10 20 6 18 22 14 2V30l3-9 3 9v26l16 2 14-6 22 4 18-2 16 6V90Z" />
        <path fill="#fff" fillOpacity=".12" d="M0 90V74l24-3 12-7 16 6 22-4 18 6 28-3 14-8 18 5 30-2 20-10 20 8 26-2 18 6 24-4 20 8 20-6 30 2 20-4V90Z" />
      </svg>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="glass absolute right-4 top-4 z-10 flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-navy">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7.5" r="1" /><circle cx="14.5" cy="7.5" r="1" /></svg>
        Tema
      </button>
      {open && (
        <div className="glass absolute inset-x-4 bottom-3 z-10 rounded-2xl p-2.5">
          <ul className="flex gap-2.5 overflow-x-auto pb-0.5" role="radiogroup" aria-label="Profil teması">
            {themes.map((x) => (
              <li key={x.id} className="shrink-0 text-center">
                <button type="button" role="radio" aria-checked={x.id === id} aria-label={x.label} onClick={() => pick(x.id)} className={`h-9 w-9 rounded-full border-2 shadow-card ${x.id === id ? "border-navy ring-2 ring-white" : "border-white"}`} style={{ background: `linear-gradient(150deg, ${x.a}, ${x.b})` }} />
                <span className="mt-0.5 block text-[9.5px] font-bold text-navy">{x.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
