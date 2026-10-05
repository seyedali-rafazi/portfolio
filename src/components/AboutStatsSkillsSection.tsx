"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { STATS, SKILLS } from "@/data/portfolioData";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { Skill } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toPersianDigits } from "@/lib/numbers";

export const AboutStatsSkillsSection: React.FC = () => {
  const { locale, t, isRTL, getLocalizedHref } = useI18n();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const renderSkillIcon = (id: string, color: string) => {
    switch (id) {
      case "react":
        return (
          <svg className="w-5 h-5" viewBox="0 0 115.3 100" fill="none">
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
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="fill-zinc-900 dark:fill-white" />
            <path
              d="M15.5 16.5L8.5 7.5H7v9h1.5v-6.5l7 9h1.5v-9H15.5v6.5z"
              className="fill-white dark:fill-zinc-900"
            />
          </svg>
        );
      case "typescript":
        return (
          <span className="font-bold text-xs tracking-tight text-[#3178C6] bg-[#3178C6]/15 px-1 py-0.5 rounded">
            TS
          </span>
        );
      case "javascript":
        return (
          <span className="font-bold text-xs tracking-tight text-[#F7DF1E] bg-[#F7DF1E]/15 px-1 py-0.5 rounded">
            JS
          </span>
        );
      case "redux":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" opacity="0.3" />
            <path d="M12 6a6 6 0 1 0 6 6" />
            <circle cx="12" cy="12" r="2" fill={color} />
          </svg>
        );
      case "react-query":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" strokeDasharray="2 2" />
            <path d="M3 12h18" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="3" fill={color} />
          </svg>
        );
      case "mapbox":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={color}>
            <path d="M12 2L4 20l8-4 8 4L12 2z" />
          </svg>
        );
      case "leaflet":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 22C12 22 20 18 20 10C20 4.5 15.5 2 12 2C8.5 2 4 4.5 4 10C4 18 12 22 12 22Z" />
            <path d="M12 2v20" />
            <path d="M12 14c3-2 5-3 5-5" />
            <path d="M12 17c-3-2-5-3-5-5" />
          </svg>
        );
      case "cesium":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case "tailwind":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={color}>
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
          </svg>
        );
      case "git":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
        );
      case "docker":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={color}>
            <path d="M4 10h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm-6-3h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm3 3h2v2h-2zm1 3c-.5-1-1.6-1.5-2.6-1.5H3.5C2.1 14.5 1 15.6 1 17c0 2.2 1.8 4 4 4h12c3.3 0 6-2.7 6-6 0-.4-.1-.8-.2-1.2-.5.2-1.1.2-1.8.2z" />
          </svg>
        );
      default:
        return <Layers className="w-4 h-4 text-[var(--primary-light)]" />;
    }
  };

  return (
    <section id="about" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="portfolio-container">
        {/* ================= ROW 1: ABOUT ME (7 COLS) & STATS (5 COLS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-20 sm:mb-24">
          {/* About Me Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <Card className="h-full flex flex-col justify-between p-8 sm:p-10 lg:p-12 text-start shadow-xl rounded-2xl">
              <div>
                {/* Section Tag */}
                <div className="mb-3">
                  <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    <span>{t("about.label")}</span>
                  </Badge>
                </div>

                {/* Section Title */}
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight mb-5">
                  {t("about.title")}
                </h2>

                {/* Content text */}
                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
                  <p className="text-[var(--text)] leading-relaxed font-normal">
                    {t("about.intro")}
                  </p>
                  <p className="leading-relaxed">
                    {t("about.subIntro")}
                  </p>
                </div>
              </div>

              {/* Learn More Page Link */}
              <div className="pt-6 mt-8 border-t border-[var(--border)]/60 flex items-center justify-between">
                <Link
                  href={getLocalizedHref("/about")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary-light)] hover:text-[var(--primary-dark)] dark:hover:text-white group w-fit transition-colors cursor-pointer"
                >
                  <span>{t("about.learnMore")}</span>
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Stats 2x2 Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-5 h-full">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="p-6 sm:p-7 hover:border-[var(--primary)]/40 transition-colors flex flex-col justify-between shadow-xl group rounded-2xl h-full"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-[var(--primary-light)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4 group-hover:scale-110 transition-transform">
                    {stat.symbol}
                  </div>
                  <div>
                    <div className="text-2xl sm:text-4xl font-black text-[var(--text-bright)] leading-tight tracking-tight mb-1">
                      {locale === "fa" && stat.numberFa ? stat.numberFa : stat.number}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                      {stat.title[locale]}
                    </div>
                    <div className="text-xs text-[var(--muted)] line-clamp-1 mt-0.5">
                      {stat.subtitle[locale]}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= ROW 2: SKILLS SECTION ================= */}
        <div id="skills" className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[var(--border)]/40">
            <div className="text-start">
              <div className="mb-2">
                <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                  <span>{t("skills.label")}</span>
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight">
                {t("skills.title")}
              </h2>
            </div>

            <Link
              href={getLocalizedHref("/skills")}
              className="text-xs sm:text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary-light)] hover:text-[var(--primary-dark)] dark:hover:text-white inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{locale === "fa" ? "مشاهده سطح تسلط همه مهارت‌ها" : "View Detailed Skills"}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>

          {/* Responsive Skills Grid: 6 cols on lg, 4 on md, 3 on sm, 2 on xs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {SKILLS.map((skill, idx) => (
              <motion.button
                key={skill.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.035 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedSkill(skill)}
                className="p-5 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)]/50 min-h-[125px] flex flex-col items-center justify-center gap-3 transition-colors hover:shadow-xl hover:shadow-black/25 group focus:outline-none cursor-pointer"
                title={`${skill.name} - ${skill.level}%`}
              >
                <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  {renderSkillIcon(skill.id, skill.color)}
                </div>
                <div className="text-center w-full">
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-bright)] block truncate">
                    {skill.name}
                  </span>
                  <span className="text-xs text-[var(--primary-light)] font-medium">
                    {locale === "fa" ? toPersianDigits(skill.level) : skill.level}%
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SHADCN SKILL DETAIL DIALOG ================= */}
      <Dialog
        open={Boolean(selectedSkill)}
        onOpenChange={(open) => {
          if (!open) setSelectedSkill(null);
        }}
      >
        {selectedSkill && (
          <DialogContent onClose={() => setSelectedSkill(null)}>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--border)] shrink-0"
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
                  <DialogTitle>{selectedSkill.name}</DialogTitle>
                  <span className="text-[11px] text-[var(--muted)] capitalize">
                    {selectedSkill.category}
                  </span>
                </div>
              </div>
            </DialogHeader>

            {/* Proficiency Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[var(--muted)]">
                  {t("skills.proficiency")}
                </span>
                <span className="font-bold text-[var(--primary-light)]">
                  {locale === "fa" ? toPersianDigits(selectedSkill.level) : selectedSkill.level}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedSkill.level}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      selectedSkill.id === "nextjs"
                        ? "var(--text-bright)"
                        : selectedSkill.color,
                  }}
                />
              </div>
            </div>

            {/* Experience Summary */}
            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3.5 text-xs text-[var(--muted)] leading-relaxed space-y-2">
              <p className="text-[var(--text)] font-medium">
                {selectedSkill.experience[locale]}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSkill(null)}
              >
                {t("skills.close")}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};
