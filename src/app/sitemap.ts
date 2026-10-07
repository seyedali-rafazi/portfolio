import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getSitemapEntries } from "@/lib/sitemap-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries = getSitemapEntries();
  const nextEntries: MetadataRoute.Sitemap = baseEntries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
    alternates: {
      languages: {
        en: e.alternates.en,
        fa: e.alternates.fa,
        "x-default": e.alternates["x-default"],
      },
    },
  }));

  try {
    const publishedArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    for (const article of publishedArticles) {
      const enUrl = `${siteConfig.url}/blog/${article.slug}`;
      const faUrl = `${siteConfig.url}/fa/blog/${article.slug}`;
      const lastModified = article.updatedAt || article.publishedAt || new Date();

      nextEntries.push({
        url: enUrl,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: {
          languages: {
            en: enUrl,
            fa: faUrl,
            "x-default": enUrl,
          },
        },
      });
    }
  } catch (err) {
    console.error("[SITEMAP_FETCH_ARTICLES_ERROR]", err);
  }

  return nextEntries;
}
