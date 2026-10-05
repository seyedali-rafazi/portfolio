"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { useTheme } from "@/context/ThemeContext";
import {
  Moon,
  Sun,
  Menu,
  X,
  Globe,
  Home,
  User,
  Briefcase,
  Cpu,
  Mail,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const { locale, t, i18n, isRTL, getLocalizedHref, alternateLocale } =
    useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname() || "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navLinks = [
    { path: "/", label: t("nav.home", "Home"), id: "home", icon: Home },
    { path: "/about", label: t("nav.about", "About"), id: "about", icon: User },
    {
      path: "/projects",
      label: t("nav.projects", "Projects"),
      id: "projects",
      icon: Briefcase,
    },
    {
      path: "/skills",
      label: t("nav.skills", "Skills"),
      id: "skills",
      icon: Cpu,
    },
    {
      path: "/contact",
      label: t("nav.contact", "Contact"),
      id: "contact",
      icon: Mail,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on route or locale changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, locale]);

  // Close mobile menu if screen resized to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-[68px] bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-lg shadow-black/20"
            : "h-[74px] bg-[var(--bg)]/60 backdrop-blur-sm border-b border-[var(--border)]/40"
        }`}
      >
        <div className="portfolio-container h-full">
          {/* =========================================
              DESKTOP NAVBAR (hidden md:flex)
              ========================================= */}
          <div className="hidden md:flex h-full items-center justify-between gap-4">
            {/* Brand Logo - Start */}
            <div className="flex-1 flex items-center justify-start">
              <Link
                href={getLocalizedHref("/")}
                className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl"
                aria-label={
                  locale === "fa"
                    ? "سید علی رفضی — صفحه اصلی"
                    : "Seyedali Rafazi — Home"
                }
              >
                <Logo size="md" variant="badge" locale={locale} />
              </Link>
            </div>

            {/* Desktop Nav Links - Centered */}
            <nav
              aria-label="Main Navigation"
              className="flex items-center justify-center gap-6 lg:gap-8"
            >
              {navLinks.map((item) => {
                const localizedHref = getLocalizedHref(item.path);
                const isHome = item.path === "/";
                const isActive = isHome
                  ? pathname === "/" || pathname === "/fa"
                  : pathname === localizedHref ||
                    pathname.startsWith(`${localizedHref}/`);

                return (
                  <Link
                    key={item.id}
                    href={localizedHref}
                    className={`text-[13px] font-medium transition-colors relative py-1 focus:outline-none ${
                      isActive
                        ? "text-[var(--text-bright)] font-semibold"
                        : "text-[var(--muted)] hover:text-[var(--text-bright)]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-6 h-[2px] bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Controls - End */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
              {/* Desktop Language Switcher */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => i18n.changeLanguage(alternateLocale)}
                id="languageBtn"
                title={
                  locale === "fa" ? "Switch to English" : "تغییر زبان به فارسی"
                }
                aria-label={
                  locale === "fa" ? "Switch to English" : "تغییر زبان به فارسی"
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--text)] transition-colors cursor-pointer shadow-sm"
              >
                <Globe
                  className="w-3.5 h-3.5 text-[var(--primary-light)] shrink-0"
                  aria-hidden="true"
                />
                <span
                  className={
                    locale === "en"
                      ? "text-[var(--primary-light)] font-bold"
                      : ""
                  }
                >
                  EN
                </span>
                <span className="opacity-40" aria-hidden="true">
                  |
                </span>
                <span
                  className={
                    locale === "fa"
                      ? "text-[var(--primary-light)] font-bold"
                      : ""
                  }
                >
                  فارسی
                </span>
              </motion.button>

              {/* Desktop Theme Switcher */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                id="themeBtn"
                suppressHydrationWarning
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                aria-label={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-bright)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer shrink-0"
              >
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-blue-300" aria-hidden="true" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>

          {/* =========================================
              MOBILE RESPONSIVE NAVBAR (flex md:hidden)
              - Logo centered
              - English: Hamburger on LEFT, Theme on RIGHT
              - Persian: Hamburger on RIGHT, Theme on LEFT
              - Language switcher moved to Hamburger drawer
              ========================================= */}
          <div className="flex md:hidden h-full items-center justify-between relative w-full">
            {/* Start Button: Hamburger Menu (Left in English, Right in Persian) */}
            <div className="flex items-center justify-start z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-bright)] border border-[var(--border)] bg-[var(--surface-2)]/80 hover:bg-[var(--surface-2)] transition-colors focus:outline-none cursor-pointer shadow-sm"
                aria-label={
                  locale === "fa"
                    ? "باز کردن منوی ناوبری"
                    : "Open Navigation Menu"
                }
                aria-expanded={mobileMenuOpen}
                id="mobileMenuBtn"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </div>

            {/* Center: Brand Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto">
              <Link
                href={getLocalizedHref("/")}
                className="group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl"
                aria-label={
                  locale === "fa"
                    ? "سید علی رفضی — صفحه اصلی"
                    : "Seyedali Rafazi — Home"
                }
              >
                <Logo size="md" variant="badge" locale={locale} />
              </Link>
            </div>

            {/* End Button: Theme Switcher (Right in English, Left in Persian) */}
            <div className="flex items-center justify-end z-10">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                id="mobileThemeBtn"
                suppressHydrationWarning
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                aria-label={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-bright)] bg-[var(--surface-2)]/80 hover:bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer shadow-sm"
              >
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-blue-300" aria-hidden="true" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE SLIDE-OVER DRAWER (Portaled to document.body)
          - GPU-accelerated translate3d transitions (60/120 FPS)
          - Full viewport backdrop with smooth GPU opacity fade
          - Instant click-to-close on backdrop
          - Persian: slides from Right to Left, closes to Right
          - English: slides from Left to Right, closes to Left
          - Single clean badge logo (no duplicate)
          ========================================= */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[60] md:hidden transition-[visibility] duration-300 ${
              mobileMenuOpen
                ? "visible pointer-events-auto"
                : "invisible pointer-events-none delay-300"
            }`}
            aria-hidden={!mobileMenuOpen}
          >
            {/* Full-screen Backdrop overlay (pure GPU opacity transition, no heavy blur shader) */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className={`fixed inset-0 bg-black/65 transition-opacity duration-300 ease-out cursor-pointer ${
                mobileMenuOpen ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />

            {/* Slide Drawer Panel (hardware-accelerated translate3d) */}
            <aside
              dir={isRTL ? "rtl" : "ltr"}
              className={`fixed top-0 bottom-0 z-[70] w-[84vw] max-w-[340px] sm:max-w-[360px] h-[100dvh] bg-[var(--surface)] text-[var(--text)] border-[var(--border)] shadow-2xl flex flex-col justify-between overflow-y-auto will-change-transform ${
                isRTL ? "right-0 border-l" : "left-0 border-r"
              }`}
              style={{
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: mobileMenuOpen
                  ? "translate3d(0, 0, 0)"
                  : isRTL
                    ? "translate3d(100%, 0, 0)"
                    : "translate3d(-100%, 0, 0)",
              }}
              aria-label={
                locale === "fa" ? "منوی ناوبری" : "Mobile Navigation Menu"
              }
            >
              {/* Drawer Top Content */}
              <div>
                {/* Drawer Header: Single Logo (Badge) + Close Button */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]/60">
                  <Link
                    href={getLocalizedHref("/")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center gap-2.5 focus:outline-none"
                    aria-label={
                      locale === "fa"
                        ? "سید علی رفضی — صفحه اصلی"
                        : "Seyedali Rafazi — Home"
                    }
                  >
                    <Logo size="md" variant="badge" locale={locale} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] active:scale-95 transition-all focus:outline-none cursor-pointer border border-[var(--border)]/40"
                    aria-label={locale === "fa" ? "بستن منو" : "Close menu"}
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Language Switcher Section inside Hamburger Menu */}
                <div className="px-4 pt-4 pb-2">
                  <div className="p-3 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
                        <Globe
                          className="w-3.5 h-3.5 text-[var(--primary)] shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          {locale === "fa" ? "زبان وب‌سایت" : "Language"}
                        </span>
                      </span>
                      <span className="text-[11px] font-medium text-[var(--primary)]">
                        {locale === "fa" ? "فارسی" : "English"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--bg)]/90 rounded-xl border border-[var(--border)]/50">
                      <button
                        type="button"
                        id="mobileLanguageBtn-en"
                        onClick={() => {
                          if (locale !== "en") {
                            setMobileMenuOpen(false);
                            i18n.changeLanguage("en");
                          }
                        }}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          locale === "en"
                            ? "bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/30 font-bold"
                            : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                        }`}
                        aria-pressed={locale === "en"}
                      >
                        <span>English</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          EN
                        </span>
                      </button>

                      <button
                        type="button"
                        id="mobileLanguageBtn-fa"
                        onClick={() => {
                          if (locale !== "fa") {
                            setMobileMenuOpen(false);
                            i18n.changeLanguage("fa");
                          }
                        }}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          locale === "fa"
                            ? "bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/30 font-bold"
                            : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                        }`}
                        aria-pressed={locale === "fa"}
                      >
                        <span>فارسی</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          FA
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <nav
                  aria-label="Mobile Navigation Links"
                  className="px-4 py-3 flex flex-col gap-1.5"
                >
                  {navLinks.map((item) => {
                    const localizedHref = getLocalizedHref(item.path);
                    const isHome = item.path === "/";
                    const isActive = isHome
                      ? pathname === "/" || pathname === "/fa"
                      : pathname === localizedHref ||
                        pathname.startsWith(`${localizedHref}/`);
                    const Icon = item.icon;

                    return (
                      <div key={item.id}>
                        <Link
                          href={localizedHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-sm font-medium py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                            isActive
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold border border-[var(--primary)]/30 shadow-sm"
                              : "text-[var(--text)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)]"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                isActive
                                  ? "bg-[var(--primary)] text-white shadow-sm"
                                  : "bg-[var(--surface-2)] text-[var(--muted)]"
                              }`}
                            >
                              <Icon
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                            </div>
                            <span>{item.label}</span>
                          </div>

                          {isRTL ? (
                            <ChevronLeft
                              className={`w-4 h-4 transition-transform ${
                                isActive
                                  ? "text-[var(--primary)]"
                                  : "text-[var(--muted)]/50"
                              }`}
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                isActive
                                  ? "text-[var(--primary)]"
                                  : "text-[var(--muted)]/50"
                              }`}
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Footer */}
              <div className="p-4 border-t border-[var(--border)]/60 bg-[var(--surface-2)]/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {locale === "fa"
                      ? "آماده همکاری و استخدام"
                      : "Available for Projects"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text-bright)] active:scale-95 transition-all cursor-pointer"
                  title={
                    theme === "dark"
                      ? "Switch to Light Mode"
                      : "Switch to Dark Mode"
                  }
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Moon
                      className="w-3.5 h-3.5 text-blue-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sun
                      className="w-3.5 h-3.5 text-amber-500"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
};
