import {isLocale} from "@/i18n/routing";
import {localizePath, safeReturnPath} from "@/i18n/paths";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const requestedLocale = searchParams.get("locale");
  const locale = isLocale(requestedLocale) ? requestedLocale : next.startsWith("/en") ? "en" : "tr";
  const safeNext = safeReturnPath(next, locale);
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }
  return NextResponse.redirect(`${origin}${localizePath("/giris?hata=oturum", locale)}`);
}
