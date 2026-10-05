"use client";

import React from "react";
import { useI18n } from "@/i18n/client";
import { WORK_EXPERIENCES } from "@/data/portfolioData";
import {
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Code2,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const WorkExperienceTimeline: React.FC = () => {
  const { locale, t, isRTL } = useI18n();

  return (
    <section
      id="work-experience"
      className="relative pt-12 sm:pt-16 pb-6 text-start"
      aria-label={t("about.experienceHeading")}
    >
      {/* Section Header */}
      <div className="mb-10 sm:mb-12">
        <Badge variant="primarySubtle" className="mb-3 px-3 py-1 text-xs gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{t("about.experienceBadge")}</span>
        </Badge>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-bright)] tracking-tight mb-3">
          {locale === "fa" ? (
            <>
              سوابق کاری و{" "}
              <span className="bg-gradient-to-r from-[var(--primary-light)] to-cyan-400 bg-clip-text text-transparent">
                تجربیات حرفه‌ای
              </span>
            </>
          ) : (
            <>
              Work{" "}
              <span className="bg-gradient-to-r from-[var(--primary-light)] to-cyan-400 bg-clip-text text-transparent">
                Experience
              </span>
            </>
          )}
        </h2>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-3xl leading-relaxed">
          {t("about.experienceSubheading")}
        </p>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative">
        {/* Continuous Vertical Timeline Line */}
        <div
          className={`absolute top-4 bottom-6 w-0.5 bg-gradient-to-b from-[var(--primary)] via-[var(--primary)]/30 to-transparent ${
            isRTL
              ? "right-3.5 sm:right-5 lg:right-6"
              : "left-3.5 sm:left-5 lg:left-6"
          }`}
          aria-hidden="true"
        />

        <div className="space-y-8 sm:space-y-10">
          {WORK_EXPERIENCES.map((exp, index) => {
            const isCurrent = exp.isCurrent;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                className="relative"
              >
                {/* Timeline Node Indicator */}
                <div
                  className={`absolute top-6 z-10 flex items-center justify-center -translate-x-1/2 ${
                    isRTL
                      ? "right-3.5 sm:right-5 lg:right-6 translate-x-1/2"
                      : "left-3.5 sm:left-5 lg:left-6"
                  }`}
                  aria-hidden="true"
                >
                  {isCurrent ? (
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--primary)] shadow-[0_0_18px_rgba(22,131,255,0.45)]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)]/30 opacity-75" />
                      <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--surface)] border-2 border-[var(--border)] shadow-md group-hover:border-[var(--primary-light)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary-light)]" />
                    </div>
                  )}
                </div>

                {/* Experience Card */}
                <div
                  className={`${
                    isRTL
                      ? "mr-10 sm:mr-14 lg:mr-16"
                      : "ml-10 sm:ml-14 lg:ml-16"
                  }`}
                >
                  <Card className="group relative overflow-hidden p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:shadow-2xl transition-all duration-300">
                    {/* Subtle Ambient Hover Glow */}
                    <div
                      className={`pointer-events-none absolute -top-12 w-48 h-48 rounded-full bg-[var(--primary)]/8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isRTL ? "-left-12" : "-right-12"
                      }`}
                      aria-hidden="true"
                    />

                    {/* Top Row: Role, Badges, Period */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[var(--border)]/50">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-bright)] group-hover:text-[var(--primary-light)] transition-colors">
                            {exp.role[locale]}
                          </h3>

                          {isCurrent && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                              </span>
                              {t("about.currentBadge")}
                            </span>
                          )}

                          <Badge variant="pill" className="text-[11px] font-medium py-0.5 px-2.5">
                            {exp.employmentType[locale]}
                          </Badge>
                        </div>

                        {/* Company & Location */}
                        <div className="flex items-center gap-4 mt-2 flex-wrap text-xs sm:text-sm text-[var(--text)]">
                          <span className="flex items-center gap-1.5 font-semibold text-[var(--primary-light)]">
                            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary-light)]" />
                            {exp.company[locale]}
                          </span>

                          {exp.location && (
                            <span className="flex items-center gap-1 text-[var(--muted)]">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location[locale]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Period Badge */}
                      <div className="self-start sm:self-center shrink-0">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 gap-1.5 text-xs font-semibold rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                          <span>{exp.period[locale]}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Bullet Highlights */}
                    <div className="py-5 space-y-3">
                      {exp.highlights[locale].map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed font-normal">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="pt-4 border-t border-[var(--border)]/50">
                      <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                        <Code2 className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                        <span>{t("about.technologiesLabel")}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary-light)]/40 hover:text-[var(--text-bright)] transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
