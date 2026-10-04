"use client";

import React from "react";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Locale } from "@/config/site";

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export function Providers({ children, locale }: ProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
