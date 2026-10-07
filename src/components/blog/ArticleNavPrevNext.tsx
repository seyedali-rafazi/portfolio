import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SiblingArticle {
  title: string;
  slug: string;
}

interface ArticleNavPrevNextProps {
  prev: SiblingArticle | null;
  next: SiblingArticle | null;
  basePath?: string;
}

export function ArticleNavPrevNext({
  prev,
  next,
  basePath = "/blog",
}: ArticleNavPrevNextProps) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-[var(--border)]">
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)] transition-all flex flex-col justify-between space-y-2"
        >
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] group-hover:text-[var(--primary-light)] transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous Article</span>
          </div>
          <span className="font-bold text-sm text-[var(--text-bright)] line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)] transition-all flex flex-col justify-between space-y-2 text-right items-end"
        >
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] group-hover:text-[var(--primary-light)] transition-colors">
            <span>Next Article</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="font-bold text-sm text-[var(--text-bright)] line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
