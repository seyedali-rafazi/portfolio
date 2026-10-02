"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { PERSONAL_INFO, STATS } from "@/data/portfolioData";
import { ArrowLeft, ArrowRight, Compass, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import type { Locale } from "@/config/site";

interface AboutViewProps {
  locale: Locale;
}

export function AboutView({ locale }: AboutViewProps) {
  const { language, t, isRTL, getLocalizedHref } = useLanguage();

  const breadcrumbs = [
    { name: t("nav.home"), path: "/" },
    { name: t("about.title"), path: "/about" },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(locale, breadcrumbs)} />
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-36 sm:pt-40 lg:pt-44 pb-24 sm:pb-32" id="main-content">
        <div className="portfolio-container">
          {/* Breadcrumb / Page Label */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--primary-light)] mb-6">
            <Link href={getLocalizedHref("/")} className="hover:text-white transition-colors">
              {t("nav.home")}
            </Link>
            <span className="opacity-40" aria-hidden="true">/</span>
            <span className="text-[var(--text)]">{t("about.title")}</span>
          </nav>

          {/* Page Heading */}
          <header className="border-b border-[var(--border)]/40 pb-10 mb-12 text-start">
            <Badge variant="primarySubtle" className="mb-3 px-3 py-1 text-xs">
              {t("about.label")}
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-bright)] tracking-tight mb-4">
              {t("about.pageHeading", language === "fa" ? "درباره من" : "About Me")}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-3xl leading-relaxed">
              {t("about.pageSubheading")}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Main Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-8 text-start">
              <Card className="p-7 sm:p-9 space-y-6 shadow-xl">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[var(--primary-light)] uppercase tracking-wider">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                  <h2>{t("about.bioHeading")}</h2>
                </div>
                <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed font-normal">
                  {language === "fa"
                    ? PERSONAL_INFO.aboutMe.introFa
                    : PERSONAL_INFO.aboutMe.introEn}
                </p>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed pt-4 border-t border-[var(--border)]/50">
                  {language === "fa"
                    ? PERSONAL_INFO.aboutMe.extendedFa
                    : PERSONAL_INFO.aboutMe.extendedEn}
                </p>
              </Card>

              {/* Core Principles */}
              <Card className="p-7 sm:p-9 space-y-6 shadow-xl">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[var(--primary-light)] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <h2>{t("about.principlesHeading")}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[var(--muted)]">
                  <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t("about.principle1")}</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t("about.principle2")}</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t("about.principle3")}</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t("about.principle4")}</span>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap pt-2">
                <Button asChild variant="primary" size="lg" className="rounded-xl h-12 px-8 text-sm font-bold">
                  <Link href={getLocalizedHref("/projects")} className="inline-flex items-center gap-2.5 cursor-pointer">
                    <span>{t("nav.projects")}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-8 text-sm font-semibold">
                  <Link href={getLocalizedHref("/contact")} className="cursor-pointer">
                    <span>{t("nav.contact")}</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Sidebar (5 cols) */}
            <aside className="lg:col-span-5 space-y-6">
              <Card className="p-7 sm:p-9 divide-y divide-[var(--border)]/60 shadow-xl">
                <h3 className="text-lg font-bold text-[var(--text-bright)] mb-6">
                  {t("about.highlightsHeading")}
                </h3>
                {STATS.map((stat) => (
                  <div key={stat.id} className="py-6 first:pt-2 last:pb-2 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-[var(--primary-light)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 shrink-0">
                      {stat.symbol}
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-bright)] leading-tight tracking-tight">
                        {stat.number}
                      </div>
                      <div className="text-sm font-semibold text-[var(--text)] mt-1">
                        {stat.title[language]}
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        {stat.subtitle[language]}
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
