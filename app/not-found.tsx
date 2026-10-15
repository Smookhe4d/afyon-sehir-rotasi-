import messages from "@/messages/tr.json";
import "./globals.css";
import {RootLink as Link} from "@/i18n/navigation";

export const metadata = { title: messages.notFound.title };

export default function NotFound() {
  return (
    <html lang="tr"><body><main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/art/banner-afyon-1200.webp" alt="" className="h-40 w-full max-w-[360px] rounded-[28px] object-cover object-[62%_40%] shadow-card" />
      <p className="mt-6 text-[11px] font-bold tracking-[2px] text-terra">404</p>
      <h1 className="mt-1 font-display text-[30px] font-semibold leading-tight">{messages.notFound.heading}</h1>
      <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-ink-2">{messages.notFound.description}</p>
      <div className="mt-6 flex gap-2.5">
        <Link href="/" className="terra-grad flex h-12 items-center rounded-full px-6 text-sm font-bold text-white">{messages.notFound.home}</Link>
        <Link href="/rotalar" className="flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm font-bold shadow-card">{messages.notFound.routes}</Link>
      </div>
    </main></body></html>
  );
}
