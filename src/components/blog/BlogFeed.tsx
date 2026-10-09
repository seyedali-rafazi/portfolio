"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, FileText, Loader2, MoreHorizontal, Search, X } from "lucide-react";
import { BlogCard, type BlogCardArticle } from "./BlogCard";
import { FeaturedArticleBanner } from "./FeaturedArticleBanner";

const PAGE_SIZE = 10;

/** 1 … 4 5 6 … 20 style page list. */
function buildPageItems(page: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "...")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) items.push("...");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("...");
  items.push(total);
  return items;
}

interface BlogFeedProps {
  locale?: "en" | "fa";
  basePath: string;
  featuredArticle?: BlogCardArticle | null;
}

interface PostsResponse {
  posts: BlogCardArticle[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

/**
 * Blog feed: search, pagination and page size are sent to /api/blog/posts.
 * State lives in the URL (?q=&page=&pageSize=) so it is shareable.
 */
export function BlogFeed({ locale = "en", basePath, featuredArticle }: BlogFeedProps) {
  const isFa = locale === "fa";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = PAGE_SIZE;

  const [input, setInput] = useState(q);
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const showFeatured = !!featuredArticle && page === 1 && !q;

  const update = useCallback(
    (next: { q?: string; page?: number }) => {
      const sp = new URLSearchParams();
      const nq = next.q !== undefined ? next.q : q;
      const np = next.page !== undefined ? next.page : page;
      if (nq) sp.set("q", nq);
      if (np > 1) sp.set("page", String(np));
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [q, page, pathname, router]
  );

  // Keep input in sync when URL changes externally
  useEffect(() => setInput(q), [q]);

  // Debounced search -> URL (resets to page 1)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const term = input.trim();
    if (term === q) return;
    const t = setTimeout(() => update({ q: term, page: 1 }), 350);
    return () => clearTimeout(t);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  // Backend request
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
      status: "PUBLISHED",
    });
    if (q) params.set("search", q);
    if (showFeatured && featuredArticle) params.set("exclude", featuredArticle.id);
    setLoading(true);
    setError(false);
    fetch(`/api/blog/posts?${params.toString()}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("request failed");
        return r.json();
      })
      .then((json: PostsResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [page, pageSize, q, showFeatured, featuredArticle]);

  const posts = data?.posts ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;
  const pageItems = buildPageItems(page, totalPages);

  return (
    <>
      <div className="pt-2 flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: input.trim(), page: 1 });
          }}
          className="relative w-full max-w-md"
        >
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isFa
                ? "جستجوی مقالات تخصصی، ابزارها، کلیدواژه‌ها..."
                : "Search engineering articles, tools, keywords..."
            }
            className="w-full ps-10 pe-9 py-2.5 bg-[var(--surface)]/90 border border-[var(--border)] rounded-2xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 backdrop-blur-md transition-all shadow-sm"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                update({ q: "", page: 1 });
              }}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {showFeatured && featuredArticle && (
        <section className="space-y-4">
          <FeaturedArticleBanner article={featuredArticle} basePath={basePath} />
        </section>
      )}

      <section className="space-y-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-bright)] tracking-tight">
            {q
              ? isFa
                ? `نتایج «${q}»`
                : `Results for “${q}”`
              : page === 1
                ? isFa
                  ? "آخرین مقالات منتشر شده"
                  : "Latest Publications"
                : isFa
                  ? `مقالات — صفحه ${page}`
                  : `Articles — Page ${page}`}
          </h2>
          <span className="text-xs text-[var(--muted)] flex items-center gap-2">
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isFa ? `${total} مقاله` : `${total} ${total === 1 ? "article" : "articles"}`}
          </span>
        </div>

        {error ? (
          <div className="p-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center text-sm text-[var(--muted)]">
            {isFa ? "بارگذاری مقالات ناموفق بود." : "Failed to load articles."}
          </div>
        ) : !loading && posts.length === 0 ? (
          <div className="p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center space-y-3">
            <FileText className="w-12 h-12 text-[var(--muted-2)] mx-auto" />
            <h3 className="font-bold text-[var(--text-bright)] text-base">
              {q
                ? isFa
                  ? "مقاله‌ای یافت نشد"
                  : "No matching articles found"
                : isFa
                  ? "هنوز مقاله‌ای منتشر نشده است"
                  : "No published articles yet"}
            </h3>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          >
            {posts.map((article) => (
              <BlogCard key={article.id} article={article} basePath={basePath} />
            ))}
          </div>
        )}

        <div className="mt-auto pt-8 flex items-center justify-center gap-4">
          <nav
            aria-label="Pagination"
            dir="ltr"
            className="flex items-center gap-1 sm:gap-2 text-sm"
          >
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => update({ page: page - 1 })}
              className="px-3 py-2 rounded-xl flex items-center gap-1.5 font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isFa ? "قبلی" : "Previous"}</span>
            </button>

            {pageItems.map((item, i) =>
              item === "..." ? (
                <span key={`e${i}`} className="px-2 text-[var(--muted)]">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  disabled={loading}
                  aria-current={item === page ? "page" : undefined}
                  onClick={() => item !== page && update({ page: item })}
                  className={`min-w-9 h-9 px-2 rounded-xl font-medium transition-colors ${
                    item === page
                      ? "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-bright)] shadow-sm"
                      : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => update({ page: page + 1 })}
              className="px-3 py-2 rounded-xl flex items-center gap-1.5 font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>{isFa ? "بعدی" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </section>
    </>
  );
}
