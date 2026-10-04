"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { useI18n } from "@/i18n/client";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import type { Locale } from "@/config/site";

interface ContactViewProps {
  locale: Locale;
}

export function ContactView({ locale }: ContactViewProps) {
  const { t, getLocalizedHref } = useI18n();

  const breadcrumbs = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(locale, breadcrumbs)} />
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-36 sm:pt-40 lg:pt-44 pb-24 sm:pb-32" id="main-content">
        <div className="portfolio-container mb-6 sm:mb-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--primary-light)]">
            <Link href={getLocalizedHref("/")} className="hover:text-white transition-colors">
              {t("nav.home")}
            </Link>
            <span className="opacity-40" aria-hidden="true">/</span>
            <span className="text-[var(--text)]">{t("nav.contact")}</span>
          </nav>
        </div>

        <ContactSection isStandalone />
      </main>

      <Footer />
    </>
  );
}
