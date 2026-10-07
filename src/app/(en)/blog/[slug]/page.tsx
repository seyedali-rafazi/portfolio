import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getArticleMetadata } from "@/lib/metadata";
import { getArticleSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleContentRenderer } from "@/components/blog/ArticleContentRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SocialShare } from "@/components/blog/SocialShare";
import { ArticleNavPrevNext } from "@/components/blog/ArticleNavPrevNext";
import { BlogCard } from "@/components/blog/BlogCard";
import { renderMarkdownToHtml, extractTableOfContents } from "@/lib/blog/markdown";
import { Calendar, Clock, Star, Tag, ChevronRight, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      tags: { select: { name: true } },
      categories: { select: { name: true } },
    },
  });

  if (!article) {
    return {
      title: "Article Not Found | Seyedali Rafazi Blog",
      robots: { index: false, follow: false },
    };
  }

  return getArticleMetadata(
    {
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      coverImage: article.coverImage,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      canonicalUrl: article.canonicalUrl,
      tags: article.tags,
      category: article.categories[0] || null,
    },
    "en"
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: true,
      categories: true,
      tags: true,
    },
  });

  if (!article) {
    notFound();
  }

  // Pre-render markdown to syntax highlighted HTML and extract TOC
  const htmlContent = renderMarkdownToHtml(article.content);
  const headings = extractTableOfContents(article.content);

  // Prev / Next articles
  const [prevArticle, nextArticle, relatedArticles] = await Promise.all([
    prisma.article.findFirst({
      where: {
        status: "PUBLISHED",
        publishedAt: { lt: article.publishedAt || article.createdAt },
      },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.article.findFirst({
      where: {
        status: "PUBLISHED",
        publishedAt: { gt: article.publishedAt || article.createdAt },
      },
      orderBy: { publishedAt: "asc" },
      select: { title: true, slug: true },
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: article.id },
        OR: [
          {
            categories: {
              some: { id: { in: article.categories.map((c) => c.id) } },
            },
          },
          {
            tags: {
              some: { id: { in: article.tags.map((t) => t.id) } },
            },
          },
        ],
      },
      take: 3,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true, avatar: true } },
        categories: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  // Structured Data (JSON-LD)
  const jsonLdData = getArticleSchema(
    {
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      authorName: article.author?.name,
      authorAvatar: article.author?.avatar,
      tags: article.tags.map((t) => t.name),
    },
    "en"
  );

  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* Ambient background glows */}
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      {/* Main navigation */}
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[var(--muted)] flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-[var(--text-bright)] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--muted-2)]" />
          <Link
            href="/blog"
            className="hover:text-[var(--text-bright)] transition-colors"
          >
            Blog
          </Link>
          {article.categories[0] && (
            <>
              <ChevronRight className="w-3 h-3 text-[var(--muted-2)]" />
              <Link
                href={`/blog/category/${article.categories[0].slug}`}
                className="hover:text-[var(--text-bright)] transition-colors"
              >
                {article.categories[0].name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[var(--muted-2)]" />
          <span className="text-[var(--text-bright)] truncate max-w-[220px]">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            {article.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                <Star className="w-3 h-3 fill-purple-400" />
                <span>Featured</span>
              </span>
            )}
            {article.categories.map((c) => (
              <Link
                key={c.id}
                href={`/blog/category/${c.slug}`}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/15 text-[var(--primary-light)] hover:bg-[var(--primary)]/25 border border-[var(--primary)]/30 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-bright)] tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-[var(--muted)] leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Meta bar: Author, Dates, Reading Time */}
          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-sm">
                <img
                  src={article.author?.avatar || "/my-photo.png"}
                  alt={article.author?.name || "Author"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-bright)]">
                  {article.author?.name || "Seyedali Rafazi"}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {article.author?.name ? "Engineering Author" : "Frontend Engineer"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--muted)] flex-wrap">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--primary)]" />
                <span>
                  {new Date(
                    article.publishedAt || article.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                <span>{article.readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--surface-2)] aspect-[16/9] max-h-[520px]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents Sticky Sidebar */}
          {headings.length > 0 && (
            <aside className="lg:col-span-4 lg:sticky lg:top-24 order-2 lg:order-1">
              <TableOfContents headings={headings} />
            </aside>
          )}

          {/* Main Article Content */}
          <div
            className={`${
              headings.length > 0 ? "lg:col-span-8" : "lg:col-span-12"
            } order-1 lg:order-2 space-y-10`}
          >
            <ArticleContentRenderer htmlContent={htmlContent} />

            {/* Tags Pills */}
            {article.tags.length > 0 && (
              <div className="pt-6 border-t border-[var(--border)] flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-[var(--muted)] mr-1" />
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--primary-light)] hover:bg-[var(--surface-3)] border border-[var(--border)] transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Social Sharing Bar */}
            <div className="pt-6 border-t border-[var(--border)]">
              <SocialShare
                title={article.title}
                url={`https://www.seyedalirafazi.ir/blog/${article.slug}`}
              />
            </div>

            {/* Prev & Next Post Nav */}
            <ArticleNavPrevNext prev={prevArticle} next={nextArticle} />
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-[var(--border)] space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-bright)] tracking-tight">
                Related Engineering Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <BlogCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
