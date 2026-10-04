"use client";

import { useMemo, useCallback } from "react";
import { useTranslation as useReactI18nextTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import {
  Locale,
  getLocalizedHref as i18nGetLocalizedHref,
  getAlternateLocalePath,
} from "./index";

export interface UseI18nReturn {
  t: (key: string, fallbackOrOptions?: string | Record<string, unknown>) => string;
  i18n: ReturnType<typeof useReactI18nextTranslation>["i18n"];
  locale: Locale;
  language: Locale; // alias for backwards compatibility
  isRTL: boolean;
  dir: "rtl" | "ltr";
  changeLanguage: (lng: Locale) => Promise<unknown>;
  getLocalizedHref: (path: string) => string;
  alternateHref: string;
  alternateLocale: Locale;
}

export function useI18n(): UseI18nReturn {
  const { t: i18nT, i18n } = useReactI18nextTranslation();
  const pathname = usePathname() || "/";

  // Derive current locale from i18n or URL
  const currentLocale: Locale = useMemo(() => {
    const lang = i18n.language;
    if (lang === "fa" || lang === "en") return lang;
    return pathname.startsWith("/fa") ? "fa" : "en";
  }, [i18n.language, pathname]);

  const isRTL = currentLocale === "fa";
  const dir: "rtl" | "ltr" = isRTL ? "rtl" : "ltr";
  const alternateLocale: Locale = currentLocale === "fa" ? "en" : "fa";

  const alternateHref = useMemo(() => {
    return getAlternateLocalePath(pathname, alternateLocale);
  }, [pathname, alternateLocale]);

  const changeLanguage = useCallback(
    (newLang: Locale) => {
      return i18n.changeLanguage(newLang);
    },
    [i18n]
  );

  const getLocalizedHref = useCallback(
    (path: string) => {
      return i18nGetLocalizedHref(path, currentLocale);
    },
    [currentLocale]
  );

  const t = useCallback(
    (key: string, fallbackOrOptions?: string | Record<string, unknown>): string => {
      if (typeof fallbackOrOptions === "string") {
        return i18nT(key, { defaultValue: fallbackOrOptions }) as string;
      }
      return i18nT(key, fallbackOrOptions) as string;
    },
    [i18nT]
  );

  return {
    t,
    i18n,
    locale: currentLocale,
    language: currentLocale,
    isRTL,
    dir,
    changeLanguage,
    getLocalizedHref,
    alternateHref,
    alternateLocale,
  };
}

export const useTranslation = useI18n;
