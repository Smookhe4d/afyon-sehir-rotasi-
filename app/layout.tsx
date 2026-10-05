import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Track from "@/components/Track";
import SwRegister from "@/components/SwRegister";
import Onboarding from "@/components/Onboarding";
import TopNav from "@/components/TopNav";
import GlassTab from "@/components/GlassTab";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces", axes: ["opsz", "SOFT"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "Afyon Şehir Rotası",
  description: "Afyonkarahisar için resmî rehber rotaları, QR ile başlayan sesli anlatım ve canlı harita.",
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://afyon-sehir-rotasi.vercel.app"),
  openGraph: { title: "Afyon Şehir Rotası", description: "Afyonkarahisar için rehber rotaları, sesli anlatım ve canlı yönlendirmeli harita.", locale: "tr_TR", type: "website", images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};
export const viewport: Viewport = { themeColor: "#0F2547", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
      </head>
      <body className="mx-auto min-h-dvh max-w-[520px] pb-32 lg:max-w-none lg:pb-0">
        <TopNav />
        <div className="lg:mx-auto lg:max-w-[1280px]">{children}</div>
        <GlassTab />
        <Onboarding />
        <SwRegister />
        <Track />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
