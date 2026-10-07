import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag as TagIcon, Star } from "lucide-react";

export interface BlogCardArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  readingTime: number;
  publishedAt?: Date | string | null;
  featured?: boolean;
  author?: {
    name: string;
    avatar?: string | null;
  } | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface BlogCardProps {
  article: BlogCardArticle;
  featuredBanner?: boolean;
}

export function BlogCard({ article, featuredBanner = false }: BlogCardProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="group relative flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 hover:border-[var(--primary)]/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_var(--glow)] hover:-translate-y-1">
      {/* Cover Image Container */}
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[var(--surface-2)]"
        tabIndex={-1}
      >
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] p-6 text-center">
            <span className="text-xl font-bold text-[var(--muted)]/50 font-mono">
              // Engineering Article
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80" />

        {/* Badges on top of image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.categories?.[0] && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--surface)]/90 backdrop-blur-md text-[var(--primary-light)] border border-[var(--border)] shadow-md">
                {article.categories[0].name}
              </span>
            )}
            {article.featured && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 backdrop-blur-md text-purple-300 border border-purple-500/40 shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-purple-400" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--surface)]/90 backdrop-blur-md text-[var(--muted)] border border-[var(--border)] shadow-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-[var(--primary)]" />
            <span>{article.readingTime}m read</span>
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-bright)] tracking-tight group-hover:text-[var(--primary-light)] transition-colors line-clamp-2">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            {article.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--primary-light)] hover:bg-[var(--surface-3)] transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
            {article.tags.length > 3 && (
              <span className="text-[10px] text-[var(--muted-2)]">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer Meta: Author & Date */}
        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shrink-0">
              <img
                src={article.author?.avatar || "/my-photo.png"}
                alt={article.author?.name || "Author"}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-[var(--text)] text-xs">
              {article.author?.name || "Seyedali Rafazi"}
            </span>
          </div>

          {publishedDate && (
            <span className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
              <Calendar className="w-3 h-3 text-[var(--muted-2)]" />
              <span>{publishedDate}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
