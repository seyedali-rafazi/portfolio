"use client";

import React from "react";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProjectProposalModal } from "@/components/ProjectProposalModal";
import type { Locale } from "@/config/site";

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export function Providers({ children, locale }: ProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale}>
        {children}
        <ProjectProposalModal />
      </I18nProvider>
    </ThemeProvider>
  );
}
