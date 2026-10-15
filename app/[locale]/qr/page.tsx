import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import Scanner from "@/components/qr/Scanner";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/qr", pageTitle(locale, "qr"));
}

export default async function QR({ params }: { params: Promise<{locale: Locale}> }) {
  setRequestLocale((await params).locale);
  return (
    <main className="min-h-dvh bg-[#0A1530] px-5 pb-32 pt-8 text-white">
      <Link href="/" aria-label="Kapat" className="glass-dark inline-flex h-11 w-11 items-center justify-center rounded-full">×</Link>
      <h1 className="mt-6 text-center font-display text-2xl font-semibold">Rota QR kodunu okutun</h1>
      <p className="mt-1.5 text-center text-sm opacity-85">Kodu çerçevenin içine hizalayın</p>
      <Scanner />
    </main>
  );
}
