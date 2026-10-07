import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { ArticleContentRenderer } from "@/components/blog/ArticleContentRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SocialShare } from "@/components/blog/SocialShare";
import { renderMarkdownToHtml, extractTableOfContents } from "@/lib/blog/markdown";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  FileEdit,
  Send,
  Star,
  Tag,
  Shield,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Article Preview | Admin CMS",
  description: "Preview unpublished draft or published article.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminArticlePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: true,
      categories: true,
      tags: true,
    },
  });

  if (!article) {
    notFound();
  }

  const htmlContent = renderMarkdownToHtml(article.content);
  const headings = extractTableOfContents(article.content);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-[var(--primary)] selection:text-white">
        {/* Background glow effects */}
        <div className="bg-glow one pointer-events-none opacity-40" />
        <div className="bg-glow two pointer-events-none opacity-30" />

        {/* Top Preview Status Banner */}
        <div className="sticky top-0 z-50 bg-amber-500/15 border-b border-amber-500/30 backdrop-blur-xl px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-amber-300">
              <Eye className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Admin Preview Mode:</strong> This page renders your article using the exact production renderer.
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {article.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/blog/posts"
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-xs text-[var(--muted)] hover:text-white transition-colors"
              >
                Back to Posts
              </Link>
              <Link
                href={`/admin/blog/posts/${article.id}/edit`}
                className="px-3.5 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-xs font-semibold text-[var(--text-bright)] flex items-center gap-1.5 transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                <span>Edit Article</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Article Container */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href="/blog" className="hover:text-[var(--text-bright)] transition-colors">
              Blog
            </Link>
            <span>/</span>
            {article.categories[0] && (
              <>
                <span className="text-[var(--text-bright)]">{article.categories[0].name}</span>
                <span>/</span>
              </>
            )}
            <span className="truncate max-w-[200px] text-[var(--muted-2)]">Preview</span>
          </div>

          {/* Article Header */}
          <header className="space-y-4">
            {/* Category pills and featured badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {article.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-purple-400" />
                  <span>Featured</span>
                </span>
              )}
              {article.categories.map((c) => (
                <span
                  key={c.id}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30"
                >
                  {c.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-bright)] tracking-tight leading-[1.15]">
              {article.title}
            </h1>

            <p className="text-base sm:text-xl text-[var(--muted)] leading-relaxed font-normal">
              {article.excerpt}
            </p>

            {/* Author and Date Meta Bar */}
            <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
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
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
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
            <div className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--surface-2)] aspect-[16/9] max-h-[500px]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body & Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Table of contents sidebar */}
            {headings.length > 0 && (
              <aside className="lg:col-span-4 lg:sticky lg:top-20 order-2 lg:order-1">
                <TableOfContents headings={headings} />
              </aside>
            )}

            {/* Main content */}
            <div
              className={`${
                headings.length > 0 ? "lg:col-span-8" : "lg:col-span-12"
              } order-1 lg:order-2 space-y-8`}
            >
              <ArticleContentRenderer htmlContent={htmlContent} />

              {/* Tags list */}
              {article.tags.length > 0 && (
                <div className="pt-6 border-t border-[var(--border)] flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-[var(--muted)] mr-1" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Share Bar */}
              <div className="pt-6 border-t border-[var(--border)]">
                <SocialShare
                  title={article.title}
                  url={`https://www.seyedalirafazi.ir/blog/${article.slug}`}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
