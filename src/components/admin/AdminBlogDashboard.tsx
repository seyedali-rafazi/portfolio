"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Star,
  FolderTree,
  Tags,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { toast } from "sonner";

interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  categories: { id: string; name: string }[];
  author: { name: string } | null;
}

interface StatsData {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  featuredArticles: number;
  totalCategories: number;
  totalTags: number;
  recentArticles: RecentArticle[];
}

export function AdminBlogDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    featuredArticles: 0,
    totalCategories: 0,
    totalTags: 0,
    recentArticles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/stats");
      if (!res.ok) {
        throw new Error("Failed to load blog statistics");
      }
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load blog data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-[var(--primary)] selection:text-white">
      {/* Background glow effects */}
      <div className="bg-glow one pointer-events-none opacity-40" />
      <div className="bg-glow two pointer-events-none opacity-30" />

      {/* Top Navbar */}
      <AdminNavbar onRefresh={fetchStats} isRefreshing={isLoading} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header section with greetings and quick creation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)] tracking-tight">
              Blog & CMS Hub
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Manage engineering articles, drafts, categories, and technical publications.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/blog/posts/new"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.98] text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_20px_var(--glow)] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>

            <button
              onClick={fetchStats}
              disabled={isLoading}
              title="Refresh statistics"
              className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--muted)]">Total Posts</span>
              <FileText className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)]">
              {stats.totalArticles}
            </div>
            <div className="text-[11px] text-[var(--muted-2)] mt-1">All database articles</div>
          </div>

          <div className="border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-300">Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {stats.publishedArticles}
            </div>
            <div className="text-[11px] text-emerald-400/70 mt-1">Live on public blog</div>
          </div>

          <div className="border border-amber-500/30 bg-amber-500/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-300">Drafts</span>
              <FileEdit className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats.draftArticles}
            </div>
            <div className="text-[11px] text-amber-400/70 mt-1">Unpublished work</div>
          </div>

          <div className="border border-purple-500/30 bg-purple-500/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-300">Featured</span>
              <Star className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
              {stats.featuredArticles}
            </div>
            <div className="text-[11px] text-purple-400/70 mt-1">Highlighted posts</div>
          </div>
        </div>

        {/* Quick Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/blog/posts"
            className="group border border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]/90 backdrop-blur-md rounded-2xl p-5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary-light)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--primary-light)] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-[var(--text-bright)] text-base mb-1">
              Manage Articles
            </h3>
            <p className="text-xs text-[var(--muted)]">
              View, edit, duplicate, search, and toggle publication status of your posts.
            </p>
          </Link>

          <Link
            href="/admin/blog/categories"
            className="group border border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]/90 backdrop-blur-md rounded-2xl p-5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderTree className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--surface-3)] text-[var(--muted)]">
                {stats.totalCategories} items
              </span>
            </div>
            <h3 className="font-bold text-[var(--text-bright)] text-base mb-1">
              Categories
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Organize topics into primary engineering categories and taxonomy.
            </p>
          </Link>

          <Link
            href="/admin/blog/tags"
            className="group border border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]/90 backdrop-blur-md rounded-2xl p-5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Tags className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--surface-3)] text-[var(--muted)]">
                {stats.totalTags} items
              </span>
            </div>
            <h3 className="font-bold text-[var(--text-bright)] text-base mb-1">
              Tags
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Label articles with granular technology tags (e.g. Next.js, GIS, Shaders).
            </p>
          </Link>
        </div>

        {/* Recent Articles Section */}
        <div className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="font-bold text-[var(--text-bright)] text-base">
                Recent Articles
              </h2>
            </div>
            <Link
              href="/admin/blog/posts"
              className="text-xs font-semibold text-[var(--primary-light)] hover:underline flex items-center gap-1"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-sm text-[var(--muted)] flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
              <span>Loading recent articles...</span>
            </div>
          ) : stats.recentArticles.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-[var(--muted-2)] mx-auto" />
              <p className="text-sm font-semibold text-[var(--text-bright)]">
                No articles created yet
              </p>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Ready to publish your first engineering article? Click the button below to get started.
              </p>
              <Link
                href="/admin/blog/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:brightness-110 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Write First Post</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {stats.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          article.status === "PUBLISHED"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {article.status}
                      </span>
                      {article.featured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-purple-400" />
                          <span>Featured</span>
                        </span>
                      )}
                      {article.categories.map((c) => (
                        <span
                          key={c.id}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-3)] text-[var(--muted)]"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-bold text-[var(--text-bright)] text-sm sm:text-base truncate">
                      {article.title}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-[var(--muted)] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(
                            article.publishedAt || article.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readingTime} min read</span>
                      </span>
                      {article.author && (
                        <span>By {article.author.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/admin/blog/posts/${article.id}/preview`}
                      className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--text-bright)] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Preview draft"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </Link>

                    <Link
                      href={`/admin/blog/posts/${article.id}/edit`}
                      className="px-3 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-bright)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
