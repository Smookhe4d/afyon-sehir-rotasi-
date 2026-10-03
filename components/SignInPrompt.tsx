import Link from "next/link";

export default function SignInPrompt({ title, text }: { title: string; text: string }) {
  return (
    <div className="glass mx-5 mt-6 rounded-[28px] p-6 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-[300px] text-sm leading-relaxed text-ink-2">{text}</p>
      <Link href="/giris" className="terra-grad mt-5 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-bold text-white">Giriş yap veya kayıt ol</Link>
      <p className="mt-3 text-xs text-mute">Rotalara, haritaya ve duraklara giriş yapmadan da göz atabilirsiniz. <a href="/gizlilik" className="underline">Gizlilik</a> · <a href="/sartlar" className="underline">Şartlar</a></p>
    </div>
  );
}
