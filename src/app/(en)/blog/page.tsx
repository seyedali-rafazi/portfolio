import { Metadata } from "next";
import { getBlogMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { FeaturedArticleBanner } from "@/components/blog/FeaturedArticleBanner";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";
import { CategoryFilterNav } from "@/components/blog/CategoryFilterNav";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { getBlogListing } from "@/lib/blog/listing";
import { FileText, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getBlogMetadata("en");

interface BlogPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const { articles, featuredArticle, categories, totalCount, totalPages, page, pageSize, q } =
    await getBlogListing(await searchParams);

  return (
    <>
      {/* Ambient background glows */}
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      {/* Main navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 space-y-12" id="main-content">
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
              {q ? `Results for “${q}”` : page === 1 ? "Latest Publications" : `Articles — Page ${page}`}
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

          <BlogPagination
            basePath="/blog"
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            q={q}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
