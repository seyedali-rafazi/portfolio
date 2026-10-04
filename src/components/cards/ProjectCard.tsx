"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { Project } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BaleLogo, NpmLogo, GitHubLogo } from "@/components/icons/BrandLogos";
import {
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Activity,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectCardVariant = "auto" | "default" | "bot" | "package";

export interface ProjectCardProps {
  project: Project;
  variant?: ProjectCardVariant;
  className?: string;
  imagePriority?: boolean;
}

/**
 * Resolves the visual variant based on explicit prop or project metadata
 */
export function resolveProjectCardVariant(
  project: Project,
  variant: ProjectCardVariant = "auto",
): "default" | "bot" | "package" {
  if (variant !== "auto") return variant;
  if (project.category === "bot") return "bot";
  if (project.category === "package") return "package";
  return "default";
}

/* =========================================================================
   Subcomponent: ProjectCardMedia (Banner, Badges & Quick Action Buttons)
   ========================================================================= */

interface ProjectCardMediaProps {
  project: Project;
  variant: "default" | "bot" | "package";
  projectUrl: string;
  displayTitle: string;
  imagePriority?: boolean;
}

export const ProjectCardMedia: React.FC<ProjectCardMediaProps> = ({
  project,
  variant,
  projectUrl,
  displayTitle,
  imagePriority = false,
}) => {
  const { locale, t } = useI18n();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const installCmd =
    project.installCommand || `npm i ${project.packageName || project.id}`;

  return (
    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[var(--surface-2)]">
      {/* Clickable Image Banner */}
      <Link
        href={projectUrl}
        className="absolute inset-0 z-0 block cursor-pointer"
        aria-label={displayTitle}
      >
        <Image
          src={project.image}
          alt={`${displayTitle} — ${project.summary[locale]}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={imagePriority}
        />
        <div
          className={cn(
            "absolute inset-0 transition-opacity",
            variant === "default"
              ? "bg-gradient-to-t from-[var(--surface)] via-transparent to-black/30 opacity-70 group-hover:opacity-50"
              : "bg-gradient-to-t from-[var(--surface)] via-transparent to-black/35 opacity-75 group-hover:opacity-55",
          )}
        />
      </Link>

      {/* Top-Start Category / Platform Badge */}
      <div className="absolute top-3.5 start-3.5 z-10 pointer-events-none">
        {variant === "bot" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <BaleLogo className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("botProjects.baleBadge")}</span>
          </span>
        ) : variant === "package" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-950/80 backdrop-blur-md text-red-200 border border-red-500/30 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <NpmLogo className="w-3.5 h-3.5 text-red-400" />
            <span>{t("packageProjects.npmBadge")}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-[var(--primary-light)] border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            {project.category}
          </span>
        )}
      </div>

      {/* Top-End Action Badge (Live Demo / Copy Bot ID / Copy NPM Command) */}
      <div className="absolute top-3.5 end-3.5 z-10 flex items-center gap-1.5">
        {variant === "bot" && project.botId && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCopy(project.botId!, "botId");
            }}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md border border-white/20 text-emerald-300 hover:bg-emerald-950 hover:border-emerald-400 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            title={t("botProjects.copyHandle")}
          >
            {copiedKey === "botId" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">
                  {t("botProjects.copied")}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-300" />
                <span>{project.botId}</span>
              </>
            )}
          </button>
        )}

        {variant === "package" && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCopy(installCmd, "installCmd");
            }}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/75 backdrop-blur-md border border-white/20 text-indigo-300 hover:bg-indigo-950 hover:border-indigo-400 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            title={t("packageProjects.copyInstall")}
          >
            {copiedKey === "installCmd" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">
                  {t("packageProjects.copiedInstall")}
                </span>
              </>
            ) : (
              <>
                <Terminal className="w-3 h-3 text-slate-300" />
                <span>{installCmd}</span>
                <Copy className="w-3 h-3 text-slate-400 ms-0.5" />
              </>
            )}
          </button>
        )}

        {variant === "default" && project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-pointer shadow-md"
            title={t("projects.liveDemo")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   Subcomponent: ProjectCardBody (Tags, Title, Summary & Benchmark Metric)
   ========================================================================= */

interface ProjectCardBodyProps {
  project: Project;
  variant: "default" | "bot" | "package";
  projectUrl: string;
  displayTitle: string;
}

export const ProjectCardBody: React.FC<ProjectCardBodyProps> = ({
  project,
  variant,
  projectUrl,
  displayTitle,
}) => {
  const { locale } = useI18n();

  return (
    <div>
      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.slice(0, 4).map((tag) => (
          <Badge
            key={tag}
            variant="primarySubtle"
            className={cn(
              "px-2.5 py-0.5 text-[11px] font-medium",
              variant === "bot" &&
                "border-emerald-500/20 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10",
              variant === "package" &&
                "border-indigo-500/20 text-indigo-700 dark:text-indigo-300 bg-indigo-500/10",
            )}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <Link
        href={projectUrl}
        className={cn(
          "block transition-colors",
          variant === "bot" &&
            "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
          variant === "package" &&
            "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
          variant === "default" &&
            "group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)]",
        )}
      >
        <h3
          className={cn(
            "text-xl sm:text-2xl font-black text-[var(--text-bright)] mb-2 tracking-tight transition-colors",
            variant === "bot" &&
              "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
            variant === "package" &&
              "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
            variant === "default" &&
              "group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)]",
          )}
        >
          {displayTitle}
        </h3>
      </Link>

      {/* Summary */}
      <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-3 mb-4">
        {project.summary[locale]}
      </p>

      {/* Benchmark Metric Pill if Available */}
      {project.metrics && (
        <div
          className={cn(
            "mb-4 p-2.5 rounded-xl border flex items-center gap-2 text-xs",
            variant === "bot" &&
              "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-200",
            variant === "package" &&
              "bg-indigo-500/10 dark:bg-indigo-950/20 border-indigo-500/30 text-indigo-800 dark:text-indigo-200",
            variant === "default" &&
              "bg-[var(--surface-2)] border-[var(--border)]/70 text-[var(--text)]",
          )}
        >
          <Activity
            className={cn(
              "w-3.5 h-3.5 shrink-0",
              variant === "bot" && "text-emerald-600 dark:text-emerald-400",
              variant === "package" && "text-indigo-600 dark:text-indigo-400",
              variant === "default" &&
                "text-[var(--primary)] dark:text-[var(--primary-light)]",
            )}
          />
          <span className="line-clamp-1 font-medium text-[11px] sm:text-xs">
            {project.metrics[locale]}
          </span>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   Subcomponent: ProjectCardFooter (View Details Link & External Actions)
   ========================================================================= */

interface ProjectCardFooterProps {
  project: Project;
  variant: "default" | "bot" | "package";
  projectUrl: string;
}

export const ProjectCardFooter: React.FC<ProjectCardFooterProps> = ({
  project,
  variant,
  projectUrl,
}) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="pt-3.5 border-t border-[var(--border)]/50 flex items-center justify-between gap-3">
      {/* Navigate to Details Link */}
      <Link
        href={projectUrl}
        className={cn(
          "text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer",
          variant === "bot" &&
            "text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white",
          variant === "package" &&
            "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white",
          variant === "default" &&
            "text-[var(--primary)] dark:text-[var(--primary-light)] group-hover:text-[var(--primary-dark)] dark:group-hover:text-white",
        )}
      >
        <span>{t("projects.viewDetails")}</span>
        {isRTL ? (
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        )}
      </Link>

      {/* External Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Bale Bot Launch Button */}
        {variant === "bot" && project.botUrl && (
          <a
            href={project.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            title={t("botProjects.openInBale")}
          >
            <BaleLogo className="w-3.5 h-3.5" />
          </a>
        )}

        {/* NPM Package Launch Button */}
        {variant === "package" && project.npmUrl && (
          <a
            href={project.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all cursor-pointer"
            title={t("packageProjects.openInNpm")}
          >
            <NpmLogo className="w-3.5 h-3.5" />
          </a>
        )}

        {/* GitHub Repository Link */}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text-bright)] transition-all cursor-pointer",
              variant === "bot" &&
                "hover:border-emerald-500 hover:bg-emerald-500/10",
              variant === "package" &&
                "hover:border-indigo-500 hover:bg-indigo-500/10",
              variant === "default" &&
                "hover:border-[var(--primary)] hover:bg-[var(--primary)]/10",
            )}
            aria-label={`${project.title} GitHub`}
            title={t("projects.github")}
          >
            <GitHubLogo className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Live Demo Link (for default variant) */}
        {variant === "default" && project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--primary)] dark:hover:text-white hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer"
            aria-label={`${project.title} Live Demo`}
            title={t("projects.liveDemo")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   Main Component: ProjectCard
   ========================================================================= */

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = "auto",
  className,
  imagePriority = false,
}) => {
  const { locale, getLocalizedHref } = useI18n();
  const effectiveVariant = resolveProjectCardVariant(project, variant);
  const projectUrl = getLocalizedHref(`/projects/${project.id}`);
  const displayTitle =
    locale === "fa" && project.titleFa ? project.titleFa : project.title;

  return (
    <Card
      className={cn(
        "group h-full w-full max-w-[371px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col text-start p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative select-none",
        effectiveVariant === "bot" &&
          "hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/15",
        effectiveVariant === "package" &&
          "hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/15",
        effectiveVariant === "default" &&
          "hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/20",
        className,
      )}
    >
      {/* Banner / Media */}
      <ProjectCardMedia
        project={project}
        variant={effectiveVariant}
        projectUrl={projectUrl}
        displayTitle={displayTitle}
        imagePriority={imagePriority}
      />

      {/* Card Content & Footer */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <ProjectCardBody
          project={project}
          variant={effectiveVariant}
          projectUrl={projectUrl}
          displayTitle={displayTitle}
        />

        <ProjectCardFooter
          project={project}
          variant={effectiveVariant}
          projectUrl={projectUrl}
        />
      </div>
    </Card>
  );
};

/* =========================================================================
   Preset Wrappers for Specialized Modular Usage
   ========================================================================= */

export const BotProjectCard: React.FC<Omit<ProjectCardProps, "variant">> = (
  props,
) => <ProjectCard {...props} variant="bot" />;

export const PackageProjectCard: React.FC<Omit<ProjectCardProps, "variant">> = (
  props,
) => <ProjectCard {...props} variant="package" />;
