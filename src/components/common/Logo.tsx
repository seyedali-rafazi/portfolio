"use client";

import React, { useId } from "react";
import { SrMark } from "@/components/common/SrMark";

export interface LogoProps {
  /** Size presets: sm (32px), md (38-40px), lg (48px). */
  size?: "sm" | "md" | "lg";
  /**
   * - "badge": the SR emblem only
   * - "text": wordmark only
   * - "full": emblem + wordmark
   */
  variant?: "badge" | "text" | "full";
  /** Optional custom class for outer wrapper */
  className?: string;
  /** Adds a soft glow around the emblem on hover */
  withGlow?: boolean;
  /** Optional locale prop (logo always displays strictly in LTR) */
  locale?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "full",
  className = "",
  withGlow = true,
}) => {
  const sizeMap = {
    sm: { badge: "w-8 h-8", text: "text-lg", gap: "gap-2" },
    md: { badge: "w-9 h-9 sm:w-10 sm:h-10", text: "text-xl sm:text-2xl", gap: "gap-2.5" },
    lg: { badge: "w-12 h-12", text: "text-3xl", gap: "gap-3" },
  };
  const s = sizeMap[size];
  // Unique per instance: duplicate SVG ids make gradients resolve to a hidden
  // (display:none) copy, so the mark vanishes at breakpoints.
  const idSuffix = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div
      dir="ltr"
      className={`inline-flex flex-row items-center ${s.gap} group select-none ${className}`}
      aria-label="SR Logo"
    >
      {(variant === "badge" || variant === "full") && (
        <div
          className={`${s.badge} shrink-0 rounded-[24%] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105 ${
            withGlow ? "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]" : ""
          }`}
        >
          <SrMark size="100%" rounded={false} idSuffix={idSuffix} />
        </div>
      )}

      {(variant === "text" || variant === "full") && (
        <div dir="ltr" className="flex flex-row items-center tracking-tighter font-black leading-none">
          <span
            className={`${s.text} bg-gradient-to-br from-cyan-400 to-[#1683ff] bg-clip-text text-transparent`}
          >
            S
          </span>
          <span className={`${s.text} text-[#090d16] dark:text-white`}>R</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
