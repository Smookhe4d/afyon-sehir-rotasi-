"use client";
import {useTranslations} from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const t = useTranslations("common");
  return <button type="button" aria-label={t("back")} onClick={() => { const w = window as unknown as { __vtBack?: (go: () => void) => void }; if (w.__vtBack) w.__vtBack(() => router.back()); else router.back(); }} className={className}><svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor" aria-hidden><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/></svg></button>;
}
