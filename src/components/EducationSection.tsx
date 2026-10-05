"use client";

import React from "react";
import { useI18n } from "@/i18n/client";
import { EDUCATION } from "@/data/portfolioData";
import { GraduationCap, Calendar, Building2, MapPin, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const EducationSection: React.FC = () => {
  const { locale, t, isRTL } = useI18n();

  return (
    <section
      id="education"
      className="relative pt-12 sm:pt-16 pb-4 text-start"
      aria-label={t("about.educationHeading")}
    >
      {/* Section Header */}
      <div className="mb-10 sm:mb-12">
        <Badge variant="primarySubtle" className="mb-3 px-3 py-1 text-xs gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{t("about.educationBadge")}</span>
        </Badge>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-bright)] tracking-tight mb-3">
          {locale === "fa" ? (
            <>
              تحصیلات و{" "}
              <span className="bg-gradient-to-r from-[var(--primary-light)] to-cyan-400 bg-clip-text text-transparent">
                سوابق دانشگاهی
              </span>
            </>
          ) : (
            <>
              Academic{" "}
              <span className="bg-gradient-to-r from-[var(--primary-light)] to-cyan-400 bg-clip-text text-transparent">
                Education
              </span>
            </>
          )}
        </h2>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-3xl leading-relaxed">
          {t("about.educationSubheading")}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {EDUCATION.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
          >
            <Card className="group relative overflow-hidden h-full p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              {/* Subtle Ambient Hover Glow */}
              <div
                className={`pointer-events-none absolute -top-12 w-48 h-48 rounded-full bg-[var(--primary)]/8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isRTL ? "-left-12" : "-right-12"
                }`}
                aria-hidden="true"
              />

              <div>
                {/* Top Row: Icon & Period */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary-light)] border border-[var(--primary)]/20 shadow-sm shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>

                  <Badge
                    variant="secondary"
                    className="px-3 py-1 gap-1.5 text-xs font-semibold rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                    <span>{edu.period[locale]}</span>
                  </Badge>
                </div>

                {/* Degree Tag */}
                <div className="mb-2">
                  <Badge variant="primarySubtle" className="text-[11px] font-semibold gap-1.5 px-2.5 py-0.5">
                    <Award className="w-3 h-3 text-[var(--primary-light)]" />
                    <span>{edu.degree[locale]}</span>
                  </Badge>
                </div>

                {/* Field of Study */}
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-bright)] leading-snug group-hover:text-[var(--primary-light)] transition-colors mb-4">
                  {edu.field[locale]}
                </h3>
              </div>

              {/* Institution and Location */}
              <div className="pt-4 border-t border-[var(--border)]/50 space-y-2 mt-4">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text)] font-medium">
                  <Building2 className="w-4 h-4 text-[var(--primary-light)] shrink-0 mt-0.5" />
                  <span>{edu.institution[locale]}</span>
                </div>

                {edu.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--muted)]" />
                    <span>{edu.location[locale]}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
