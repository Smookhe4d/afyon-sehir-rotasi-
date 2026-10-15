"use client";
import {useLocale} from "next-intl";
import {getContent} from "@/lib/content";
import type {Locale} from "./routing";

export function useContent() { return getContent(useLocale() as Locale); }
