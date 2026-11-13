/**
 * G-014: tema illüstrasyonları (400x176). Her tema kendi göğü, ışığı ve katmanlı ön planıyla çizildi.
 * Afyonkarahisar'dan motifler: kale, Frig kaya anıtları, haşhaş tarlası, zeytin, termal havuzlar, İscehisar mermeri, lokum.
 */
const rnd = (seed: number) => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

const castle = (fill: string, op = 1) => `
  <path fill="${fill}" fill-opacity="${op}" d="M150 176 L196 118 L214 96 L232 72 L246 70 L252 58 L268 56 L280 66 L292 64 L302 50 L316 54 L330 48 L344 66 L360 80 L378 104 L400 128 V176Z"/>
  <path fill="${fill}" fill-opacity="${op}" d="M238 72V48h6v6h6v-6h6v6h6v-6h6v6h6v-6h6V72zM286 62V40h6v5h6v-5h6v5h6v-5h6V62zM322 52V36h5v4h5v-4h5v4h5v-4h5v16z"/>
  <path d="M262 48V24" stroke="${fill}" stroke-opacity="${op}" stroke-width="1.8"/><path d="M262 24l16 5-16 5z" fill="#E03A2F"/>`;

export const SCENES: Record<string, string> = {
  rotafyon: `
    <defs><linearGradient id="ra-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4B0266"/><stop offset=".55" stop-color="#9A2D6E"/><stop offset="1" stop-color="#FA9024"/></linearGradient>
    <radialGradient id="ra-sun" cx="0" cy="0" r="1" gradientTransform="translate(120 118) scale(110)"><stop offset="0" stop-color="#FFE3A3"/><stop offset=".3" stop-color="#FFC170" stop-opacity=".8"/><stop offset="1" stop-color="#FA9024" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="176" fill="url(#ra-sky)"/><rect width="400" height="176" fill="url(#ra-sun)"/>
    <circle cx="120" cy="118" r="26" fill="#FFE9B8"/>
    <path d="M0 136q60-18 120-6t110 2 170-10V176H0z" fill="#3A0A4E" fill-opacity=".45"/>
    ${castle("#2A0838", .92)}
    <path d="M0 160q40-14 90-8t100 4 210-6V176H0z" fill="#1E0629"/>
    <path d="M-10 168C60 150 130 176 200 160S330 140 410 158" fill="none" stroke="#00C8FD" stroke-width="3" stroke-dasharray="14 8" stroke-linecap="round" opacity=".85"/>
    <circle cx="14" cy="164" r="6" fill="none" stroke="#FA9024" stroke-width="3"/><circle cx="386" cy="156" r="6" fill="none" stroke="#FA9024" stroke-width="3"/>`,

  gece: (() => {
    const r = rnd(7); let stars = "";
    for (let i = 0; i < 46; i++) { const x = r() * 400, y = r() * 96, s = r() * 1.4 + .4; stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(2)}" fill="#fff" opacity="${(.4 + r() * .6).toFixed(2)}"/>`; }
    let win = ""; for (let i = 0; i < 26; i++) { const x = 10 + r() * 380, y = 140 + r() * 26; win += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="3" height="4" rx=".6" fill="#FFD27A" opacity="${(.5 + r() * .5).toFixed(2)}"/>`; }
    return `<defs><linearGradient id="gc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1433"/><stop offset=".7" stop-color="#1F2F63"/><stop offset="1" stop-color="#5B3B6E"/></linearGradient>
      <radialGradient id="gc-moon" cx="0" cy="0" r="1" gradientTransform="translate(326 40) scale(70)"><stop offset="0" stop-color="#FFF3DA" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3DA" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="176" fill="url(#gc-sky)"/>${stars}<rect width="400" height="176" fill="url(#gc-moon)"/>
      <circle cx="326" cy="40" r="17" fill="#FFF3DA"/><circle cx="333" cy="35" r="15" fill="#1A2856"/>
      ${castle("#0A1028", .95)}
      <path d="M0 176V146l18-4 10-10 16 8 22-4 14-10 20 6 18-2 20 6 30-4 20-8 22 6 26-2 18 6 24-4 20 8 20-6 30 2 32-4V176Z" fill="#070B1E"/>${win}`;
  })(),

  gunbatimi: `
    <defs><linearGradient id="gb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E2A52"/><stop offset=".5" stop-color="#E06A3A"/><stop offset="1" stop-color="#F7C46A"/></linearGradient></defs>
    <rect width="400" height="176" fill="url(#gb-sky)"/>
    <circle cx="96" cy="112" r="34" fill="#FFE2A0"/><circle cx="96" cy="112" r="56" fill="#FFE2A0" opacity=".2"/>
    <path d="M0 120h400" stroke="#FFE2A0" stroke-opacity=".25"/>
    <path fill="#8A3A2A" fill-opacity=".55" d="M0 176V128l40-6 20-16 22 10 30-4 26-12 24 8 30-6 40 4 30-10 40 6 40-4 58 8V176Z"/>
    <g fill="#4A1C1A"><path d="M180 176V112c0-8 6-12 10-26 3-10 12-10 14 0 3 14 8 18 8 26v64z"/><path d="M226 176V122c0-6 4-10 7-20 3-8 10-8 12 0 2 10 6 14 6 20v54z"/><path d="M262 176V104c0-10 8-16 11-32 2-10 13-10 15 0 3 16 10 22 10 32v72z"/>
    <circle cx="196" cy="84" r="9"/><circle cx="238" cy="100" r="7"/><circle cx="281" cy="70" r="11"/></g>
    <path d="M0 176V156q70-10 130-2t140-6 130 6V176Z" fill="#2C0F14"/>
    <path d="M300 40q6-6 12 0q6-6 12 0M330 58q5-5 10 0q5-5 10 0M40 36q5-5 10 0q5-5 10 0" stroke="#3A1420" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,

  hashas: (() => {
    const r = rnd(3); let fl = "";
    for (let i = 0; i < 34; i++) {
      const x = r() * 410 - 5, y = 120 + r() * 50, s = 4 + (y - 120) / 50 * 7;
      const c = r() > .25 ? "#E2343F" : "#F4F0F6";
      fl += `<path d="M${x.toFixed(1)} ${(y + s).toFixed(1)}q${(r() * 4 - 2).toFixed(1)} 12 0 26" stroke="#3E5A2A" stroke-width="1.4" fill="none"/>`;
      fl += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><ellipse rx="${s}" ry="${(s * .8).toFixed(1)}" fill="${c}"/><ellipse cx="${(s * .35).toFixed(1)}" cy="${(-s * .2).toFixed(1)}" rx="${(s * .6).toFixed(1)}" ry="${(s * .55).toFixed(1)}" fill="#fff" opacity=".18"/><circle r="${(s * .28).toFixed(1)}" fill="#2A1030"/></g>`;
    }
    return `<defs><linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8C4FA8"/><stop offset=".6" stop-color="#E7A0B8"/><stop offset="1" stop-color="#F6D4C8"/></linearGradient></defs>
      <rect width="400" height="176" fill="url(#hs-sky)"/><circle cx="320" cy="46" r="20" fill="#FFF0E0" opacity=".9"/>
      <path d="M0 112q80-26 170-10t230-8V176H0z" fill="#9A6FA8" opacity=".55"/>
      <path d="M0 126q90-18 200-4t200-6V176H0z" fill="#5E7A3C"/>
      <path d="M0 140q100-12 200 0t200-4V176H0z" fill="#4C6A30"/>${fl}`;
  })(),

  zeytin: `
    <defs><linearGradient id="zt-sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9E3B8"/><stop offset="1" stop-color="#B9B26A"/></linearGradient></defs>
    <rect width="400" height="176" fill="url(#zt-sky)"/><circle cx="70" cy="50" r="38" fill="#FFF8D8" opacity=".7"/>
    <path d="M-10 46C80 40 160 70 230 110S350 150 420 140" stroke="#5B4A2A" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M140 70C170 40 210 34 250 30" stroke="#5B4A2A" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${[[30,40,-20],[62,52,25],[96,44,-30],[120,66,30],[150,56,-35],[176,82,28],[204,70,-24],[232,100,22],[262,90,-28],[292,118,24],[320,108,-30],[350,132,22],[378,124,-24],[176,46,-40],[206,38,30],[236,30,-20]].map(([x,y,a]) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="17" ry="5" fill="#4E6B34"/><path d="M${x-15} ${y}h30" stroke="#A6BE7A" stroke-width=".8" opacity=".7"/></g>`).join("")}
    ${[[84,60],[140,82],[196,96],[248,116],[306,132],[214,48]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="9" fill="#2E3A1A"/><ellipse cx="${x-2}" cy="${y-3}" rx="2" ry="3" fill="#fff" opacity=".35"/>`).join("")}
    ${[[110,72],[170,104],[278,124]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="9" fill="#6E7A2E"/>`).join("")}`,

  termal: `
    <defs><linearGradient id="tm-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F4C5C"/><stop offset="1" stop-color="#5FB3A8"/></linearGradient>
    <linearGradient id="tm-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9EE6F0"/><stop offset="1" stop-color="#2BB3C8"/></linearGradient></defs>
    <rect width="400" height="176" fill="url(#tm-sky)"/>
    ${[60, 150, 240, 330].map((x, i) => `<path d="M${x} 104c-12-12 12-22 0-34s12-20 0-32" stroke="#fff" stroke-opacity="${.45 - i * .06}" stroke-width="7" fill="none" stroke-linecap="round" filter="url(#tm-b)"/>`).join("")}
    <filter id="tm-b"><feGaussianBlur stdDeviation="2.2"/></filter>
    <path d="M0 112h120l10 10h-130z" fill="#F2EEE6"/><path d="M0 112h120" stroke="#fff" stroke-width="2"/>
    <rect x="0" y="114" width="120" height="8" fill="url(#tm-water)"/>
    <path d="M110 132h150l12 12H98z" fill="#F2EEE6"/><rect x="112" y="134" width="150" height="8" fill="url(#tm-water)"/>
    <path d="M240 150h160v26H228z" fill="#F2EEE6"/><rect x="244" y="152" width="156" height="10" fill="url(#tm-water)"/>
    <path d="M0 122h130v54H0z" fill="#D8D2C6"/><path d="M98 144h174v32H98z" fill="#CFC8BA"/>
    ${[[30,118],[70,117],[150,138],[200,137],[300,156],[350,157]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="1.6" fill="#fff" opacity=".7"/>`).join("")}`,

  mermer: `
    <defs><linearGradient id="mr-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF0F4"/><stop offset="1" stop-color="#B9C1CE"/></linearGradient>
    <linearGradient id="mr-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E4E7EC"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9CFD8"/></linearGradient></defs>
    <rect width="400" height="176" fill="url(#mr-bg)"/>
    <path d="M-5 30C70 10 120 70 210 52S330 0 410 28" stroke="#8C95A6" stroke-opacity=".5" stroke-width="1.4" fill="none"/>
    <path d="M-5 92C60 70 140 116 230 98S340 60 410 82" stroke="#8C95A6" stroke-opacity=".4" stroke-width="1" fill="none"/>
    <path d="M90 -5C110 40 80 80 120 120S140 170 130 180" stroke="#A0A8B6" stroke-opacity=".45" stroke-width="1" fill="none"/>
    <path d="M232 30h168v14H232z" fill="#F7F8FA"/><path d="M226 44h174v8H226z" fill="#D7DCE3"/>
    ${[256, 300, 344, 388].map((x) => `<rect x="${x - 13}" y="52" width="26" height="110" fill="url(#mr-col)"/>${[ -7, 0, 7 ].map((d) => `<path d="M${x + d} 54v106" stroke="#B8BFCA" stroke-width="1"/>`).join("")}<rect x="${x - 17}" y="52" width="34" height="7" rx="2" fill="#E9ECF1"/><rect x="${x - 17}" y="158" width="34" height="8" fill="#D2D7DF"/>`).join("")}
    <path d="M0 166h400v10H0z" fill="#A9B1BF"/>
    <path d="M20 150l30-18 34 6 14 24H16z" fill="#F4F5F8"/><path d="M50 132l34 6-6 24" fill="#D9DDE4"/><path d="M110 156l20-12 26 4 6 14h-56z" fill="#E7EAEF"/>`,

  lokum: (() => {
    const cube = (x: number, y: number, s: number, c: string, rot: number) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - s}" y="${y - s}" width="${2 * s}" height="${2 * s}" rx="${s * .35}" fill="${c}"/><rect x="${x - s}" y="${y - s}" width="${2 * s}" height="${s * .6}" rx="${s * .3}" fill="#fff" opacity=".35"/>${[[-.4,-.3],[.3,-.5],[-.1,.2],[.5,.4],[-.5,.5],[.1,-.1]].map(([a,b]) => `<circle cx="${x + a * s}" cy="${y + b * s}" r="${s * .07}" fill="#fff" opacity=".95"/>`).join("")}</g>`;
    return `<defs><linearGradient id="lk-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F9D7E1"/><stop offset="1" stop-color="#D86A90"/></linearGradient></defs>
      <rect width="400" height="176" fill="url(#lk-bg)"/>
      <ellipse cx="210" cy="160" rx="200" ry="26" fill="#fff" opacity=".55"/><ellipse cx="210" cy="156" rx="186" ry="20" fill="#F4E9EE"/>
      ${cube(110, 130, 20, "#E85A84", -10)}${cube(160, 140, 18, "#F6B8C8", 8)}${cube(206, 124, 22, "#C93D6A", -4)}${cube(254, 140, 18, "#FFFFFF", 12)}${cube(300, 128, 21, "#E85A84", -12)}${cube(132, 102, 16, "#FFF2F6", 18)}${cube(276, 100, 15, "#F6B8C8", -16)}
      ${[[50,50,13],[350,40,11],[80,96,8],[380,92,9]].map(([x,y,r]) => [0,72,144,216,288].map((a) => `<ellipse cx="${x}" cy="${y - r * .55}" rx="${r * .5}" ry="${r * .62}" transform="rotate(${a} ${x} ${y})" fill="#B2456E" opacity=".75"/>`).join("") + `<circle cx="${x}" cy="${y}" r="${r * .3}" fill="#7A1F44"/>`).join("")}`;
  })(),

  kale: `
    <defs><linearGradient id="kl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6E0"/><stop offset="1" stop-color="#F3E3C6"/></linearGradient></defs>
    <rect width="400" height="176" fill="url(#kl-sky)"/>
    <ellipse cx="90" cy="40" rx="44" ry="10" fill="#fff" opacity=".8"/><ellipse cx="120" cy="34" rx="26" ry="9" fill="#fff" opacity=".9"/><ellipse cx="330" cy="26" rx="34" ry="7" fill="#fff" opacity=".7"/>
    <path d="M0 150q60-22 130-10t120-4V176H0z" fill="#B98B62" opacity=".6"/>
    ${castle("#6B4A36")}
    <path d="M196 118l20-22 18-24h12l6-12 16-2 12 10M300 50l14 4 14-6 16 18 16 14 18 24 22 24" stroke="#8C6648" stroke-width="2" fill="none" opacity=".7"/>
    <path d="M0 176V156q40-8 80-2t90-4 70 8 160-6V176Z" fill="#4B3426"/>
    ${[[30,150],[64,146],[98,152],[132,148]].map(([x,y]) => `<path d="M${x - 9} ${y}h18v12h-18z" fill="#F3E6D0"/><path d="M${x - 11} ${y}l11-8 11 8z" fill="#B5492F"/>`).join("")}`,
};

export default function ThemeScene({ id }: { id: string }) {
  return <g dangerouslySetInnerHTML={{ __html: SCENES[id] ?? SCENES.rotafyon }} />;
}
