"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from "swiper/modules";
import { useI18n } from "@/i18n/client";
import { Project } from "@/types";
import { ArrowLeft, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Sparkles, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProjectSwiperProps {
  projects: Project[];
}

export const ProjectSwiper: React.FC<ProjectSwiperProps> = ({ projects }) => {
  const { locale, t, isRTL, getLocalizedHref } = useI18n();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative w-full max-w-full mx-auto">
      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[var(--muted)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)] animate-pulse" />
            <span>
              {projects.length} {t("projects.filterAll")}
            </span>
          </span>
        </div>

        {/* Prev & Next Custom Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label={isRTL ? t("projects.nextProject") : t("projects.prevProject")}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              isBeginning
                ? "border-[var(--border)] text-[var(--muted-2)] opacity-35 cursor-not-allowed"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-[var(--primary)]/15 hover:border-[var(--primary)] hover:text-white hover:scale-105 active:scale-95 shadow-md"
            }`}
          >
            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label={isRTL ? t("projects.prevProject") : t("projects.nextProject")}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              isEnd
                ? "border-[var(--border)] text-[var(--muted-2)] opacity-35 cursor-not-allowed"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-[var(--primary)]/15 hover:border-[var(--primary)] hover:text-white hover:scale-105 active:scale-95 shadow-md"
            }`}
          >
            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Swiper Slider Wrapper with strictly contained overflow */}
      <div className="w-full max-w-full overflow-hidden pb-4">
        <Swiper
          key={isRTL ? "rtl-swiper" : "ltr-swiper"}
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
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "custom-swiper-bullet",
            bulletActiveClass: "custom-swiper-bullet-active",
          }}
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
            const displayTitle = locale === "fa" && project.titleFa ? project.titleFa : project.title;

            return (
              <SwiperSlide key={project.id} className="h-auto">
                <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/20 flex flex-col text-start p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative select-none">
                  {/* Card Image Banner */}
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[var(--surface-2)]">
                    {/* Main Image Link - contains only image and overlay, NO nested anchors */}
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
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />
                    </Link>

                    {/* Category Pill Tag - Sibling with z-10 */}
                    <div className="absolute top-3.5 start-3.5 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-[var(--primary-light)] border border-white/10 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                        {project.category}
                      </span>
                    </div>

                    {/* Quick Live Link Badge - Sibling with z-10, NOT nested inside Link */}
                    {project.liveUrl && (
                      <div className="absolute top-3.5 end-3.5 z-10">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-pointer shadow-md"
                          title={t("projects.liveDemo")}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
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
                            className="px-2.5 py-0.5 text-[11px] font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Title */}
                      <Link href={projectUrl} className="block group-hover:text-[var(--primary-light)] transition-colors">
                        <h3 className="text-xl sm:text-2xl font-black text-[var(--text-bright)] mb-2 tracking-tight group-hover:text-[var(--primary-light)] transition-colors">
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
                      <div className="mb-4 p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]/70 flex items-center gap-2 text-xs text-[var(--text)]">
                        <Activity className="w-3.5 h-3.5 text-[var(--primary-light)] shrink-0" />
                        <span className="line-clamp-1 font-medium text-[11px] sm:text-xs">{project.metrics[locale]}</span>
                      </div>
                    )}

                    {/* Card Footer: Navigate to Details */}
                    <div className="pt-3.5 border-t border-[var(--border)]/50 flex items-center justify-between gap-3">
                      <Link
                        href={projectUrl}
                        className="text-xs sm:text-sm font-bold text-[var(--primary-light)] group-hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{t("projects.viewDetails")}</span>
                        {isRTL ? (
                          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        )}
                      </Link>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer"
                            aria-label={`${project.title} GitHub`}
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer"
                            aria-label={`${project.title} Live Demo`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
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
