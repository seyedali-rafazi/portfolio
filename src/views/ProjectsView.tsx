"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectModal } from "@/components/ProjectModal";
import { useI18n } from "@/i18n/client";
import { PROJECTS } from "@/data/portfolioData";
import { Project } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import type { Locale } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsViewProps {
  locale: Locale;
}

export function ProjectsView({ locale }: ProjectsViewProps) {
  const { t, isRTL, getLocalizedHref } = useI18n();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const breadcrumbs = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.projects"), path: "/projects" },
  ];

  const categories = [
    { id: "all", label: t("projects.filterAll") },
    { id: "geospatial", label: t("projects.filterGeo") },
    { id: "fullstack", label: t("projects.filterFullstack") },
    { id: "bot", label: t("projects.filterBot") },
    { id: "package", label: t("projects.filterPackage") },
  ];

  const filtered =
    activeCategory === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(locale, breadcrumbs)} />
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-36 sm:pt-40 lg:pt-44 pb-24 sm:pb-32" id="main-content">
        <div className="portfolio-container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--primary-light)] mb-6">
            <Link href={getLocalizedHref("/")} className="hover:text-[var(--text-bright)] transition-colors">
              {t("nav.home")}
            </Link>
            <span className="opacity-40" aria-hidden="true">/</span>
            <span className="text-[var(--text)]">{t("nav.projects")}</span>
          </nav>

          {/* Heading */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--border)]/40 pb-10 mb-12 text-start">
            <div>
              <Badge variant="primarySubtle" className="mb-3 px-3 py-1 text-xs">
                {t("projects.label")}
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-bright)] tracking-tight mb-4">
                {t("projects.pageHeading")}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
                {t("projects.pageSubheading")}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Project Categories">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer transition-colors focus:outline-none ${
                      isActive
                        ? "text-white"
                        : "text-[var(--text)] hover:text-[var(--text-bright)] bg-[var(--surface-2)] border border-[var(--border)]"
                    }`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterPill"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 bg-[var(--primary)] rounded-xl shadow-lg shadow-[var(--primary)]/30 -z-0"
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </header>

          {/* Grid with Framer Motion layout animations */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => {
                const imageAlt = `${project.title} — ${project.summary[locale]}`;
                const projectUrl = getLocalizedHref(`/projects/${project.id}`);
                const displayTitle = locale === "fa" && project.titleFa ? project.titleFa : project.title;

                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={projectUrl}
                      className="block group h-full"
                    >
                      <Card className="h-full overflow-hidden transition-colors hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/15 flex flex-col cursor-pointer text-start p-0 rounded-2xl">
                        {/* Card Image */}
                        <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[var(--surface-2)]">
                          <Image
                            src={project.image}
                            alt={imageAlt}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Card Content */}
                        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag) => (
                                <Badge key={tag} variant="primarySubtle" className="px-3 py-1 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-bright)] mb-3 group-hover:text-[var(--primary-light)] transition-colors">
                              {displayTitle}
                            </h2>

                            {/* Description */}
                            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3 mb-6">
                              {project.summary[locale]}
                            </p>
                          </div>

                          {/* Action Link */}
                          <div className="mt-auto pt-4 border-t border-[var(--border)]/50 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary-light)] group-hover:text-[var(--primary-dark)] dark:group-hover:text-white inline-flex items-center gap-2 transition-colors">
                              <span>{t("projects.viewDetails")}</span>
                              {isRTL ? (
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                              ) : (
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              )}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Footer />
    </>
  );
}
