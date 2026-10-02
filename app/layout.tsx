import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import GlassTab from "@/components/GlassTab";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Afyon Şehir Rotası",
  description: "Afyonkarahisar için resmî rehber rotaları, QR ile başlayan sesli anlatım ve canlı harita.",
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#0F2547", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="mx-auto min-h-dvh max-w-[520px] pb-32">
        {children}
        <GlassTab />
      </body>
    </html>
  );
}
