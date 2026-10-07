import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createArticleSchema } from "@/lib/validations/blog";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { generateSlug } from "@/lib/blog/slug";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = await verifyAdminRequest(req);

    const statusParam = searchParams.get("status");
    const categorySlug = searchParams.get("category");
    const tagSlug = searchParams.get("tag");
    const featuredParam = searchParams.get("featured");
    const search = (searchParams.get("search") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Only admins can see drafts or request all statuses
    if (!isAdmin) {
      where.status = "PUBLISHED";
    } else if (statusParam && statusParam !== "ALL") {
      where.status = statusParam;
    }

    if (featuredParam === "true") {
      where.featured = true;
    } else if (featuredParam === "false") {
      where.featured = false;
    }

    if (categorySlug) {
      where.categories = {
        some: { slug: categorySlug },
      };
    }

    if (tagSlug) {
      where.tags = {
        some: { slug: tagSlug },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total, stats] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          categories: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.article.count({ where }),
      isAdmin
        ? Promise.all([
            prisma.article.count(),
            prisma.article.count({ where: { status: "PUBLISHED" } }),
            prisma.article.count({ where: { status: "DRAFT" } }),
            prisma.article.count({ where: { featured: true } }),
          ]).then(([all, pub, draft, feat]) => ({
            total: all,
            published: pub,
            drafts: draft,
            featured: feat,
          }))
        : null,
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      stats,
    });
  } catch (error: any) {
    console.error("[API_BLOG_POSTS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to retrieve blog posts.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parseResult = createArticleSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check slug uniqueness; if taken, append timestamp suffix
    let finalSlug = data.slug || generateSlug(data.title);
    const existingSlug = await prisma.article.findUnique({
      where: { slug: finalSlug },
    });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString(36)}`;
    }

    // Reading time calculation
    const readingTime = data.readingTime || calculateReadingTime(data.content);

    // Published date logic
    const publishedAt = data.status === "PUBLISHED" ? new Date() : null;

    // Handle or create default author if not provided
    let authorId = data.authorId;
    if (!authorId) {
      let defaultAuthor = await prisma.author.findFirst();
      if (!defaultAuthor) {
        defaultAuthor = await prisma.author.create({
          data: {
            name: "Seyedali Rafazi",
            bio: "Frontend Engineer specializing in React, Next.js, and Geospatial architectures.",
            avatar: "/my-photo.png",
          },
        });
      }
      authorId = defaultAuthor.id;
    }

    const post = await prisma.article.create({
      data: {
        title: data.title,
        slug: finalSlug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        featured: data.featured,
        readingTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        canonicalUrl: data.canonicalUrl,
        publishedAt,
        author: { connect: { id: authorId } },
        categories: {
          connect: (data.categoryIds || []).map((id) => ({ id })),
        },
        tags: {
          connect: (data.tagIds || []).map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    // Revalidate affected cache paths
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    console.error("[API_BLOG_POSTS_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create blog post.", details: error?.message },
      { status: 500 }
    );
  }
}
