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
    <main className="relative flex min-h-dvh flex-col pb-8">
      {/* G-011: üstte fotoğraf ve beyaz logo, altta buzlu cam form */}
      <section className="relative h-[44dvh] min-h-[300px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/aslankaya.jpg" alt="" className="absolute inset-0 h-full w-full object-cover [animation:onb-kb_16s_ease-out_both]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0266]/30 via-transparent to-cream" />
        <h1 className="relative px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/rotafyon-beyaz-960.webp" width={168} height={42} alt={tx("afyonCityRoutes_f38c8")} className="h-[42px] w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,.35)]" /></h1>
      </section>
      <div className="relative -mt-24 px-3 [animation:onb-rise_.8s_.15s_var(--ease-spring)_both]">
        <p className="mb-3 px-3 text-[15px] font-medium leading-relaxed text-white drop-shadow-[0_1px_6px_rgba(0,0,0,.45)]">{tx("guidedRoutesThroughTheCastle_41055")}</p>
        {supabaseConfigured ? (
          <Suspense><AuthForm /></Suspense>
        ) : (
          <div className="glass rounded-[32px] p-5 text-sm leading-relaxed">
            <p className="font-display text-lg">{tx("setupIncomplete_13c42")}</p>
            <p className="mt-1.5 text-ink-2">{tx("theAppIsNotConnected_ed0e4")} <code>NEXT_PUBLIC_SUPABASE_URL</code>  {tx("and_934cf")} <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>  {tx("environmentVariables_7d2a1")}</p>
          </div>
        )}
      </div>
      <Link href="/" className="mt-5 text-center text-[15px] font-bold text-ac">{tx("browseWithoutSigningIn_13358")}</Link>
      <p className="mt-4 text-center text-[12px] text-mute"><Link href="/gizlilik" className="underline">{tx("privacy_9e93e")}</Link> · <Link href="/sartlar" className="underline">{tx("termsOfUse_8a73f")}</Link></p>
    </main>
  );
}
