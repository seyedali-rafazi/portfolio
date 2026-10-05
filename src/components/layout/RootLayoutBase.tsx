import React from "react";
import { Providers } from "@/components/layout/Providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import type { Locale } from "@/config/site";

interface RootLayoutBaseProps {
  children: React.ReactNode;
  locale: Locale;
}

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('portfolio-theme');
    var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export function RootLayoutBase({ children, locale }: RootLayoutBaseProps) {
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
        {locale === "fa" ? (
          <>
            <link
              rel="preload"
              href="/fonts/vazirmatn/fd/Vazirmatn-FD-Regular.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/vazirmatn/fd/Vazirmatn-FD-Bold.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          </>
        ) : (
          <link
            rel="preload"
            href="/fonts/vazirmatn/Vazirmatn[wght].woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`antialiased min-h-screen flex flex-col selection:bg-[var(--primary)] selection:text-white ${
          locale === "en" ? "en" : ""
        }`}
      >
        <ScrollToTop />
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
