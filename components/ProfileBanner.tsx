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


const W = "#fff";
const poppy = (x: number, y: number, r: number, k: string) => (
  <g key={k}>
    <path d={`M${x} ${y} q${-r * 0.2} ${r * 3} ${r * 0.3} ${r * 5}`} stroke={W} strokeOpacity=".4" strokeWidth="1.6" fill="none" />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <circle key={i} cx={x + a * r * 0.55} cy={y + b * r * 0.5} r={r * 0.62} fill={W} fillOpacity=".55" />)}
    <circle cx={x} cy={y} r={r * 0.3} fill="#2a1030" fillOpacity=".7" />
  </g>
);
const pod = (x: number, y: number, k: string) => (
  <g key={k}><path d={`M${x} ${y + 40} V${y + 8}`} stroke={W} strokeOpacity=".4" strokeWidth="1.6" /><ellipse cx={x} cy={y} rx="6.5" ry="8" fill={W} fillOpacity=".45" /><path d={`M${x - 5} ${y - 7}h10l-5 -4z`} fill={W} fillOpacity=".6" /></g>
);
const leaf = (x: number, y: number, rot: number, k: string) => <ellipse key={k} cx={x} cy={y} rx="13" ry="4.4" transform={`rotate(${rot} ${x} ${y})`} fill={W} fillOpacity=".38" />;
const olive = (x: number, y: number, k: string) => <ellipse key={k} cx={x} cy={y} rx="5" ry="6.4" fill="#1f2a12" fillOpacity=".55" />;
const star = (x: number, y: number, r: number, k: string) => <circle key={k} cx={x} cy={y} r={r} fill={W} fillOpacity=".8" />;
const bird = (x: number, y: number, k: string) => <path key={k} d={`M${x} ${y}q5 -6 10 0q5 -6 10 0`} stroke={W} strokeOpacity=".7" strokeWidth="1.6" fill="none" strokeLinecap="round" />;
const cube = (x: number, y: number, r: number, k: string) => (
  <g key={k} transform={`rotate(${r} ${x} ${y})`}><rect x={x - 17} y={y - 17} width="34" height="34" rx="8" fill={W} fillOpacity=".5" />{[[-8, -7], [5, -9], [-3, 4], [8, 7], [-9, 9]].map(([a, b], i) => <circle key={i} cx={x + a} cy={y + b} r="1.4" fill={W} fillOpacity=".95" />)}</g>
);
const rose = (x: number, y: number, r: number, k: string) => (
  <g key={k}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - r * 0.55} rx={r * 0.5} ry={r * 0.6} transform={`rotate(${a} ${x} ${y})`} fill={W} fillOpacity=".4" />)}<circle cx={x} cy={y} r={r * 0.28} fill={W} fillOpacity=".7" /></g>
);

function Scene({ id }: { id: string }) {
  const hills = (o1: number, o2: number) => (<><path fill={W} fillOpacity={o1} d="M0 176V132q60-26 120-8t120-6 160 14V176Z" /><path fill={W} fillOpacity={o2} d="M0 176V150q80-18 160-4t240-6V176Z" /></>);
  switch (id) {
    case "gunbatimi": return (<>
      <circle cx="270" cy="124" r="52" fill="#FFF1C9" fillOpacity=".9" /><circle cx="270" cy="124" r="84" fill="#FFF1C9" fillOpacity=".18" />
      {bird(60, 40, "b1")}{bird(100, 62, "b2")}{bird(310, 38, "b3")}
      <path fill="#6b2a10" fillOpacity=".5" d="M0 176V140l40-6 16-10 22 8 30-3 18-12 26 6 20-6 24 6 14-24 24-16 12-16 10 8 12-10 14 10 16-12 20 12 24 8 20 26 18 2v-30l3-10 3 10v30l20 2 14-8 22 6V176Z" />
      <path fill="#6b2a10" fillOpacity=".7" d="M0 176V156l30-4 16-8 20 6 28-2 18 6 30-6 30 4 40-6 40 6 30-4 40 6 38-2V176Z" /></>);
    case "hashas": return (<>
      <circle cx="320" cy="44" r="26" fill="#FFD4DE" fillOpacity=".5" />{hills(0.12, 0.2)}
      {[[30, 112, 11], [78, 128, 9], [128, 106, 13], [176, 124, 10], [226, 112, 12], [272, 130, 9], [318, 108, 13], [366, 124, 10]].map(([x, y, r], i) => poppy(x, y, r, "p" + i))}
      {pod(54, 110, "d1")}{pod(150, 100, "d2")}{pod(248, 106, "d3")}{pod(344, 98, "d4")}</>);
    case "zeytin": return (<>
      <circle cx="60" cy="48" r="30" fill="#F4EBB4" fillOpacity=".4" />
      <path d="M-5 30Q90 40 190 96T410 70" stroke="#2b3318" strokeOpacity=".5" strokeWidth="3" fill="none" />
      <path d="M-5 150Q110 110 230 130T410 100" stroke="#2b3318" strokeOpacity=".5" strokeWidth="3" fill="none" />
      {[[40, 34, 20], [80, 40, -16], [120, 62, 24], [160, 80, -14], [200, 96, 22], [250, 104, -18], [300, 84, 24], [350, 74, -16]].map(([x, y, r], i) => leaf(x, y, r, "l" + i))}
      {[[60, 50], [140, 74], [228, 112], [330, 92]].map(([x, y], i) => olive(x, y, "o" + i))}
      {[[50, 142, 14], [100, 124, -18], [150, 120, 20], [210, 134, -12], [270, 126, 22], [330, 112, -16]].map(([x, y, r], i) => leaf(x, y, r, "m" + i))}
      {[[90, 134], [180, 128], [300, 120]].map(([x, y], i) => olive(x, y, "q" + i))}</>);
    case "termal": return (<>
      {[70, 150, 240, 320].map((x, i) => <path key={i} d={`M${x} 118c-14-14 14-26 0-40s14-24 0-38`} stroke={W} strokeOpacity={0.45 - i * 0.05} strokeWidth="5" fill="none" strokeLinecap="round" />)}
      {[[40, 60, 4], [104, 38, 3], [190, 56, 5], [290, 50, 3], [372, 70, 4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={W} fillOpacity=".35" />)}
      <path fill={W} fillOpacity=".18" d="M0 176V120q50-14 100 0t100 0 100 0 100 0V176Z" /><path fill={W} fillOpacity=".24" d="M0 176V140q50-14 100 0t100 0 100 0 100 0V176Z" /><path fill={W} fillOpacity=".3" d="M0 176V158q50-12 100 0t100 0 100 0 100 0V176Z" /></>);
    case "mermer": return (<>
      <path d="M-5 40C80 20 120 90 210 70S330 10 410 40" stroke={W} strokeOpacity=".5" strokeWidth="1.6" fill="none" />
      <path d="M-5 110C60 90 130 140 220 120S340 80 410 100" stroke={W} strokeOpacity=".4" strokeWidth="1.2" fill="none" />
      <path d="M120 -5C140 40 110 80 150 130S170 170 160 180" stroke={W} strokeOpacity=".35" strokeWidth="1.2" fill="none" />
      {[288, 330, 372].map((x) => (<g key={x}><rect x={x - 9} y="62" width="18" height="114" fill={W} fillOpacity=".3" /><rect x={x - 13} y="54" width="26" height="9" rx="2" fill={W} fillOpacity=".45" /><rect x={x - 12} y="166" width="24" height="10" fill={W} fillOpacity=".45" /></g>))}
      <rect x="270" y="44" width="120" height="10" rx="2" fill={W} fillOpacity=".5" /></>);
    case "lokum": return (<>
      {cube(70, 104, -12, "c1")}{cube(128, 134, 10, "c2")}{cube(300, 96, 14, "c3")}{cube(352, 134, -8, "c4")}{cube(214, 122, 4, "c5")}
      {rose(40, 50, 14, "r1")}{rose(186, 44, 11, "r2")}{rose(250, 70, 15, "r3")}{rose(350, 42, 12, "r4")}
      {[[100, 40], [160, 84], [320, 66], [390, 90], [20, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill={W} fillOpacity=".8" />)}</>);
    case "kale": return (<>
      <circle cx="80" cy="46" r="22" fill="#F6E3C8" fillOpacity=".5" />
      <ellipse cx="320" cy="40" rx="40" ry="9" fill={W} fillOpacity=".22" /><ellipse cx="230" cy="62" rx="28" ry="6" fill={W} fillOpacity=".18" />
      <path fill="#2b1a10" fillOpacity=".55" d="M120 176L170 110 190 84 214 60h10l6-10 14-2 10 8h8l8-14 12 4 14-6 12 16 20 14 18 20 26 24 14 22 18 8V176Z" />
      <path fill="#2b1a10" fillOpacity=".7" d="M214 62V38h6v6h6v-6h6v6h6v-6h6v6h6v-6h6V62zM262 62V40h6v5h6v-5h6v5h6v-5h6V62z" />
      <path d="M244 38V16" stroke="#2b1a10" strokeOpacity=".7" strokeWidth="1.6" /><path d="M244 16l16 5-16 5z" fill="#E03A2F" />
      <path fill="#2b1a10" fillOpacity=".75" d="M0 176V150l30-5 10-10 20 8 26-3 14-10 22 6 18 2V176Z" /></>);
    default: return (<>
      {[[40, 24, 1.6], [90, 54, 1.2], [140, 20, 1.8], [196, 44, 1.2], [250, 18, 1.6], [300, 58, 1.2], [350, 28, 1.8], [380, 66, 1.2], [20, 80, 1.2], [120, 84, 1.4]].map(([x, y, r], i) => star(x, y, r, "s" + i))}
      <path d="M298 30a22 22 0 1 0 14 38a17 17 0 1 1 -14 -38z" fill="#FFF3DA" fillOpacity=".92" />
      <path fill={W} fillOpacity=".16" d="M0 176V140l30-4 14-8 18 8 24-2 12-8 20 6 18-4 22 4 14-18 22-14 10-14 8 6 12-10 14 8 16-10 18 10 20 6 18 22 14 2v-26l3-9 3 9v26l16 2 14-6 22 4 18-2 16 6V176Z" />
      <path fill={W} fillOpacity=".12" d="M0 176V152l24-3 12-7 16 6 22-4 18 6 28-3 14-8 18 5 30-2 20-10 20 8 26-2 18 6 24-4 20 8 20-6 30 2 20-4V176Z" /></>);
  }
}

export const themeIds: string[] = themes.map((t) => t.id);

export default function ProfileBanner({ initial }: { initial: string }) {
  const [id, setId] = useState(themes.some((t) => t.id === initial) ? initial : "gece");
  const [open, setOpen] = useState(false);
  const t = themes.find((x) => x.id === id) ?? themes[0];
  const pick = (v: string) => { setId(v); try { document.cookie = `afyon-tema=${v}; path=/; max-age=31536000; samesite=lax`; } catch {} };
  return (
    <section className="relative h-44 overflow-hidden transition-colors" style={{ background: `linear-gradient(170deg, ${t.a} 0%, ${t.b} 100%)` }}>
      <svg aria-hidden viewBox="0 0 400 176" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full"><Scene id={t.id} /></svg>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`glass absolute right-4 top-4 z-10 flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-navy ${open ? "pointer-events-none opacity-0" : ""}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7.5" r="1" /><circle cx="14.5" cy="7.5" r="1" /></svg>
        Tema
      </button>
      {open && (
        <div className="glass absolute inset-x-3 top-3 z-10 flex items-center gap-1 rounded-2xl py-2 pl-3 pr-2">
          <ul className="flex min-w-0 flex-1 gap-3 overflow-x-auto px-1 pb-0.5" role="radiogroup" aria-label="Profil teması">
            {themes.map((x) => (
              <li key={x.id} className="shrink-0 text-center">
                <button type="button" role="radio" aria-checked={x.id === id} aria-label={x.label} onClick={() => pick(x.id)} className={`h-9 w-9 rounded-full border-2 shadow-card ${x.id === id ? "border-navy ring-2 ring-white" : "border-white"}`} style={{ background: `linear-gradient(150deg, ${x.a}, ${x.b})` }} />
                <span className="mt-0.5 block text-[9.5px] font-bold text-navy">{x.label}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setOpen(false)} aria-label="Kapat" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-lg font-bold leading-none text-navy">×</button>
        </div>
      )}
    </section>
  );
}
