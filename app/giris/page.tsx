import { Suspense } from "react";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Giriş" };

export default function Giris() {
  return (
    <main className="flex min-h-dvh flex-col px-5 pb-10">
      <section className="relative -mx-5 overflow-hidden bg-navy px-5 pb-20 pt-14 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/hero-kale.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-[85%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08122c]/75 via-[#08122c]/25 to-transparent" />
        <div className="relative">
        <p className="text-[10.5px] font-bold tracking-[2px] opacity-90">AFYONKARAHİSAR</p>
        <h1 className="mt-2 font-display text-[40px] font-semibold leading-[1.02] tracking-tight">Afyon Şehir Rotası</h1>
        <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed opacity-90">Kale, çarşı ve Frig vadilerinde rehberli rotalar; QR ile başlayan anlatım.</p>
        </div>
      </section>
      <div className="-mt-9">
        {supabaseConfigured ? (
          <Suspense><AuthForm /></Suspense>
        ) : (
          <div className="glass rounded-[32px] p-5 text-sm leading-relaxed">
            <p className="font-display text-lg font-semibold">Kurulum tamamlanmadı</p>
            <p className="mt-1.5 text-ink-2">Uygulama henüz bir Supabase projesine bağlanmadı. <code>NEXT_PUBLIC_SUPABASE_URL</code> ve <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> ortam değişkenlerini ekleyin.</p>
          </div>
        )}
      </div>
      <Link href="/" className="mt-5 text-center text-sm font-bold text-navy underline underline-offset-4">Giriş yapmadan göz at</Link>
      <p className="mt-4 text-center text-[11px] text-mute"><Link href="/gizlilik" className="underline">Gizlilik</Link> · <Link href="/sartlar" className="underline">Kullanım Şartları</Link></p>
    </main>
  );
}
