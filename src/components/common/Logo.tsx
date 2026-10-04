"use client";

import React from "react";

export interface LogoProps {
  /**
   * Size presets:
   * - "sm": compact (badge: 32px, text: 18px)
   * - "md": standard for navbar (badge: 38px, text: 22px)
   * - "lg": prominent for hero/footer/modals (badge: 48px, text: 28px)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Visual variant:
   * - "badge": Only the iconic emblem badge with S (blue) and R (black)
   * - "text": Clean typography monogram where S is blue and R is black (adapts in dark mode)
   * - "full": Both the emblem badge and typography monogram together
   */
  variant?: "badge" | "text" | "full";
  /**
   * Optional custom class for outer wrapper
   */
  className?: string;
  /**
   * If true, adds a subtle glow effect around the logo on hover
   */
  withGlow?: boolean;
  /**
   * Optional locale prop (logo always displays SR strictly in LTR)
   */
  locale?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "full",
  className = "",
  withGlow = true,
}) => {
  // Dimension tokens based on size
  const sizeMap = {
    sm: {
      badge: "w-8 h-8 rounded-lg text-sm",
      sText: "text-lg",
      rText: "text-lg",
      gap: "gap-2",
    },
    md: {
      badge: "w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-base sm:text-lg",
      sText: "text-xl sm:text-2xl",
      rText: "text-xl sm:text-2xl",
      gap: "gap-2.5",
    },
    lg: {
      badge: "w-12 h-12 rounded-2xl text-xl",
      sText: "text-3xl",
      rText: "text-3xl",
      gap: "gap-3",
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      dir="ltr"
      className={`inline-flex flex-row items-center ${currentSize.gap} group select-none transition-transform duration-200 ${className}`}
      aria-label="SR Logo"
    >
      {/* 1. Emblem Badge: ALWAYS strictly "SR" (S is Blue #1683ff, R is Black #090d16) */}
      {(variant === "badge" || variant === "full") && (
        <div
          dir="ltr"
          className={`relative ${currentSize.badge} font-black flex flex-row items-center justify-center bg-white dark:bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-slate-200/90 dark:border-slate-300 transition-all duration-300 group-hover:scale-105 shrink-0 ${
            withGlow
              ? "group-hover:shadow-[0_0_18px_rgba(22,131,255,0.45)] group-hover:border-[var(--primary)]"
              : ""
          }`}
          style={{ letterSpacing: "-0.05em" }}
        >
          {/* Subtle inner top-light gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-slate-200/30 pointer-events-none rounded-[inherit]" />

          {/* S in Electric Blue (First letter, left) */}
          <span className="relative z-10 text-[#1683ff] font-black transition-transform duration-200 group-hover:-translate-x-0.5">
            S
          </span>

          {/* R in Deep Black (Second letter, right) */}
          <span className="relative z-10 text-[#090d16] font-black transition-transform duration-200 group-hover:translate-x-0.5">
            R
          </span>
        </div>
      )}

      {/* 2. Typographic Wordmark: ALWAYS strictly "SR" (S is Blue, R is Black / White in dark mode) */}
      {(variant === "text" || variant === "full") && (
        <div dir="ltr" className="flex flex-row items-center tracking-tighter font-black leading-none">
          {/* S in Blue */}
          <span
            className={`${currentSize.sText} text-[#1683ff] transition-transform duration-200 group-hover:scale-105`}
            style={{
              textShadow: "0 0 16px rgba(22, 131, 255, 0.4)",
            }}
          >
            S
          </span>

          {/* R in Black */}
          <span
            className={`${currentSize.rText} text-[#090d16] dark:text-white transition-colors duration-200 group-hover:scale-105`}
          >
            R
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
