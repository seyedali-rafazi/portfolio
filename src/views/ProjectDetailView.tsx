"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/client";
import { Project } from "@/types";
import { PROJECTS } from "@/data/portfolioData";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Activity,
  Layers,
  Cpu,
  Share2,
  Check,
  Compass,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getProjectDetailSchema } from "@/lib/schema";
import type { Locale } from "@/config/site";

interface ProjectDetailViewProps {
  project: Project;
  locale: Locale;
}

export function ProjectDetailView({ project, locale }: ProjectDetailViewProps) {
  const { t, isRTL, getLocalizedHref } = useI18n();
  const [copied, setCopied] = useState(false);

  const displayTitle =
    locale === "fa" && project.titleFa ? project.titleFa : project.title;

  const breadcrumbs = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.projects"), path: "/projects" },
    { name: displayTitle, path: `/projects/${project.id}` },
  ];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Find next and previous projects for bottom navigation
  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0
      ? PROJECTS[currentIndex - 1]
      : PROJECTS[PROJECTS.length - 1];
  const nextProject =
    currentIndex < PROJECTS.length - 1
      ? PROJECTS[currentIndex + 1]
      : PROJECTS[0];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(locale, breadcrumbs)} />
      <JsonLd data={getProjectDetailSchema(locale, project)} />

      {/* Ambient background glows */}
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main
        className="flex-1 pt-32 sm:pt-36 lg:pt-40 pb-24 sm:pb-32"
        id="main-content"
      >
        <div className="portfolio-container">
          {/* Top Breadcrumb & Share Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs sm:text-sm">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-semibold text-[var(--primary-light)]"
            >
              <Link
                href={getLocalizedHref("/")}
                className="hover:text-[var(--text-bright)] transition-colors"
              >
                {t("nav.home")}
              </Link>
              <span className="opacity-40" aria-hidden="true">
                /
              </span>
              <Link
                href={getLocalizedHref("/projects")}
                className="hover:text-[var(--text-bright)] transition-colors"
              >
                {t("nav.projects")}
              </Link>
              <span className="opacity-40" aria-hidden="true">
                /
              </span>
              <span className="text-[var(--text)] line-clamp-1">
                {displayTitle}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 px-3 rounded-lg text-xs gap-1.5 cursor-pointer bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-3)]"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {copied ? t("projects.copied") : t("projects.shareProject")}
                </span>
              </Button>
            </div>
          </div>

          {/* Project Header Info */}
          <header className="mb-10 text-start">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                <span className="uppercase tracking-wider">
                  {project.category}
                </span>
              </Badge>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t("projects.statusActive")}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-bright)] tracking-tight mb-4">
              {displayTitle}
            </h1>

            <p className="text-base sm:text-xl text-[var(--muted)] max-w-3xl leading-relaxed mb-8">
              {project.summary[locale]}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.botUrl && (
                <Button
                  size="lg"
                  asChild
                  className="rounded-xl h-12 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/30 font-bold cursor-pointer"
                >
                  <a
                    href={project.botUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.892.527 3.662 1.442 5.174L2.1 21.9a.75.75 0 00.9.9l4.726-1.342A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1.25 14.25a.75.75 0 01-1.06 0l-3.25-3.25a.75.75 0 111.06-1.06l2.72 2.72 5.72-5.72a.75.75 0 111.06 1.06l-6.25 6.25z" />
                    </svg>
                    <span>{t("botProjects.openInBale")}</span>
                    {project.botId && (
                      <span className="opacity-90 text-xs font-normal">
                        ({project.botId})
                      </span>
                    )}
                  </a>
                </Button>
              )}

              {project.npmUrl && (
                <Button
                  size="lg"
                  asChild
                  className="rounded-xl h-12 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/30 font-bold cursor-pointer"
                >
                  <a
                    href={project.npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M0 7.334v9.332h7.334V12H10v4.666h14V7.334H0zm4.667 7.333H2.333V9.667h2.334v5zm4.666-4.667H7.333V9.667h2v5zm4.667 4.667h-2.333V9.667h2.333v5zm4.667 0H16.333V9.667h2.334v5z" />
                    </svg>
                    <span>{t("packageProjects.openInNpm")}</span>
                  </a>
                </Button>
              )}

              {project.liveUrl && !project.botUrl && !project.npmUrl && (
                <Button
                  size="lg"
                  asChild
                  className="rounded-xl h-12 px-6 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-lg shadow-[var(--primary)]/25 font-bold cursor-pointer"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t("projects.liveDemo")}</span>
                  </a>
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-xl h-12 px-6 border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:text-[var(--text-bright)] hover:border-[var(--primary)] font-semibold cursor-pointer"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>{t("projects.github")}</span>
                  </a>
                </Button>
              )}

              <Button
                variant="ghost"
                size="lg"
                asChild
                className="rounded-xl h-12 px-5 text-[var(--muted)] hover:text-[var(--text-bright)]"
              >
                <Link href={getLocalizedHref("/projects")}>
                  {isRTL ? (
                    <ArrowRight className="w-4 h-4 me-2" />
                  ) : (
                    <ArrowLeft className="w-4 h-4 me-2" />
                  )}
                  <span>{t("projects.backToProjects")}</span>
                </Link>
              </Button>
            </div>
          </header>

          {/* Hero Showcase Image */}
          <div className="relative w-full aspect-video sm:aspect-[21/9] max-h-[560px] rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-2xl mb-14">
            <Image
              src={project.image}
              alt={`${displayTitle} Showcase`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>

          {/* Two-Column Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 text-start">
            {/* Main Content Area (8 cols on large screens) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Comprehensive Description / Overview */}
              <section className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-bright)] mb-5 flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-[var(--primary-light)]" />
                  <span>{t("projects.overview")}</span>
                </h2>
                <div className="prose prose-invert max-w-none text-sm sm:text-base text-[var(--text)] leading-relaxed space-y-4">
                  <p>{project.description[locale]}</p>
                </div>

                {/* Key Benchmark Alert */}
                {project.metrics && (
                  <div className="mt-8 p-5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-start gap-4">
                    <Activity className="w-6 h-6 text-[var(--primary-light)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-light)] mb-1">
                        {t("projects.keyBenchmark")}
                      </h4>
                      <p className="text-sm sm:text-base font-semibold text-[var(--text-bright)]">
                        {project.metrics[locale]}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Key Features Section */}
              <section className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-bright)] mb-6 flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[var(--primary-light)]" />
                  <span>{t("projects.keyFeatures")}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features[locale].map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]/70 hover:border-[var(--primary)]/40 transition-colors flex items-start gap-3.5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[var(--text)] leading-relaxed font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical Challenges & Solutions */}
              {project.challenges && project.challenges.length > 0 && (
                <section className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-bright)] mb-6 flex items-center gap-2.5">
                    <Cpu className="w-5 h-5 text-[var(--primary-light)]" />
                    <span>{t("projects.challengesTitle")}</span>
                  </h2>

                  <div className="space-y-5">
                    {project.challenges.map((challenge, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]/70 space-y-3"
                      >
                        <h4 className="text-sm sm:text-base font-bold text-[var(--text-bright)] flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[var(--primary)]/20 text-[var(--primary-light)] text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{challenge.title[locale]}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed ps-8">
                          {challenge.solution[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Specifications Area (4 cols on large screens) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Quick Specs Card */}
              <Card className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                <h3 className="text-lg font-bold text-[var(--text-bright)] mb-5 pb-3 border-b border-[var(--border)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--primary-light)]" />
                  <span>{t("projects.quickSpecs")}</span>
                </h3>

                <dl className="space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/40">
                    <dt className="text-[var(--muted)]">
                      {t("projects.categoryLabel")}
                    </dt>
                    <dd className="font-semibold text-[var(--text-bright)] capitalize">
                      {project.category}
                    </dd>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/40">
                    <dt className="text-[var(--muted)]">
                      {t("projects.roleLabel")}
                    </dt>
                    <dd className="font-semibold text-[var(--text-bright)]">
                      {project.category === "bot"
                        ? "Python Backend & Bot Architect"
                        : project.category === "package"
                          ? "Package Author & Maintainer"
                          : "Lead Frontend Engineer"}
                    </dd>
                  </div>

                  {project.installCommand && (
                    <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/40">
                      <dt className="text-[var(--muted)]">
                        {t("packageProjects.npmBadge")}
                      </dt>
                      <dd className="font-semibold text-indigo-400">
                        {project.installCommand}
                      </dd>
                    </div>
                  )}

                  {project.botId && (
                    <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/40">
                      <dt className="text-[var(--muted)]">
                        {t("botProjects.botIdPrefix")}
                      </dt>
                      <dd className="font-semibold text-emerald-400">
                        {project.botId}
                      </dd>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/40">
                    <dt className="text-[var(--muted)]">
                      {t("projects.statusLabel")}
                    </dt>
                    <dd className="font-semibold text-emerald-400">
                      {t("projects.statusActive")}
                    </dd>
                  </div>

                  {project.liveUrl && (
                    <div className="py-2">
                      <dt className="text-[var(--muted)] mb-1.5">
                        {t("projects.liveDemo")}
                      </dt>
                      <dd>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary)] dark:text-[var(--primary-light)] hover:text-[var(--primary-dark)] dark:hover:text-white hover:underline truncate block font-medium"
                        >
                          {project.liveUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}

                  {project.githubUrl && (
                    <div className="py-2">
                      <dt className="text-[var(--muted)] mb-1.5">
                        {t("projects.github")}
                      </dt>
                      <dd>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary)] dark:text-[var(--primary-light)] hover:text-[var(--primary-dark)] dark:hover:text-white hover:underline truncate block font-medium"
                        >
                          {project.githubUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>

              {/* Detailed Tech Stack breakdown */}
              {project.techStackDetailed && (
                <Card className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                  <h3 className="text-lg font-bold text-[var(--text-bright)] mb-5 pb-3 border-b border-[var(--border)]">
                    {t("projects.techStackTitle")}
                  </h3>

                  <div className="space-y-5">
                    {project.techStackDetailed.map((stackGroup, idx) => (
                      <div key={idx}>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-light)] mb-2.5">
                          {stackGroup.category[locale]}
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {stackGroup.items.map((item) => (
                            <Badge
                              key={item}
                              variant="primarySubtle"
                              className="px-2.5 py-1 text-xs"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Other Projects Quick Switcher */}
              <Card className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                <h3 className="text-lg font-bold text-[var(--text-bright)] mb-4 pb-3 border-b border-[var(--border)]">
                  {t("projects.title")}
                </h3>
                <div className="space-y-3">
                  {PROJECTS.filter((p) => p.id !== project.id).map((other) => (
                    <Link
                      key={other.id}
                      href={getLocalizedHref(`/projects/${other.id}`)}
                      className="group p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]/60 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all flex items-center gap-3.5"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0">
                        <Image
                          src={other.image}
                          alt={other.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[var(--text-bright)] group-hover:text-[var(--primary-light)] transition-colors truncate">
                          {locale === "fa" && other.titleFa
                            ? other.titleFa
                            : other.title}
                        </h4>
                        <p className="text-xs text-[var(--muted)] truncate">
                          {other.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Prev / Next Navigation Bar */}
          <div className="mt-16 sm:mt-24 pt-8 border-t border-[var(--border)]/60 flex items-center justify-between gap-4 flex-wrap">
            <Link
              href={getLocalizedHref(`/projects/${prevProject.id}`)}
              className="group inline-flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)] transition-all cursor-pointer"
            >
              {isRTL ? (
                <ArrowRight className="w-5 h-5 text-[var(--primary-light)] group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowLeft className="w-5 h-5 text-[var(--primary-light)] group-hover:-translate-x-1 transition-transform" />
              )}
              <div className="text-start">
                <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] block">
                  {t("projects.prevProject")}
                </span>
                <span className="text-sm font-bold text-[var(--text-bright)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)] transition-colors">
                  {locale === "fa" && prevProject.titleFa
                    ? prevProject.titleFa
                    : prevProject.title}
                </span>
              </div>
            </Link>

            <Link
              href={getLocalizedHref(`/projects/${nextProject.id}`)}
              className="group inline-flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)] transition-all cursor-pointer ms-auto"
            >
              <div className="text-end">
                <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] block">
                  {t("projects.nextProject")}
                </span>
                <span className="text-sm font-bold text-[var(--text-bright)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)] transition-colors">
                  {locale === "fa" && nextProject.titleFa
                    ? nextProject.titleFa
                    : nextProject.title}
                </span>
              </div>
              {isRTL ? (
                <ArrowLeft className="w-5 h-5 text-[var(--primary-light)] group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 text-[var(--primary-light)] group-hover:translate-x-1 transition-transform" />
              )}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
