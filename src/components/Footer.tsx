"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { Logo } from "@/components/common/Logo";

export const Footer: React.FC = () => {
  const { locale, t, i18n, getLocalizedHref, alternateLocale } = useI18n();

  return (
    <footer className="border-t border-[var(--border)] py-12 sm:py-16 relative bg-[var(--bg)]/90 backdrop-blur-md mt-auto">
      <div className="portfolio-container flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-[var(--muted)]">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3 text-center sm:text-start">
          <Link
            href={getLocalizedHref("/")}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
            aria-label="Home"
          >
            <Logo size="sm" variant="badge" withGlow={false} locale={locale} />
          </Link>
          <span>{t("footer.copyright")}</span>
        </div>

        {/* Footer Navigation Links with Next.js Link */}
        <nav aria-label="Footer Navigation" className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <Link
            href={getLocalizedHref("/")}
            className="hover:text-[var(--text-bright)] transition-colors focus:outline-none"
          >
            {t("nav.home", "Home")}
          </Link>
          <Link
            href={getLocalizedHref("/about")}
            className="hover:text-[var(--text-bright)] transition-colors focus:outline-none"
          >
            {t("nav.about", "About")}
          </Link>
          <Link
            href={getLocalizedHref("/projects")}
            className="hover:text-[var(--text-bright)] transition-colors focus:outline-none"
          >
            {t("nav.projects", "Projects")}
          </Link>
          <Link
            href={getLocalizedHref("/skills")}
            className="hover:text-[var(--text-bright)] transition-colors focus:outline-none"
          >
            {t("nav.skills", "Skills")}
          </Link>
          <Link
            href={getLocalizedHref("/contact")}
            className="hover:text-[var(--text-bright)] transition-colors focus:outline-none"
          >
            {t("nav.contact", "Contact")}
          </Link>
          <span className="opacity-30" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => i18n.changeLanguage(alternateLocale)}
            className="font-semibold text-[var(--primary)] dark:text-[var(--primary-light)] hover:text-[var(--primary-dark)] dark:hover:text-white transition-colors cursor-pointer"
            aria-label={locale === "fa" ? "Switch language to English" : "تغییر زبان به فارسی"}
          >
            {t("footer.switchLang")}
          </button>
        </nav>
      </div>
    </footer>
  );
};
