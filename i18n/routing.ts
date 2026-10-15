import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: {name: "NEXT_LOCALE", path: "/", maxAge: 31536000},
  pathnames: {
    "/": "/",
    "/rotalar": {tr: "/rotalar", en: "/routes"},
    "/rotalar/[slug]": {tr: "/rotalar/[slug]", en: "/routes/[slug]"},
    "/duraklar/[id]": {tr: "/duraklar/[id]", en: "/stops/[id]"},
    "/harita": {tr: "/harita", en: "/map"},
    "/rotani-belirle": {tr: "/rotani-belirle", en: "/plan-your-route"},
    "/sosyal": {tr: "/sosyal", en: "/community"},
    "/profil": {tr: "/profil", en: "/profile"},
    "/giris": {tr: "/giris", en: "/sign-in"},
    "/qr": "/qr",
    "/geri-bildirim": {tr: "/geri-bildirim", en: "/feedback"},
    "/hakkinda": {tr: "/hakkinda", en: "/about"},
    "/gizlilik": {tr: "/gizlilik", en: "/privacy"},
    "/sartlar": {tr: "/sartlar", en: "/terms"},
    "/yonetim": {tr: "/yonetim", en: "/admin"}
  }
});

export type Locale = (typeof routing.locales)[number];
export const isLocale = (value: unknown): value is Locale => value === "tr" || value === "en";
