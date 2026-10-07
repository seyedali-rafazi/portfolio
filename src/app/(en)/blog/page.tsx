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

export const metadata: Metadata = getBlogMetadata("en");

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Header Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineering Blog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-bright)] tracking-tight leading-tight">
            Technical Insights, Architecture & Code
          </h1>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Deep-dives into modern frontend engineering, React & Next.js architectures, geospatial visualization, telemetry systems, and web performance optimization.
          </p>

          <div className="pt-2 flex justify-center">
            <BlogSearchBar />
          </div>
        </section>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="flex justify-center">
            <CategoryFilterNav categories={categories} />
          </div>
        )}

        {/* Featured Article Spotlight (Page 1 only) */}
        {featuredArticle && page === 1 && (
          <section className="space-y-4">
            <FeaturedArticleBanner article={featuredArticle} />
          </section>
        )}

        {/* Latest Articles Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-bright)] tracking-tight">
              {page === 1 ? "Latest Publications" : `Articles — Page ${page}`}
            </h2>
            <span className="text-xs text-[var(--muted)]">
              {totalCount} {totalCount === 1 ? "article" : "articles"}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center space-y-3">
              <FileText className="w-12 h-12 text-[var(--muted-2)] mx-auto" />
              <h3 className="font-bold text-[var(--text-bright)] text-base">
                No published articles yet
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Articles are being drafted. Check back shortly for engineering posts!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-3">
              <Link
                href={`/blog?page=${Math.max(1, page - 1)}`}
                className={`px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-[var(--surface-2)] text-[var(--text)]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Link>

              <span className="text-xs text-[var(--muted)] font-mono px-2">
                {page} / {totalPages}
              </span>

              <Link
                href={`/blog?page=${Math.min(totalPages, page + 1)}`}
                className={`px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-[var(--surface-2)] text-[var(--text)]"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
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
