"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PROJECTS } from "@/data/portfolioData";
import { Project } from "@/types";
import { ProjectModal } from "./ProjectModal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const ProjectsSection: React.FC = () => {
  const { language, t, isRTL, getLocalizedHref } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="portfolio-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 pb-4 border-b border-[var(--border)]/40">
          <div className="text-start">
            <div className="mb-2">
              <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                <span>{t("projects.label", language === "fa" ? "پروژه‌های منتخب" : "Featured Projects")}</span>
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight">
              {language === "fa" ? "پروژه‌های برجسته و کاربردی" : "Featured Engineering Projects"}
            </h2>
          </div>

          <Link
            href={getLocalizedHref("/projects")}
            className="text-xs sm:text-sm font-semibold text-[var(--primary-light)] hover:text-white inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>{t("projects.viewAll", language === "fa" ? "مشاهده همه پروژه‌ها" : "View All Projects")}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        {/* Projects 3-Column Grid */}
        <div
          id="projectsGrid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9"
        >
          {PROJECTS.map((project) => (
            <Card
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/15 flex flex-col cursor-pointer text-start shadow-xl p-0 rounded-2xl"
            >
              {/* Card Image */}
              <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[var(--surface-2)]">
                <Image
                  src={project.image}
                  alt={
                    language === "fa"
                      ? `${project.title} — ${project.summary.fa}`
                      : `${project.title} — ${project.summary.en}`
                  }
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
                      <Badge
                        key={tag}
                        variant="primarySubtle"
                        className="px-3 py-1 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-bright)] mb-3 group-hover:text-[var(--primary-light)] transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3 mb-6">
                    {project.summary[language]}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-auto pt-4 border-t border-[var(--border)]/50 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[var(--primary-light)] group-hover:text-white inline-flex items-center gap-2 transition-colors">
                    <span>{t("projects.viewProject", language === "fa" ? "مشاهده جزئیات پروژه" : "View Project Details")}</span>
                    {isRTL ? (
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
