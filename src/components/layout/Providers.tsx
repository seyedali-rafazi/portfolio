"use client";

import React from "react";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ProjectProposalModal } from "@/components/ProjectProposalModal";
import { Toaster } from "sonner";
import type { Locale } from "@/config/site";

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      theme={theme === "light" ? "light" : "dark"}
      toastOptions={{
        style: {
          borderRadius: "14px",
          fontFamily: "inherit",
        },
      }}
    />
  );
}

export function Providers({ children, locale }: ProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale}>
        {children}
        <ProjectProposalModal />
        <ThemedToaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
