"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";

export const Navbar: React.FC = () => {
  const { locale, t, i18n, isRTL, getLocalizedHref, alternateLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname() || "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { path: "/", label: t("nav.home", "Home"), id: "home" },
    { path: "/about", label: t("nav.about", "About"), id: "about" },
    { path: "/projects", label: t("nav.projects", "Projects"), id: "projects" },
    { path: "/skills", label: t("nav.skills", "Skills"), id: "skills" },
    { path: "/contact", label: t("nav.contact", "Contact"), id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "h-[68px] bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-lg shadow-black/20"
          : "h-[74px] bg-[var(--bg)]/60 backdrop-blur-sm border-b border-[var(--border)]/40"
      }`}
    >
      <div className="portfolio-container h-full flex items-center justify-between gap-4">
        {/* Brand Logo - Start */}
        <div className="flex-1 flex items-center justify-start">
          <Link
            href={getLocalizedHref("/")}
            className="text-2xl font-black tracking-tighter text-[var(--text)] group flex items-center gap-1 focus:outline-none"
            aria-label={locale === "fa" ? "سید علی رفضی — صفحه اصلی" : "Seyekali Rafazi — Home"}
          >
            <span className="transition-transform group-hover:scale-105">S</span>
            <span className="text-[var(--primary)] text-shadow-glow">R</span>
          </Link>
        </div>

        {/* Desktop Nav Links - Centered */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
          {navLinks.map((item) => {
            const localizedHref = getLocalizedHref(item.path);
            const isHome = item.path === "/";
            const isActive = isHome
              ? pathname === "/" || pathname === "/fa"
              : pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);

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
                  <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-5 h-[2px] bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls - End */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          {/* i18n Language Switcher */}
          <button
            type="button"
            onClick={() => i18n.changeLanguage(alternateLocale)}
            id="languageBtn"
            title={locale === "fa" ? "Switch to English" : "تغییر زبان به فارسی"}
            aria-label={locale === "fa" ? "Switch to English" : "تغییر زبان به فارسی"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--text)] transition-all cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--primary-light)] shrink-0" aria-hidden="true" />
            <span className={locale === "en" ? "text-[var(--primary-light)] font-bold" : ""}>
              EN
            </span>
            <span className="opacity-40" aria-hidden="true">|</span>
            <span className={locale === "fa" ? "text-[var(--primary-light)] font-bold" : ""}>
              فارسی
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            id="themeBtn"
            suppressHydrationWarning
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-bright)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-pointer shrink-0"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-blue-300" aria-hidden="true" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] py-5 px-6 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const localizedHref = getLocalizedHref(item.path);
            const isHome = item.path === "/";
            const isActive = isHome
              ? pathname === "/" || pathname === "/fa"
              : pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);

            return (
              <Link
                key={item.id}
                href={localizedHref}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium py-2.5 border-b border-[var(--border)]/30 flex justify-between items-center ${
                  isRTL ? "text-right" : "text-left"
                } ${
                  isActive
                    ? "text-[var(--primary)] font-bold"
                    : "text-[var(--text)] hover:text-[var(--text-bright)]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
