import {routing, type Locale} from "./routing";

// Data, stored QR links and server actions use canonical Turkish paths.
// Translate only application paths. Assets and auth endpoints stay unprefixed.
export function internalPath(path: string): string {
  const value = (path.replace(/^\/en(?=\/|$)/, "") || "/").replace(/\/$/, "") || "/";
  for (const [key, entry] of Object.entries(routing.pathnames)) {
    const en = typeof entry === "string" ? entry : entry.en;
    const pattern = en.replace("[slug]", "([^/]+)").replace("[id]", "([^/]+)");
    const match = value.match(new RegExp("^" + pattern + "$"));
    if (match) return key.replace("[slug]", match[1] ?? "").replace("[id]", match[1] ?? "");
  }
  return value;
}

export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || /^\/auth(?:\/|$)/.test(href)) return href;
  const url = new URL(href, "https://internal.invalid");
  const canonical = internalPath(url.pathname);
  let pathname = canonical;
  for (const [key, entry] of Object.entries(routing.pathnames)) {
    const match = canonical.match(new RegExp("^" + key.replace("[slug]", "([^/]+)").replace("[id]", "([^/]+)") + "$"));
    if (!match) continue;
    const localized = typeof entry === "string" ? entry : entry[locale];
    pathname = localized.replace("[slug]", match[1] ?? "").replace("[id]", match[1] ?? "");
    break;
  }
  if (url.searchParams.has("next")) {
    const next = url.searchParams.get("next")!;
    if (next.startsWith("/") && !next.startsWith("//")) url.searchParams.set("next", localizePath(next, locale));
  }
  const prefix = locale === "en" ? "/en" : "";
  return prefix + (pathname === "/" && prefix ? "" : pathname) + url.search + url.hash;
}

export function safeReturnPath(value: string | null, locale: Locale): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return localizePath("/", locale);
  const parsed = new URL(value, "https://internal.invalid");
  return parsed.origin === "https://internal.invalid" ? localizePath(value, locale) : localizePath("/", locale);
}
