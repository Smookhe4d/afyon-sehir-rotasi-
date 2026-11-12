import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import Scanner from "@/components/qr/Scanner";
import Icon from "@/components/Icon";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/qr", pageTitle(locale, "qr"));
}

export default async function QR({ params }: { params: Promise<{locale: Locale}> }) {
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0E0814] px-5 pb-36 pt-[max(1rem,env(safe-area-inset-top))] text-white [animation:qr-in_.75s_cubic-bezier(.65,0,.25,1)_both]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_srgb,var(--ac)_45%,transparent),transparent_60%)]" />
      <div className="relative flex items-center justify-between">
        <Link href="/" aria-label={tx("close_9e6ec")} className="glass-dark inline-flex h-11 w-11 items-center justify-center rounded-full"><Icon name="x" size={22} /></Link>
      </div>
      <div className="relative mx-auto mt-4 flex max-w-[340px] items-center gap-3 [animation:onb-rise_.7s_.35s_var(--ease-spring)_both]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ac2 text-navy"><Icon name="qr-code" size={26} /></span>
        <span><h1 className="font-display text-[22px] leading-tight">{tx("scanARouteQrCode_b1db7")}</h1><p className="mt-0.5 text-sm text-white/75">{tx("alignTheCodeInsideThe_3c97b")}</p></span>
      </div>
      <div className="relative"><Scanner /></div>
    </main>
  );
}
