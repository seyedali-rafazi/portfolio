import React from "react";
import Link from "next/link";
import { Star, Clock, Calendar, ArrowRight, Sparkles } from "lucide-react";
import type { BlogCardArticle } from "./BlogCard";

interface FeaturedBannerProps {
  article: BlogCardArticle;
}

export function FeaturedArticleBanner({ article }: FeaturedBannerProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 hover:border-[var(--primary)]/60 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 group">
      {/* Ambient background glow inside card */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--primary)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Details */}
        <div className="p-6 sm:p-10 lg:col-span-7 space-y-5 z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Star className="w-3.5 h-3.5 fill-purple-400" />
              <span>Featured Post</span>
            </span>

            {article.categories?.[0] && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
                {article.categories[0].name}
              </span>
            )}

            <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{article.readingTime} min read</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-bright)] tracking-tight leading-tight group-hover:text-[var(--primary-light)] transition-colors">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h2>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
                <img
                  src={article.author?.avatar || "/my-photo.png"}
                  alt={article.author?.name || "Author"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-[var(--text-bright)]">
                  {article.author?.name || "Seyedali Rafazi"}
                </div>
                {publishedDate && (
                  <div className="text-[11px] text-[var(--muted)]">
                    Published on {publishedDate}
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:brightness-110 active:scale-[0.98] text-white text-xs font-semibold shadow-[0_4px_20px_var(--glow)] transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Cover Image */}
        <div className="lg:col-span-5 h-full min-h-[260px] lg:min-h-[360px] relative overflow-hidden bg-[var(--surface-2)]">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] p-6">
              <Sparkles className="w-12 h-12 text-[var(--primary)]/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[var(--surface)] via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
}
