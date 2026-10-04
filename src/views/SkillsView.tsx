"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/client";
import { SKILLS } from "@/data/portfolioData";
import { Skill } from "@/types";
import { Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import type { Locale } from "@/config/site";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsViewProps {
  locale: Locale;
}

export function SkillsView({ locale }: SkillsViewProps) {
  const { t, getLocalizedHref } = useI18n();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const breadcrumbs = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.skills"), path: "/skills" },
  ];

  const categories = [
    { id: "all", label: t("skills.filterAll") },
    { id: "core", label: t("skills.filterCore") },
    { id: "geospatial", label: t("skills.filterGeo") },
    { id: "state-tools", label: t("skills.filterTools") },
  ];

  const filtered =
    selectedCategory === "all"
      ? SKILLS
      : SKILLS.filter((s) => s.category === selectedCategory);

  const renderSkillIcon = (id: string, color: string) => {
    switch (id) {
      case "react":
        return (
          <svg className="w-7 h-7" viewBox="0 0 115.3 100" fill="none" aria-hidden="true">
            <ellipse cx="57.6" cy="50" rx="14" ry="14" fill={color} />
            <ellipse cx="57.6" cy="50" rx="55" ry="21" stroke={color} strokeWidth="6" />
            <ellipse
              cx="57.6"
              cy="50"
              rx="55"
              ry="21"
              stroke={color}
              strokeWidth="6"
              transform="rotate(60 57.6 50)"
            />
            <ellipse
              cx="57.6"
              cy="50"
              rx="55"
              ry="21"
              stroke={color}
              strokeWidth="6"
              transform="rotate(120 57.6 50)"
            />
          </svg>
        );
      case "nextjs":
        return (
          <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="fill-zinc-900 dark:fill-white" />
            <path
              d="M15.5 16.5L8.5 7.5H7v9h1.5v-6.5l7 9h1.5v-9H15.5v6.5z"
              className="fill-white dark:fill-zinc-900"
            />
          </svg>
        );
      case "typescript":
        return (
          <span className="font-bold text-base tracking-tight text-[#3178C6] bg-[#3178C6]/15 px-2 py-0.5 rounded" aria-hidden="true">
            TS
          </span>
        );
      case "javascript":
        return (
          <span className="font-bold text-base tracking-tight text-[#F7DF1E] bg-[#F7DF1E]/15 px-2 py-0.5 rounded" aria-hidden="true">
            JS
          </span>
        );
      case "redux":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" opacity="0.3" />
            <path d="M12 6a6 6 0 1 0 6 6" />
            <circle cx="12" cy="12" r="2" fill={color} />
          </svg>
        );
      case "react-query":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" strokeDasharray="2 2" />
            <path d="M3 12h18" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="3" fill={color} />
          </svg>
        );
      case "mapbox":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        );
      case "leaflet":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d="M12 2C8 6 4 10 4 14a8 8 0 0 0 16 0c0-4-4-8-8-12zm0 18c-3.3 0-6-2.7-6-6 0-2.4 2-5.4 6-9.1 4 3.7 6 6.7 6 9.1 0 3.3-2.7 6-6 6z" />
          </svg>
        );
      case "cesium":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case "tailwind":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
          </svg>
        );
      case "git":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d="M2.6 10.59L10.6 2.6a2.4 2.4 0 0 1 3.4 0l8.4 8.4a2.4 2.4 0 0 1 0 3.4l-8.4 8.4a2.4 2.4 0 0 1-3.4 0l-8-8a2.4 2.4 0 0 1 0-3.41zm8.79 8.79a.8.8 0 0 0 1.13 0l6.78-6.78a.8.8 0 0 0 0-1.13L12.52 4.69a.8.8 0 0 0-1.13 0L7.87 8.21l2.4 2.4a1.6 1.6 0 0 1 1.86 1.86l2.36 2.36a1.6 1.6 0 1 1-1.13 1.13l-2.28-2.28v2.79a1.6 1.6 0 1 1-1.6 0v-3.79a1.6 1.6 0 0 1-.87-.87l-2.4-2.4-1.82 1.82a.8.8 0 0 0 0 1.13l7.9 7.9z" />
          </svg>
        );
      case "docker":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.186-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m21.758 1.487c-.6-.375-1.928-.585-2.885-.585-.36 0-.71.03-1.03.09-1.02.195-2.02.66-2.88 1.35-1.425 1.155-2.46 2.82-2.73 4.665-.045.315-.075.63-.075.96 0 .54.06 1.065.18 1.575a6.87 6.87 0 001.035 2.145c.825 1.095 2 1.875 3.39 2.145 1.155.225 2.475.06 3.63-.48 1.095-.51 1.95-1.35 2.445-2.43.195-.42.315-.885.345-1.365.045-.63-.09-1.365-.45-2.13-.39-.84-1.005-1.575-1.8-2.22-.675-.54-1.47-.96-2.31-1.245" />
          </svg>
        );
      default:
        return <Layers className="w-6 h-6 text-[var(--primary-light)]" aria-hidden="true" />;
    }
  };

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
            <span className="text-[var(--text)]">{t("nav.skills")}</span>
          </nav>

          {/* Heading */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--border)]/40 pb-10 mb-12 text-start">
            <div>
              <Badge variant="primarySubtle" className="mb-3 px-3 py-1 text-xs">
                {t("skills.label")}
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-bright)] tracking-tight mb-4">
                {t("skills.pageHeading")}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
                {t("skills.pageSubheading")}
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Skill Categories">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedCategory(cat.id)}
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
                        layoutId="activeSkillFilterPill"
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

          {/* Detailed Skills Grid with layout animations */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((skill) => (
                <motion.div
                  layout
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 15 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6 }}
                >
                  <Card
                    onClick={() => setSelectedSkill(skill)}
                    className="p-6 sm:p-8 rounded-2xl hover:border-[var(--primary)]/50 transition-colors hover:shadow-2xl hover:shadow-black/25 cursor-pointer flex flex-col justify-between text-start h-full"
                    tabIndex={0}
                    role="button"
                    aria-label={`${skill.name} - ${skill.level}%`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedSkill(skill);
                      }
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--border)] shrink-0"
                          style={{
                            backgroundColor:
                              skill.id === "nextjs"
                                ? "var(--surface-3)"
                                : `${skill.color}15`,
                          }}
                        >
                          {renderSkillIcon(skill.id, skill.color)}
                        </div>
                        <Badge variant="primarySubtle" className="px-3 py-1 text-xs font-bold">
                          {skill.level}%
                        </Badge>
                      </div>

                      <h2 className="text-lg font-bold text-[var(--text-bright)] mb-2">
                        {skill.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-6 line-clamp-2">
                        {skill.experience[locale]}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="w-full h-2 rounded-full bg-[var(--surface-3)] overflow-hidden"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            skill.id === "nextjs"
                              ? "var(--text-bright)"
                              : skill.color,
                        }}
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Accessible Detail Modal via shadcn Dialog */}
      <Dialog open={!!selectedSkill} onOpenChange={(open) => !open && setSelectedSkill(null)}>
        <DialogContent className="max-w-lg p-7 sm:p-9 rounded-2xl">
          {selectedSkill && (
            <>
              <DialogHeader className="flex flex-row items-center gap-4 text-start space-y-0 pb-2">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--border)] shrink-0"
                  style={{
                    backgroundColor:
                      selectedSkill.id === "nextjs"
                        ? "var(--surface-3)"
                        : `${selectedSkill.color}15`,
                  }}
                >
                  {renderSkillIcon(selectedSkill.id, selectedSkill.color)}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-[var(--text-bright)]">
                    {selectedSkill.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-[var(--muted)] capitalize mt-0.5">
                    {selectedSkill.category}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="py-4">
                <div className="flex justify-between text-xs sm:text-sm mb-2 font-medium">
                  <span className="text-[var(--muted)]">
                    {t("skills.proficiency")}
                  </span>
                  <span className="font-bold text-[var(--primary-light)]">
                    {selectedSkill.level}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${selectedSkill.level}%`,
                      backgroundColor:
                        selectedSkill.id === "nextjs"
                          ? "var(--text-bright)"
                          : selectedSkill.color,
                    }}
                  />
                </div>
              </div>

              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5 text-xs sm:text-sm text-[var(--text)] leading-relaxed text-start">
                <p className="font-medium">
                  {selectedSkill.experience[locale]}
                </p>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setSelectedSkill(null)}
                  className="rounded-xl text-xs sm:text-sm px-6 h-11"
                >
                  {t("skills.close")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
