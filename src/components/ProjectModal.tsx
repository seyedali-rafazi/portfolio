"use client";

import React from "react";
import Image from "next/image";
import { useI18n } from "@/i18n/client";
import { Project } from "@/types";
import { X, ExternalLink, CheckCircle2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { locale, t } = useI18n();

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative max-w-3xl w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Header Image */}
        <div className="relative h-72 sm:h-80 w-full bg-[var(--surface-2)] shrink-0 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/40" />

          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="primarySubtle"
                    className="backdrop-blur-sm px-3 py-1 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {project.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Project Body */}
        <div className="p-7 sm:p-9 overflow-y-auto space-y-7">
          {/* Summary / Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--primary-light)] mb-2.5">
              {t("projects.overview")}
            </h4>
            <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
              {project.description[locale]}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--primary-light)] mb-3.5">
              {t("projects.keyFeatures")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {project.features[locale].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--muted)]"
                >
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-light)] shrink-0 mt-0.5" />
                  <span className="leading-snug text-[var(--text)]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="p-4 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-center gap-3.5">
              <Activity className="w-5 h-5 text-[var(--primary-light)] shrink-0" />
              <div className="text-xs sm:text-sm text-[var(--text-bright)] font-semibold">
                <span className="text-[var(--primary-light)] font-bold">
                  {t("projects.keyBenchmark")}
                </span>
                {project.metrics[locale]}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="default"
                  asChild
                  className="rounded-xl h-11 px-5"
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
                    <span>GitHub</span>
                  </a>
                </Button>
              )}
              {project.npmUrl && (
                <Button
                  size="default"
                  asChild
                  className="rounded-xl h-11 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold"
                >
                  <a
                    href={project.npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                      <path d="M0 7.334v9.332h7.334V12H10v4.666h14V7.334H0zm4.667 7.333H2.333V9.667h2.334v5zm4.666-4.667H7.333V9.667h2v5zm4.667 4.667h-2.333V9.667h2.333v5zm4.667 0H16.333V9.667h2.334v5z" />
                    </svg>
                    <span>NPM</span>
                  </a>
                </Button>
              )}
              {project.liveUrl && !project.npmUrl && (
                <Button
                  size="default"
                  asChild
                  className="rounded-xl h-11 px-5"
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
            </div>

            <Button
              variant="ghost"
              size="default"
              onClick={onClose}
              className="h-11 px-5"
            >
              {t("projects.close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
