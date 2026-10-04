"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { ArrowLeft, ArrowRight, Download, Sparkles, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, type Variants } from "framer-motion";

export const HeroSection: React.FC = () => {
  const { locale, t, isRTL, getLocalizedHref } = useI18n();

  const socials = [
    { name: "GitHub", url: "https://github.com/seyedalirafazi", icon: "GH" },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/seyedalirafazi",
      icon: "in",
    },
    { name: "Telegram", url: "https://t.me/seyedalirafazi", icon: "TG" },
    { name: "X", url: "https://x.com/seyedalirafazi", icon: "X" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-74px)] flex items-center pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-28 overflow-hidden"
    >
      {/* Background Grids */}
      <div className="grid-bg" />

      <div className="portfolio-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Hero Content (7 cols on lg) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-start"
          >
            {/* Intro Greeting */}
            <motion.div variants={itemVariants} className="mb-3">
              <Badge
                variant="primarySubtle"
                className="text-xs sm:text-sm px-4 py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] animate-pulse" />
                <span>{t("hero.intro")}</span>
              </Badge>
            </motion.div>

            {/* Main Title - Seyekali Rafazi / سید علی رفضی */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-5"
            >
              <span className="text-[var(--text-bright)]">
                {t("hero.namePrefix")}
              </span>{" "}
              <span className="text-[var(--primary)] text-shadow-glow">
                {t("hero.nameSuffix")}
              </span>
            </motion.h1>

            {/* Role & Tech Badges */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-[13px] font-medium text-[var(--muted)] mb-6 flex-wrap justify-center lg:justify-start shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] shrink-0" />
              <span className="font-semibold text-[var(--text-bright)]">
                Frontend Engineer
              </span>
              <span className="opacity-30">•</span>
              <span>React</span>
              <span className="opacity-30">•</span>
              <span>Next.js</span>
              <span className="opacity-30">•</span>
              <span>TypeScript</span>
            </motion.div>

            {/* Descriptions */}
            <motion.div variants={itemVariants} className="max-w-[580px] mb-8 space-y-3">
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--text)] font-normal">
                {t("hero.bio")}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                {locale === "fa"
                  ? "متخصص در رندرینگ پیشرفته Next.js، مدیریت بهینه استیت، و تجسم سه‌بعدی داده‌های GIS با کارایی ۶۰ فریم."
                  : "Specializing in high-performance Next.js architectures, responsive design systems, and 3D GIS visualization."}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 flex-wrap justify-center lg:justify-start mb-8"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2.5 rounded-xl cursor-pointer h-12 px-8 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md"
                >
                  <Link
                    href={getLocalizedHref("/projects")}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <span>{t("hero.viewProjects")}</span>
                    {isRTL ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2.5 rounded-xl cursor-pointer h-12 px-8 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md"
                >
                  <a
                    href="/seyedali-rafazi-cv.pdf"
                    download="seyedali-rafazi-cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 text-[var(--primary-light)]" />
                    <span>{t("hero.downloadCv")}</span>
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3.5 flex-wrap justify-center lg:justify-start"
            >
              <span className="text-[12px] text-[var(--muted)] font-medium">
                {t("hero.connectWithMe")}
              </span>
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    whileHover={{ y: -3, scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] dark:hover:text-white bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors text-xs font-semibold shadow-sm"
                  >
                    {social.icon === "GH" && (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    )}
                    {social.icon === "in" && (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    )}
                    {social.icon === "TG" && (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
                      </svg>
                    )}
                    {social.icon === "X" && (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center items-center w-full select-none"
          >
            <div className="relative w-[320px] sm:w-[380px] md:w-[420px] lg:w-[440px] h-[450px] sm:h-[500px] md:h-[540px] flex items-center justify-center">
              {/* Studio Rim Light / Ambient Aura */}
              <div className="hero-ambient-aura" aria-hidden="true" />

              {/* Decorative Tech Orbit Ring with glowing satellites */}
              <svg
                className="hero-orbit-svg"
                viewBox="0 0 480 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="240"
                  cy="240"
                  r="215"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="5 9"
                  className="text-blue-500/20 dark:text-white/10"
                />
                <circle
                  cx="240"
                  cy="240"
                  r="185"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 12"
                  className="text-blue-500/10 dark:text-white/5"
                />
                {/* Orbital Glowing Nodes */}
                <circle cx="240" cy="25" r="4" fill="#38bdf8" />
                <circle cx="435" cy="330" r="3" fill="#818cf8" />
                <circle cx="45" cy="180" r="3.5" fill="#60a5fa" />
              </svg>

              {/* Frosted Glassmorphic Pedestal Card */}
              <div className="hero-glass-card">
                {/* Decorative window dot & code tag accents */}
                <div className="absolute top-4 inset-x-6 flex justify-between items-center opacity-60">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[10px] tracking-wider text-[var(--muted)]">
                    &lt;developer /&gt;
                  </span>
                </div>
              </div>

              {/* High-Resolution Portrait Photo with 3D Pop-Out */}
              <div className="relative z-10 w-[290px] sm:w-[345px] md:w-[385px] lg:w-[400px] h-[430px] sm:h-[485px] md:h-[525px] profile-image-mask drop-shadow-2xl flex items-end justify-center mb-0">
                <Image
                  src="/my-photo.png"
                  alt={t("hero.photoAlt")}
                  fill
                  priority
                  className="object-cover object-top select-none pointer-events-none"
                  sizes="(max-width: 640px) 290px, (max-width: 768px) 345px, (max-width: 1024px) 385px, 400px"
                />
              </div>

              {/* Floating Badge 1: React & Next.js Specialization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35, type: "spring" }}
                className="hero-float-badge animate-float-1 -top-2 sm:top-5 -start-2 sm:-start-6"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
                  <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[12px] sm:text-[13px] font-bold text-[var(--text-bright)] leading-tight">
                    React &amp; Next.js
                  </span>
                  <span className="text-[10px] text-[var(--muted)] font-medium">
                    {locale === "fa"
                      ? "متخصص فرانت‌اند مدرن"
                      : "Frontend Specialist"}
                  </span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Experience & Open to Work */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.45, type: "spring" }}
                className="hero-float-badge animate-float-2 bottom-12 sm:bottom-16 -end-2 sm:-end-6"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center relative shrink-0">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[12px] sm:text-[13px] font-bold text-[var(--text-bright)] leading-tight">
                    {locale === "fa"
                      ? "۴+ سال سابقه تخصصی"
                      : "4+ Years Experience"}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    {locale === "fa"
                      ? "آماده پروژه‌های چالش‌برانگیز"
                      : "Available for Projects"}
                  </span>
                </div>
              </motion.div>

              {/* Floating Badge 3: Mini Tech Stack Capsule (Center Bottom) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, type: "spring" }}
                className="hero-float-badge animate-float-3 -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 hidden sm:flex"
              >
                <Code2 className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                <span className="text-[11px] text-[var(--text)] font-semibold flex items-center gap-1.5 whitespace-nowrap">
                  <span>TypeScript</span>
                  <span className="text-[var(--primary)]">•</span>
                  <span>Tailwind</span>
                  <span className="text-[var(--primary)]">•</span>
                  <span>GIS / 3D</span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
