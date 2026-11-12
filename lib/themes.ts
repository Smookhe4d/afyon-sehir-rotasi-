/** G-011: Uygulama temaları. Seçilen temanın rengi butonlara ve vurgulara uygulanır. */
export type Theme = { id: string; a: string; b: string; ac2: string };
export const THEMES: Theme[] = [
  { id: "rotafyon", a: "#60117B", b: "#FA9024", ac2: "#FA9024" },
  { id: "gece", a: "#16264F", b: "#B0586B", ac2: "#B0586B" },
  { id: "gunbatimi", a: "#C25A2B", b: "#F0B35E", ac2: "#F0B35E" },
  { id: "hashas", a: "#5B2A6B", b: "#D9577A", ac2: "#D9577A" },
  { id: "zeytin", a: "#3C4A28", b: "#A8A04C", ac2: "#A8A04C" },
  { id: "termal", a: "#0F4C5C", b: "#5FB3A8", ac2: "#5FB3A8" },
  { id: "mermer", a: "#4A5568", b: "#C3CAD6", ac2: "#C3CAD6" },
  { id: "lokum", a: "#B2456E", b: "#F5B8C8", ac2: "#F5B8C8" },
  { id: "kale", a: "#4B3426", b: "#B98B62", ac2: "#B98B62" },
];
export const DEFAULT_THEME = "rotafyon";
export const THEME_COOKIE = "afyon-tema";
export const themeById = (id?: string | null) => THEMES.find((t) => t.id === id) ?? THEMES[0];
const rgba = (hex: string, a: number) => `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${a})`;
export const themeVars = (t: Theme) => ({ "--ac": t.a, "--ac2": t.ac2, "--ac-soft": rgba(t.a, 0.1) }) as Record<string, string>;
export function applyThemeLive(t: Theme) {
  const s = document.documentElement.style;
  for (const [k, v] of Object.entries(themeVars(t))) s.setProperty(k, v);
  document.cookie = `${THEME_COOKIE}=${t.id}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new CustomEvent("afyon-theme", { detail: t }));
}
