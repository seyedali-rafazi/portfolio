import { Metadata } from "next";
import { Suspense } from "react";
import { getBlogMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryFilterNav } from "@/components/blog/CategoryFilterNav";
import { BlogFeed } from "@/components/blog/BlogFeed";
import { getBlogShell } from "@/lib/blog/listing";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getBlogMetadata("fa");

export default async function FaBlogPage() {
  const { featuredArticle, categories } = await getBlogShell();

  return (
    <>
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      <Navbar />

      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 flex flex-col gap-12"
        id="main-content"
      >
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
        </section>

        {categories.length > 0 && (
          <div className="flex justify-center">
            <CategoryFilterNav categories={categories} locale="fa" />
          </div>
        )}

        <Suspense fallback={null}>
          <BlogFeed
            locale="fa"
            basePath="/fa/blog"
            featuredArticle={JSON.parse(JSON.stringify(featuredArticle))}
          />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
