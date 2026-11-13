import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import IntlProvider from "@/components/IntlProvider";
import {pageMetadata} from "@/i18n/metadata";
import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { THEMES, THEME_COOKIE } from "@/lib/themes";
import Splash from "@/components/Splash";
import PageTransitions from "@/components/motion/PageTransitions";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Track from "@/components/Track";
import SwRegister from "@/components/SwRegister";
import Onboarding from "@/components/Onboarding";
import { routes } from "@/lib/routes";
import TopNav from "@/components/TopNav";
import GlassTab from "@/components/GlassTab";
import "../globals.css";

const onest = Onest({ subsets: ["latin", "latin-ext"], variable: "--font-onest", weight: ["400", "500", "600", "700", "800"], display: "swap" });

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  return {...pageMetadata((await params).locale, "/"), manifest: "/manifest.webmanifest", metadataBase: new URL("https://rotafyon.vercel.app"), twitter: {card: "summary_large_image", images: ["/og.jpg"]}};
}
export function generateStaticParams() { return routing.locales.map(locale => ({locale})); }
export const viewport: Viewport = { themeColor: "#4B0266", width: "device-width", initialScale: 1 };

const THEME_BOOT = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]+)/);if(!m)return;var T=${JSON.stringify(Object.fromEntries(THEMES.map((t) => [t.id, [t.a, t.ac2]])))};var t=T[m[1]];if(!t)return;var s=document.documentElement.style,h=t[0];s.setProperty("--ac",h);s.setProperty("--ac2",t[1]);s.setProperty("--ac-soft","rgba("+parseInt(h.slice(1,3),16)+","+parseInt(h.slice(3,5),16)+","+parseInt(h.slice(5,7),16)+",0.1)")}catch(e){}})()`;
const MOTION_BOOT = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-motion","on");setTimeout(function(){if(!window.__afyonMotion)d.removeAttribute("data-motion")},4000)}catch(e){}})()`;

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale: string}> }) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={onest.variable} suppressHydrationWarning>
      <head>
        {/* G-007: Hides reveal targets only when JavaScript runs, before the first paint. Falls back to visible if hydration fails. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
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
        <Splash />
        <PageTransitions />
        <SwRegister />
        <Track />
        <Analytics />
        <SpeedInsights />
        </IntlProvider>
      </body>
    </html>
  );
}
