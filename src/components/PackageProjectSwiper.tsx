"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Navigation,
  Pagination,
  Autoplay,
  Keyboard,
  A11y,
} from "swiper/modules";
import { useI18n } from "@/i18n/client";
import { Project } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Check,
  Copy,
  Activity,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Custom NPM SVG Logo
function NpmLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 7.334v9.332h7.334V12H10v4.666h14V7.334H0zm4.667 7.333H2.333V9.667h2.334v5zm4.666-4.667H7.333V9.667h2v5zm4.667 4.667h-2.333V9.667h2.333v5zm4.667 0H16.333V9.667h2.334v5z" />
    </svg>
  );
}

interface PackageProjectSwiperProps {
  projects: Project[];
}

export const PackageProjectSwiper: React.FC<PackageProjectSwiperProps> = ({
  projects,
}) => {
  const { locale, t, isRTL, getLocalizedHref } = useI18n();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (command: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(command);
      setCopiedCmd(command);
      setTimeout(() => setCopiedCmd(null), 2500);
    }
  };

  return (
    <div className="relative w-full max-w-full mx-auto">
      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-indigo-400">
            <Package className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>
              {projects.length} {t("packageProjects.label")}
            </span>
          </span>
        </div>

        {/* Prev & Next Custom Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label={
              isRTL ? t("projects.nextProject") : t("projects.prevProject")
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              isBeginning
                ? "border-[var(--border)] text-[var(--muted-2)] opacity-35 cursor-not-allowed"
                : "border-indigo-500/40 bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-indigo-500/15 hover:border-indigo-500 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-indigo-950/20"
            }`}
          >
            {isRTL ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label={
              isRTL ? t("projects.prevProject") : t("projects.nextProject")
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              isEnd
                ? "border-[var(--border)] text-[var(--muted-2)] opacity-35 cursor-not-allowed"
                : "border-indigo-500/40 bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-indigo-500/15 hover:border-indigo-500 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-indigo-950/20"
            }`}
          >
            {isRTL ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Swiper Slider Wrapper */}
      <div className="w-full max-w-full overflow-hidden pb-4">
        <Swiper
          key={isRTL ? "rtl-package-swiper" : "ltr-package-swiper"}
          dir={isRTL ? "rtl" : "ltr"}
          modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          keyboard={{ enabled: true }}
          grabCursor={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "custom-swiper-bullet",
            bulletActiveClass: "custom-swiper-bullet-active",
          }}
          watchOverflow={false}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 22,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 26,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
          }}
          className="portfolio-swiper w-full"
        >
          {projects.map((project) => {
            const projectUrl = getLocalizedHref(`/projects/${project.id}`);
            const displayTitle =
              locale === "fa" && project.titleFa
                ? project.titleFa
                : project.title;

            const installCmd = project.installCommand || `npm i ${project.packageName || project.id}`;

            return (
              <SwiperSlide
                key={project.id}
                className="h-auto !w-full max-w-[371px] shrink-0"
              >
                <Card className="group h-full w-full max-w-[371px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/15 flex flex-col text-start p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative select-none">
                  {/* Card Image Banner */}
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[var(--surface-2)]">
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
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/35 opacity-75 group-hover:opacity-55 transition-opacity" />
                    </Link>

                    {/* NPM Category Pill Tag */}
                    <div className="absolute top-3.5 start-3.5 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-950/80 backdrop-blur-md text-red-200 border border-red-500/30 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <NpmLogo className="w-3.5 h-3.5 text-red-400" />
                        <span>{t("packageProjects.npmBadge")}</span>
                      </span>
                    </div>

                    {/* Copy Install Command pill on top end */}
                    <div className="absolute top-3.5 end-3.5 z-10 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy(installCmd);
                        }}
                        className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/75 backdrop-blur-md border border-white/20 text-indigo-300 hover:bg-indigo-950 hover:border-indigo-400 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        title={t("packageProjects.copyInstall")}
                      >
                        {copiedCmd === installCmd ? (
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
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="primarySubtle"
                            className="px-2.5 py-0.5 text-[11px] font-medium border-indigo-500/20 text-indigo-300 bg-indigo-500/10"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Title */}
                      <Link
                        href={projectUrl}
                        className="block group-hover:text-indigo-400 transition-colors"
                      >
                        <h3 className="text-xl sm:text-2xl font-black text-[var(--text-bright)] mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">
                          {displayTitle}
                        </h3>
                      </Link>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-3 mb-4">
                        {project.summary[locale]}
                      </p>
                    </div>

                    {/* Key Benchmark highlight if available */}
                    {project.metrics && (
                      <div className="mb-4 p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center gap-2 text-xs text-indigo-200">
                        <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="line-clamp-1 font-medium text-[11px] sm:text-xs">
                          {project.metrics[locale]}
                        </span>
                      </div>
                    )}

                    {/* Card Footer: Navigate to Details & Actions */}
                    <div className="pt-3.5 border-t border-[var(--border)]/50 flex items-center justify-between gap-3">
                      <Link
                        href={projectUrl}
                        className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{t("projects.viewDetails")}</span>
                        {isRTL ? (
                          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        )}
                      </Link>

                      <div className="flex items-center gap-2">
                        {project.npmUrl && (
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

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all cursor-pointer"
                            aria-label={`${project.title} GitHub`}
                            title={t("projects.github")}
                          >
                            <svg
                              className="w-3.5 h-3.5 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};
