import {useTranslations as useUiTranslations} from "next-intl";
import { Link } from "@/i18n/navigation";

export default function SignInPrompt({ title, text }: { title: string; text: string }) {
  const tx = useUiTranslations("ui");

  return (
    <div className="glass mx-5 mt-6 rounded-[28px] p-6 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-[300px] text-sm leading-relaxed text-ink-2">{text}</p>
      <Link href="/giris" className="terra-grad mt-5 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-bold text-white">{tx("signInOrCreateAn_d5ffa")}</Link>
      <p className="mt-3 text-xs text-mute">{tx("youCanBrowseRoutesMaps_04c8f")} <Link href="/gizlilik" className="underline">{tx("privacy_9e93e")}</Link> · <Link href="/sartlar" className="underline">{tx("terms_3d1a4")}</Link> · <Link href="/geri-bildirim" className="underline">{tx("feedback_be036")}</Link></p>
    </div>
  );
}
