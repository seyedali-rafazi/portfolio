import React from "react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

interface CategoryFilterNavProps {
  categories: CategoryItem[];
  activeSlug?: string;
  locale?: "en" | "fa";
}

export function CategoryFilterNav({
  categories,
  activeSlug,
  locale = "en",
}: CategoryFilterNavProps) {
  const isFa = locale === "fa";
  const allHref = isFa ? "/fa/blog" : "/blog";

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 text-xs">
      <Link
        href={allHref}
        className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
          !activeSlug
            ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
            : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text-bright)] hover:border-[var(--primary)]/40"
        }`}
      >
        {isFa ? "همه مقالات" : "All Articles"}
      </Link>

      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/blog/category/${cat.slug}`}
            className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isActive
                ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text-bright)] hover:border-[var(--primary)]/40"
            }`}
          >
            <span>{cat.name}</span>
            {cat._count?.articles !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[var(--surface-3)] text-[var(--muted-2)]"
                }`}
              >
                {cat._count.articles}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
