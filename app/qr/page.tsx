import Link from "next/link";
import Scanner from "@/components/qr/Scanner";
export const metadata = { title: "QR ile Başlat" };

export default function QR() {
  return (
    <main className="min-h-dvh bg-[#0A1530] px-5 pb-32 pt-8 text-white">
      <Link href="/" aria-label="Kapat" className="glass-dark inline-flex h-11 w-11 items-center justify-center rounded-full">×</Link>
      <h1 className="mt-6 text-center font-display text-2xl font-semibold">Rota QR kodunu okutun</h1>
      <p className="mt-1.5 text-center text-sm opacity-85">Kodu çerçevenin içine hizalayın</p>
      <Scanner />
    </main>
  );
}
