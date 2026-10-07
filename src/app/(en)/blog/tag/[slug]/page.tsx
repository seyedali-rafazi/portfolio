import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";
import { ChevronLeft, ChevronRight, Tag as TagIcon, ChevronRight as BreadcrumbArrow } from "lucide-react";

export const dynamic = "force-dynamic";

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    return { title: "Tag Not Found | Seyedali Rafazi Blog" };
  }

  return buildLocalizedMetadata({
    locale: "en",
    path: `/blog/tag/${tag.slug}`,
    title: `#${tag.name} Articles | Seyedali Rafazi Blog`,
    description: `Engineering articles, guides, and implementations tagged with #${tag.name} on Seyedali Rafazi's blog.`,
  });
}

export default async function TagPage({
  params,
  searchParams,
}: TagPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const limit = 9;
  const skip = (page - 1) * limit;

  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    notFound();
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        tags: { some: { id: tag.id } },
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
        tags: { some: { id: tag.id } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <>
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 space-y-10" id="main-content">
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
          <span className="text-[var(--text-bright)]">Tag</span>
          <BreadcrumbArrow className="w-3 h-3 text-[var(--muted-2)]" />
          <span className="text-[var(--primary-light)] font-semibold">
            #{tag.name}
          </span>
        </nav>

        {/* Tag Header */}
        <header className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-xl p-6 sm:p-10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary-light)] uppercase tracking-wider">
            <TagIcon className="w-4 h-4" />
            <span>Topic Tag</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-bright)] tracking-tight">
            #{tag.name}
          </h1>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            All engineering articles covering {tag.name} architectures, patterns, and code examples.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] flex-wrap gap-4">
            <span className="text-xs text-[var(--muted)] font-mono">
              {totalCount} {totalCount === 1 ? "article" : "articles"} tagged
            </span>

            <BlogSearchBar />
          </div>
        </header>

        {/* Articles Feed */}
        <section className="space-y-6">
          {articles.length === 0 ? (
            <div className="p-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 text-center space-y-3">
              <h3 className="font-bold text-[var(--text-bright)] text-base">
                No published articles tagged with #{tag.name} yet
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Explore our other technology tags or check back soon.
              </p>
              <Link
                href="/blog"
                className="inline-block px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold hover:brightness-110 transition-all mt-2"
              >
                View All Articles
              </Link>
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
                href={`/blog/tag/${tag.slug}?page=${Math.max(1, page - 1)}`}
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
                href={`/blog/tag/${tag.slug}?page=${Math.min(
                  totalPages,
                  page + 1
                )}`}
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

      <Footer />
    </>
  );
}
