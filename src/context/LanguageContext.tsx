"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Locale,
  dictionaries,
  getNestedTranslation,
  getLocalizedHref as i18nGetLocalizedHref,
  getAlternateLocalePath,
} from "@/i18n";

interface LanguageContextType {
  locale: Locale;
  language: Locale; // alias for backwards compatibility
  setLocale: (lang: Locale) => void;
  setLanguage: (lang: Locale) => void; // alias
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  dir: "rtl" | "ltr";
  getLocalizedHref: (path: string) => string;
  alternateHref: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLocale = "en",
}) => {
  const pathname = usePathname() || "/";
  const router = useRouter();

  // The URL is the single source of truth for crawlability & determinism
  const currentLocale: Locale = useMemo(() => {
    if (pathname.startsWith("/fa")) {
      return "fa";
    }
    return initialLocale || "en";
  }, [pathname, initialLocale]);

  // Reciprocal alternate path for switching to the opposite language
  const alternateLocale: Locale = currentLocale === "fa" ? "en" : "fa";
  const alternateHref = useMemo(() => {
    return getAlternateLocalePath(pathname, alternateLocale);
  }, [pathname, alternateLocale]);

  // Apply DOM attributes on client
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.lang = currentLocale;
      root.dir = currentLocale === "fa" ? "rtl" : "ltr";
      if (currentLocale === "en") {
        document.body.classList.add("en");
      } else {
        document.body.classList.remove("en");
      }
    }
  }, [currentLocale]);

  const setLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    const targetPath = getAlternateLocalePath(pathname, newLocale);
    router.push(targetPath);
  };

  const toggleLanguage = () => {
    router.push(alternateHref);
  };

  const t = (key: string, fallback?: string): string => {
    const dictionary = dictionaries[currentLocale] || dictionaries.en;
    const translated = getNestedTranslation(
      dictionary as unknown as Record<string, unknown>,
      key
    );
    if (translated === key && fallback) {
      return fallback;
    }
    return translated;
  };

  const isRTL = currentLocale === "fa";
  const dir: "rtl" | "ltr" = isRTL ? "rtl" : "ltr";

  const getLocalizedHref = (path: string): string => {
    return i18nGetLocalizedHref(path, currentLocale);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale: currentLocale,
        language: currentLocale,
        setLocale,
        setLanguage: setLocale,
        toggleLanguage,
        t,
        isRTL,
        dir,
        getLocalizedHref,
        alternateHref,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const useI18n = useLanguage;
