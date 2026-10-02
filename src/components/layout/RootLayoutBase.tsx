import React from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import type { Locale } from "@/config/site";

interface RootLayoutBaseProps {
  children: React.ReactNode;
  locale: Locale;
}

export function RootLayoutBase({ children, locale }: RootLayoutBaseProps) {
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="dark">
      <head>
        <link
          rel="preload"
          href="/fonts/vazirmatn/Vazirmatn[wght].woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`antialiased min-h-screen flex flex-col selection:bg-[var(--primary)] selection:text-white ${
          locale === "en" ? "en" : ""
        }`}
      >
        <ScrollToTop />
        <ThemeProvider>
          <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
