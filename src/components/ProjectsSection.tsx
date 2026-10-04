"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { FEATURED_PROJECTS, BOT_PROJECTS, PACKAGE_PROJECTS } from "@/data/portfolioData";
import { ProjectSwiper } from "./ProjectSwiper";
import { BotProjectSwiper } from "./BotProjectSwiper";
import { PackageProjectSwiper } from "./PackageProjectSwiper";
import { ArrowLeft, ArrowRight, Bot, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ProjectsSection: React.FC = () => {
  const { t, isRTL, getLocalizedHref } = useI18n();

  return (
    <section
      id="projects"
      className="py-20 sm:py-28 lg:py-32 relative overflow-hidden"
    >
      <div className="portfolio-container">
        {/* Section Header: Featured Projects */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-[var(--border)]/40">
          <div className="text-start">
            <div className="mb-2">
              <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                <span>{t("projects.label")}</span>
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight">
              {t("projects.heading")}
            </h2>
          </div>

          <Link
            href={getLocalizedHref("/projects")}
            className="text-xs sm:text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary-light)] hover:text-[var(--primary-dark)] dark:hover:text-white inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>{t("projects.viewAll")}</span>
            {isRTL ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Link>
        </div>

        {/* Interactive Swiper Slider for Featured Web & Geospatial Projects */}
        <ProjectSwiper projects={FEATURED_PROJECTS} />

        {/* Bot Projects Section - Positioned at bottom of Featured Projects */}
        <div
          id="bot-projects"
          className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-[var(--border)]/40"
        >
          {/* Bot Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-[var(--border)]/40">
            <div className="text-start">
              <div className="mb-2">
                <Badge
                  variant="primarySubtle"
                  className="px-3 py-1 text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-950/40"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("botProjects.badge")}</span>
                </Badge>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight">
                {t("botProjects.heading")}
              </h3>
            </div>

            <Link
              href={getLocalizedHref("/projects")}
              className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-white inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{t("projects.viewAll")}</span>
              {isRTL ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Link>
          </div>

          {/* Interactive Swiper Slider for Bot Projects */}
          <BotProjectSwiper projects={BOT_PROJECTS} />
        </div>

        {/* Package & Open Source Projects Section - Positioned at bottom of Bot Projects */}
        <div
          id="package-projects"
          className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-[var(--border)]/40"
        >
          {/* Package Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-[var(--border)]/40">
            <div className="text-start">
              <div className="mb-2">
                <Badge
                  variant="primarySubtle"
                  className="px-3 py-1 text-xs border-indigo-500/30 text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-950/40"
                >
                  <Package className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t("packageProjects.badge")}</span>
                </Badge>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight">
                {t("packageProjects.heading")}
              </h3>
            </div>

            <Link
              href={getLocalizedHref("/projects")}
              className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{t("projects.viewAll")}</span>
              {isRTL ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Link>
          </div>

          {/* Interactive Swiper Slider for Package & Open Source Projects */}
          <PackageProjectSwiper projects={PACKAGE_PROJECTS} />
        </div>
      </div>
    </section>
  );
};
