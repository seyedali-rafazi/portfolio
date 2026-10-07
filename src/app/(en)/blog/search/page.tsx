import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";
import { Search, ChevronRight as BreadcrumbArrow, Sparkles, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q || "").trim();

  return buildLocalizedMetadata({
    locale: "en",
    path: "/blog/search",
    title: query
      ? `Search results for "${query}" | Seyedali Rafazi Blog`
      : "Search Engineering Articles | Seyedali Rafazi Blog",
    description: `Search technical publications, tutorials, and engineering articles by Seyedali Rafazi.`,
  });
}

export default async function BlogSearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const articles = query
    ? await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { publishedAt: "desc" },
        take: 30,
        include: {
          author: { select: { name: true, avatar: true } },
          categories: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
      })
    : [];

  return (
    <>
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <BreadcrumbArrow className="w-3 h-3 text-[var(--muted-2)]" />
          <Link href="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
          <BreadcrumbArrow className="w-3 h-3 text-[var(--muted-2)]" />
          <span className="text-[var(--text-bright)]">Search</span>
        </nav>

        {/* Search Header Banner */}
        <header className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-xl p-6 sm:p-10 space-y-4 shadow-xl text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary-light)] flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-6 h-6" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-bright)] tracking-tight">
            Search Engineering Articles
          </h1>

          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Explore topics across React, Next.js, TypeScript, geospatial architectures, and UI engineering.
          </p>

          <div className="pt-2 flex justify-center">
            <BlogSearchBar initialQuery={query} />
          </div>
        </header>

        {/* Search Results */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-bright)] tracking-tight">
              {query ? (
                <>
                  Results for <span className="text-[var(--primary-light)]">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                "Search query"
              )}
            </h2>
            <span className="text-xs text-[var(--muted)]">
              {articles.length} {articles.length === 1 ? "result" : "results"} found
            </span>
          </div>

          {!query ? (
            <div className="p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center space-y-2">
              <Search className="w-10 h-10 text-[var(--muted-2)] mx-auto" />
              <p className="text-sm font-semibold text-[var(--text-bright)]">
                Type a term in the search box above
              </p>
              <p className="text-xs text-[var(--muted)]">
                Try searching for &ldquo;React&rdquo;, &ldquo;Cesium&rdquo;, &ldquo;Next.js&rdquo;, or &ldquo;Performance&rdquo;.
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center space-y-3">
              <FileText className="w-12 h-12 text-[var(--muted-2)] mx-auto" />
              <h3 className="font-bold text-[var(--text-bright)] text-base">
                No matching articles found
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                We couldn&apos;t find any articles matching &ldquo;{query}&rdquo;. Try another keyword or browse all posts.
              </p>
              <Link
                href="/blog"
                className="inline-block px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:brightness-110 transition-all mt-2"
              >
                Browse All Articles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
