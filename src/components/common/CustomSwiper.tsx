"use client";

import React, { useRef, useState, useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Navigation,
  Pagination,
  Autoplay,
  Keyboard,
  A11y,
} from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { useI18n } from "@/i18n/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type SwiperAccent = "primary" | "emerald" | "indigo" | "rose" | "amber";

export interface CustomSwiperHeaderBadge {
  icon?: React.ReactNode;
  label: React.ReactNode;
}

export interface CustomSwiperControls {
  prev: () => void;
  next: () => void;
  isBeginning: boolean;
  isEnd: boolean;
  swiper: SwiperType | null;
}

export interface CustomSwiperProps<T = any> {
  /** Array of items to render in slides */
  items?: T[];
  /** Render function for each item */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** Custom key extractor for each item slide */
  keyExtractor?: (item: T, index: number) => string | number;
  /** Direct children (alternative to items + renderItem) */
  children?: React.ReactNode;

  /** Header title or badge displayed on top-start */
  headerBadge?: CustomSwiperHeaderBadge;
  /** Custom content placed in header (e.g. extra actions) */
  headerRight?: React.ReactNode;
  /** Full custom header render prop receiving slider controls */
  customHeader?: (controls: CustomSwiperControls) => React.ReactNode;
  /** Whether to render the header bar at all (default: true) */
  showHeader?: boolean;

  /** Whether to show prev/next navigation controls (default: true) */
  showNavigation?: boolean;
  /** Visual accent theme for buttons & highlights */
  accentColor?: SwiperAccent;

  /** Autoplay configuration */
  autoplay?: boolean;
  autoplayDelay?: number;

  /** Responsive breakpoints */
  slidesPerView?: number;
  spaceBetween?: number;
  breakpoints?: Record<number, SwiperOptions>;

  /** Styling classes */
  className?: string;
  slideClassName?: string;
  swiperClassName?: string;
  wrapperClassName?: string;

  /** Custom unique ID or key prefix */
  id?: string;

  /** Callbacks */
  onSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (swiper: SwiperType) => void;
}

const ACCENT_BUTTON_STYLES: Record<SwiperAccent, string> = {
  primary:
    "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-[var(--primary)]/15 hover:border-[var(--primary)] hover:text-white hover:scale-105 active:scale-95 shadow-md",
  emerald:
    "border-emerald-500/40 bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-emerald-500/15 hover:border-emerald-500 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/20",
  indigo:
    "border-indigo-500/40 bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-indigo-500/15 hover:border-indigo-500 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-indigo-950/20",
  rose:
    "border-rose-500/40 bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-rose-500/15 hover:border-rose-500 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-rose-950/20",
  amber:
    "border-amber-500/40 bg-[var(--surface-2)] text-[var(--text-bright)] hover:bg-amber-500/15 hover:border-amber-500 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-amber-950/20",
};

export function CustomSwiper<T = any>({
  items,
  renderItem,
  keyExtractor,
  children,
  headerBadge,
  headerRight,
  customHeader,
  showHeader = true,
  showNavigation = true,
  accentColor = "primary",
  autoplay = true,
  autoplayDelay = 5000,
  slidesPerView = 1,
  spaceBetween = 20,
  breakpoints,
  className,
  slideClassName = "h-auto !w-full max-w-[371px] shrink-0",
  swiperClassName = "portfolio-swiper w-full",
  wrapperClassName = "w-full max-w-full overflow-hidden pb-4",
  id,
  onSwiper,
  onSlideChange,
}: CustomSwiperProps<T>) {
  const autoId = useId();
  const swiperId = id || autoId;
  const { t, isRTL } = useI18n();

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const controls: CustomSwiperControls = {
    prev: handlePrev,
    next: handleNext,
    isBeginning,
    isEnd,
    swiper: swiperRef.current,
  };

  const defaultBreakpoints: Record<number, SwiperOptions> = {
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
  };

  return (
    <div className={cn("relative w-full max-w-full mx-auto", className)}>
      {/* Header Bar */}
      {showHeader && (
        <>
          {customHeader ? (
            customHeader(controls)
          ) : (
            <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
              {/* Header Badge / Item Count */}
              <div className="flex items-center gap-2">
                {headerBadge && (
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider",
                      accentColor === "emerald" && "text-emerald-400",
                      accentColor === "indigo" && "text-indigo-400",
                      accentColor === "primary" && "text-[var(--muted)]",
                      accentColor === "rose" && "text-rose-400",
                      accentColor === "amber" && "text-amber-400"
                    )}
                  >
                    {headerBadge.icon}
                    <span>{headerBadge.label}</span>
                  </span>
                )}
              </div>

              {/* Navigation Controls Bar */}
              <div className="flex items-center gap-2">
                {headerRight}

                {showNavigation && (
                  <>
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={isBeginning}
                      aria-label={
                        isRTL
                          ? t("projects.nextProject")
                          : t("projects.prevProject")
                      }
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer",
                        isBeginning
                          ? "border-[var(--border)] text-[var(--muted-2)] opacity-35 cursor-not-allowed"
                          : ACCENT_BUTTON_STYLES[accentColor]
                      )}
                    >
                      {isRTL ? (
                        <ChevronRight className="w-5 h-5" />
                      ) : (
                        <ChevronLeft className="w-5 h-5" />
                      )}
                    </button>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isEnd}
                      aria-label={
                        isRTL
                          ? t("projects.prevProject")
                          : t("projects.nextProject")
                      }
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer",
                        isEnd
                          ? "border-[var(--border)] text-[var(--muted-2)] opacity-35 cursor-not-allowed"
                          : ACCENT_BUTTON_STYLES[accentColor]
                      )}
                    >
                      {isRTL ? (
                        <ChevronLeft className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Swiper Slider Wrapper */}
      <div className={wrapperClassName}>
        <Swiper
          key={`${isRTL ? "rtl" : "ltr"}-${swiperId}`}
          dir={isRTL ? "rtl" : "ltr"}
          modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            onSwiper?.(swiper);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            onSlideChange?.(swiper);
          }}
          keyboard={{ enabled: true }}
          grabCursor={true}
          autoplay={
            autoplay
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          pagination={{
            clickable: true,
            bulletClass: "custom-swiper-bullet",
            bulletActiveClass: "custom-swiper-bullet-active",
          }}
          watchOverflow={false}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          breakpoints={breakpoints || defaultBreakpoints}
          className={swiperClassName}
        >
          {items && renderItem
            ? items.map((item, index) => {
                const key = keyExtractor
                  ? keyExtractor(item, index)
                  : (item as any)?.id || index;

                return (
                  <SwiperSlide key={key} className={slideClassName}>
                    {renderItem(item, index)}
                  </SwiperSlide>
                );
              })
            : children}
        </Swiper>
      </div>
    </div>
  );
}
