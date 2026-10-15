import type {Metadata} from "next";
import {localizePath} from "./paths";
import type {Locale} from "./routing";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

const base = "https://afyon-sehir-rotasi.vercel.app";
export function pageTitle(locale: Locale, key: keyof typeof tr.metadata.pages) {
  return (locale === "en" ? en : tr).metadata.pages[key];
}
export function pageMetadata(locale: Locale, path: string, title?: string, description?: string, extra: Metadata = {}): Metadata {
  const messages = locale === "en" ? en : tr;
  const languages = {tr: base + localizePath(path, "tr"), en: base + localizePath(path, "en"), "x-default": base + localizePath(path, "tr")};
  return {
    ...extra,
    title: title ?? messages.metadata.title,
    description: description ?? messages.metadata.description,
    alternates: {canonical: base + localizePath(path, locale), languages},
    openGraph: {
      title: title ?? messages.metadata.title,
      description: description ?? messages.metadata.description,
      locale: locale === "en" ? "en_US" : "tr_TR",
      alternateLocale: locale === "en" ? "tr_TR" : "en_US",
      type: "website", images: [{url: "/og.jpg", width: 1200, height: 630}]
    }
  };
}
