"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "./config";
import { Locale, getAlternateLocalePath } from "./index";

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Instance is created once, already in the right language (no setState during render)
  const [i18n] = useState(() => createI18n(initialLocale));

  // React to i18n.changeLanguage(...) calls: sync DOM attributes and the route
  useEffect(() => {
    const handleLanguageChanged = (newLang: string) => {
      const targetLocale: Locale = newLang === "fa" ? "fa" : "en";

      document.documentElement.lang = targetLocale;
      document.documentElement.dir = targetLocale === "fa" ? "rtl" : "ltr";
      document.body.classList.toggle("en", targetLocale === "en");

      const currentRouteLocale: Locale = pathname.startsWith("/fa") ? "fa" : "en";
      if (currentRouteLocale !== targetLocale) {
        const targetPath = getAlternateLocalePath(pathname, targetLocale);
        startTransition(() => {
          router.push(targetPath);
        });
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, pathname, router]);

  // Keep i18n in sync when the route changes via regular navigation (links, back button)
  useEffect(() => {
    const routeLocale: Locale = pathname.startsWith("/fa") ? "fa" : "en";
    if (i18n.language !== routeLocale) {
      i18n.changeLanguage(routeLocale);
    }
  }, [i18n, pathname]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
