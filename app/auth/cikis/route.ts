import {isLocale} from "@/i18n/routing";
import {localizePath} from "@/i18n/paths";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const requestedLocale = (await request.formData()).get("locale");
  const locale = isLocale(requestedLocale) ? requestedLocale : "tr";
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL(localizePath("/giris", locale), request.url), { status: 303 });
}
