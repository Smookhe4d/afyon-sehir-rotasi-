import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { supabaseConfigured } from "@/lib/supabase/env";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/giris", pageTitle(locale, "signIn"));
}

export default async function Giris({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  return (
    <main className="flex min-h-dvh flex-col px-5 pb-10">
      <section className="relative -mx-5 overflow-hidden bg-navy px-5 pb-20 pt-14 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/banner-afyon-1200.webp" srcSet="/art/banner-afyon-1200.webp 1200w, /art/banner-afyon-2000.webp 2000w" sizes="(min-width: 1024px) 1280px, 100vw" alt="" className="absolute inset-0 h-full w-full object-cover object-[58%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08122c]/75 via-[#08122c]/25 to-transparent" />
        <div className="relative">
        <p className="text-[10.5px] font-bold tracking-[2px] opacity-90">{tx("afyonkarahSar_6ac24")}</p>
        <h1 className="mt-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/rotafyon-480.webp" srcSet="/brand/rotafyon-480.webp 1x, /brand/rotafyon-960.webp 2x" width={179} height={60} alt={tx("afyonCityRoutes_f38c8")} className="h-[60px] w-auto rounded-xl" /></h1>
        <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed opacity-90">{tx("guidedRoutesThroughTheCastle_41055")}</p>
        </div>
      </section>
      <div className="-mt-9">
        {supabaseConfigured ? (
          <Suspense><AuthForm /></Suspense>
        ) : (
          <div className="glass rounded-[32px] p-5 text-sm leading-relaxed">
            <p className="font-display text-lg font-semibold">{tx("setupIncomplete_13c42")}</p>
            <p className="mt-1.5 text-ink-2">{tx("theAppIsNotConnected_ed0e4")} <code>NEXT_PUBLIC_SUPABASE_URL</code>  {tx("and_934cf")} <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>  {tx("environmentVariables_7d2a1")}</p>
          </div>
        )}
      </div>
      <Link href="/" className="mt-5 text-center text-sm font-bold text-navy underline underline-offset-4">{tx("browseWithoutSigningIn_13358")}</Link>
      <p className="mt-4 text-center text-[11px] text-mute"><Link href="/gizlilik" className="underline">{tx("privacy_9e93e")}</Link> · <Link href="/sartlar" className="underline">{tx("termsOfUse_8a73f")}</Link></p>
    </main>
  );
}
