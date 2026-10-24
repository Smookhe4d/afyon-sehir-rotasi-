import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import IntlProvider from "@/components/IntlProvider";
import {pageMetadata} from "@/i18n/metadata";
import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Track from "@/components/Track";
import SwRegister from "@/components/SwRegister";
import Onboarding from "@/components/Onboarding";
import { routes } from "@/lib/routes";
import TopNav from "@/components/TopNav";
import GlassTab from "@/components/GlassTab";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces", axes: ["opsz", "SOFT"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-jakarta", display: "swap" });

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  return {...pageMetadata((await params).locale, "/"), manifest: "/manifest.webmanifest", metadataBase: new URL("https://afyon-sehir-rotasi.vercel.app"), twitter: {card: "summary_large_image", images: ["/og.jpg"]}};
}
export function generateStaticParams() { return routing.locales.map(locale => ({locale})); }
export const viewport: Viewport = { themeColor: "#0F2547", width: "device-width", initialScale: 1 };

const MOTION_BOOT = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-motion","on");setTimeout(function(){if(!window.__afyonMotion)d.removeAttribute("data-motion")},4000)}catch(e){}})()`;

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale: string}> }) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${fraunces.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* G-007: Hides reveal targets only when JavaScript runs, before the first paint. Falls back to visible if hydration fails. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
      </head>
      <body className="mx-auto min-h-dvh max-w-[520px] pb-32 lg:max-w-none lg:pb-0">
        <IntlProvider locale={locale} messages={messages}>
        <TopNav />
        <div className="lg:mx-auto lg:max-w-[1280px]">{children}</div>
        <GlassTab />
        <Onboarding routeCount={routes.length} />
        <SwRegister />
        <Track />
        <Analytics />
        <SpeedInsights />
        </IntlProvider>
      </body>
    </html>
  );
}
