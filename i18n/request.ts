import {getRequestConfig} from "next-intl/server";
import {IntlErrorCode} from "next-intl";
import {isLocale} from "./routing";
import tr from "@/messages/tr.json";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : "tr";
  const messages = locale === "en" ? (await import("@/messages/en.json")).default : tr;
  // Missing English leaves inherit Turkish without breaking rendering.
  function merge(base: Record<string, unknown>, translated: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(base).map(([key, value]) => [
      key,
      value && typeof value === "object" && !Array.isArray(value)
        ? merge(value as Record<string, unknown>, (translated[key] ?? {}) as Record<string, unknown>)
        : translated[key] ?? value
    ]));
  }
  if (locale === "en" && process.env.NODE_ENV === "development") {
    function warn(base: Record<string, unknown>, other: Record<string, unknown>, prefix = "") {
      for (const [key, value] of Object.entries(base)) {
        const name = prefix + key;
        if (value && typeof value === "object") warn(value as Record<string, unknown>, (other[key] ?? {}) as Record<string, unknown>, name + ".");
        else if (!(key in other)) console.warn("[i18n] Missing English message: " + name);
      }
    }
    warn(tr, messages);
  }
  return {
    locale, messages: merge(tr, messages), timeZone: "Europe/Istanbul",
    onError(error) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE || process.env.NODE_ENV === "development") console.warn("[i18n]", error.message);
    },
    getMessageFallback({namespace, key}) {
      let value: unknown = tr;
      for (const part of [namespace, key].filter(Boolean).join(".").split(".")) {
        value = value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined;
      }
      return typeof value === "string" ? value : "";
    }
  };
});
