import Link from "next/link";

export const metadata = { title: "Sayfa bulunamadı" };

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/art/hero-kale.svg" alt="" className="h-40 w-full max-w-[360px] rounded-[28px] object-cover object-[85%_40%] shadow-card" />
      <p className="mt-6 text-[11px] font-bold tracking-[2px] text-terra">404</p>
      <h1 className="mt-1 font-display text-[30px] font-semibold leading-tight">Bu yol bir yere çıkmıyor</h1>
      <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-ink-2">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <div className="mt-6 flex gap-2.5">
        <Link href="/" className="terra-grad flex h-12 items-center rounded-full px-6 text-sm font-bold text-white">Keşfet&apos;e dön</Link>
        <Link href="/rotalar" className="flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm font-bold shadow-card">Rotalar</Link>
      </div>
    </main>
  );
}
