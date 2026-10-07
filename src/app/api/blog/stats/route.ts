import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      featuredArticles,
      totalCategories,
      totalTags,
      recentArticles,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.article.count({ where: { featured: true } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          categories: { select: { id: true, name: true } },
          author: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalArticles,
      publishedArticles,
      draftArticles,
      featuredArticles,
      totalCategories,
      totalTags,
      recentArticles,
    });
  } catch (error: any) {
    console.error("[API_BLOG_STATS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch blog stats.", details: error?.message },
      { status: 500 }
    );
  }
}
