"use client";
import {useTranslations} from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const t = useTranslations("common");
  return <button type="button" aria-label={t("back")} onClick={() => router.back()} className={className}>‹</button>;
}
