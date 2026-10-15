"use client";
import {NextIntlClientProvider, IntlErrorCode, type AbstractIntlMessages} from "next-intl";
import type {Locale} from "@/i18n/routing";
import fallback from "@/messages/tr.json";

export default function IntlProvider({locale, messages, children}: {locale: Locale; messages: AbstractIntlMessages; children: React.ReactNode}) {
  return <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Istanbul"
    onError={error => {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE || process.env.NODE_ENV === "development") console.warn("[i18n]", error.message);
    }}
    getMessageFallback={({namespace, key}) => {
      let value: unknown = fallback;
      for (const segment of [namespace, key].filter(Boolean).join(".").split(".")) {
        value = value && typeof value === "object" ? (value as Record<string, unknown>)[segment] : undefined;
      }
      return typeof value === "string" ? value : "";
    }}>{children}</NextIntlClientProvider>;
}
