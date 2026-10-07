"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  MessageSquare,
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  PlusCircle,
  ExternalLink,
  LogOut,
  BookOpen,
} from "lucide-react";

interface AdminNavbarProps {
  currentSection?: "messages" | "blog" | "posts" | "categories" | "tags";
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminNavbar({
  currentSection,
  onRefresh,
  isRefreshing = false,
}: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    {
      href: "/admin",
      label: "Messages",
      icon: MessageSquare,
      active: pathname === "/admin" || pathname === "/admin/messages",
    },
    {
      href: "/admin/blog",
      label: "Blog Overview",
      icon: LayoutDashboard,
      active: pathname === "/admin/blog",
    },
    {
      href: "/admin/blog/posts",
      label: "Posts",
      icon: FileText,
      active: pathname.startsWith("/admin/blog/posts"),
    },
    {
      href: "/admin/blog/categories",
      label: "Categories",
      icon: FolderTree,
      active: pathname.startsWith("/admin/blog/categories"),
    },
    {
      href: "/admin/blog/tags",
      label: "Tags",
      icon: Tags,
      active: pathname.startsWith("/admin/blog/tags"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white shadow-[0_0_12px_var(--glow)] group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-bright)] text-sm sm:text-base tracking-tight">
                    Portfolio Admin
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
                    CMS & Blog
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PostgreSQL Connected</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/blog/posts/new"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_var(--glow)] transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Post</span>
            </Link>

            <Link
              href="/blog"
              target="_blank"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text-bright)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open public blog in new tab"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Blog</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text-bright)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open portfolio homepage"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout from admin"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 border-t border-[var(--border)]/60 text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium whitespace-nowrap transition-colors ${
                  link.active
                    ? "bg-[var(--primary)]/15 text-[var(--primary-light)] font-semibold border border-[var(--primary)]/30"
                    : "text-[var(--muted)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
