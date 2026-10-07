import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBlogMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { FeaturedArticleBanner } from "@/components/blog/FeaturedArticleBanner";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";
import { CategoryFilterNav } from "@/components/blog/CategoryFilterNav";
import { ChevronLeft, ChevronRight, FileText, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getBlogMetadata("fa");

interface FaBlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function FaBlogPage({ searchParams }: FaBlogPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const limit = 9;
  const skip = (page - 1) * limit;

  // 1. Featured Article (only on first page)
  const featuredArticle =
    page === 1
      ? await prisma.article.findFirst({
          where: { status: "PUBLISHED", featured: true },
          orderBy: { publishedAt: "desc" },
          include: {
            author: { select: { name: true, avatar: true } },
            categories: { select: { id: true, name: true, slug: true } },
            tags: { select: { id: true, name: true, slug: true } },
          },
        })
      : null;

  // Exclude featured article ID from regular feed if on page 1 so it doesn't duplicate
  const excludeIds = featuredArticle ? [featuredArticle.id] : [];

  // 2. Fetch published articles
  const [articles, totalCount, categories] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      include: {
        author: { select: { name: true, avatar: true } },
        categories: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.article.count({
      where: {
        status: "PUBLISHED",
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            articles: { where: { status: "PUBLISHED" } },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <>
      {/* Ambient background glows */}
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      {/* Main navigation */}
      <Navbar />

      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 space-y-12"
        id="main-content"
      >
        {/* Header Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>وبلاگ مهندسی</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-bright)] tracking-tight leading-tight">
            مقالات تخصصی، معماری نرم‌افزار و کدنویسی
          </h1>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            بررسی‌های عمیق مهندسی فرانت‌اند مدرن، معماری‌های React و Next.js، سامانه‌های مکانی و نقشه‌محور، تله‌متری و بهینه‌سازی عملکرد وب.
          </p>

          <div className="pt-2 flex justify-center">
            <BlogSearchBar locale="fa" />
          </div>
        </section>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="flex justify-center">
            <CategoryFilterNav categories={categories} locale="fa" />
          </div>
        )}

        {/* Featured Article Spotlight (Page 1 only) */}
        {featuredArticle && page === 1 && (
          <section className="space-y-4">
            <FeaturedArticleBanner article={featuredArticle} basePath="/fa/blog" />
          </section>
        )}

        {/* Latest Articles Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-bright)] tracking-tight">
              {page === 1 ? "آخرین مقالات منتشر شده" : `مقالات — صفحه ${page}`}
            </h2>
            <span className="text-xs text-[var(--muted)]">
              {totalCount} مقاله
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center space-y-3">
              <FileText className="w-12 h-12 text-[var(--muted-2)] mx-auto" />
              <h3 className="font-bold text-[var(--text-bright)] text-base">
                هنوز مقاله‌ای منتشر نشده است
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                مقالات در حال تدوین هستند. به زودی برای مطالعه پست‌های جدید بازگردید!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <BlogCard key={article.id} article={article} basePath="/fa/blog" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-3">
              <Link
                href={`/fa/blog?page=${Math.max(1, page - 1)}`}
                className={`px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-[var(--surface-2)] text-[var(--text)]"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span>صفحه قبل</span>
              </Link>

              <span className="text-xs text-[var(--muted)] font-mono px-2">
                {page} از {totalPages}
              </span>

              <Link
                href={`/fa/blog?page=${Math.min(totalPages, page + 1)}`}
                className={`px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-[var(--surface-2)] text-[var(--text)]"
                }`}
              >
                <span>صفحه بعد</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
