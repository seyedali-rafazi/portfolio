import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { updateArticleSchema } from "@/lib/validations/blog";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { generateSlug } from "@/lib/blog/slug";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await verifyAdminRequest(req);

    const post = await prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    if (post.status !== "PUBLISHED" && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("[API_BLOG_POST_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to retrieve article.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.article.findUnique({
      where: { id },
      include: { categories: true, tags: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const rawBody = await req.json();
    const parseResult = updateArticleSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check slug uniqueness if slug is being updated
    let slug = data.slug ? generateSlug(data.slug) : undefined;
    if (slug && slug !== existing.slug) {
      const slugCollision = await prisma.article.findUnique({
        where: { slug },
      });
      if (slugCollision && slugCollision.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    // Reading time recalculation if content updated
    let readingTime = data.readingTime;
    if (data.content && !readingTime) {
      readingTime = calculateReadingTime(data.content);
    }

    // Published date update logic
    let publishedAt = existing.publishedAt;
    if (data.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (data.status === "DRAFT" && rawBody.resetPublishedAt) {
      publishedAt = null;
    }

    const updateData: any = {
      ...(data.title !== undefined && { title: data.title }),
      ...(slug !== undefined && { slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(readingTime !== undefined && { readingTime }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
      publishedAt,
    };

    if (data.authorId) {
      updateData.author = { connect: { id: data.authorId } };
    }

    if (Array.isArray(data.categoryIds)) {
      updateData.categories = {
        set: data.categoryIds.map((catId) => ({ id: catId })),
      };
    }

    if (Array.isArray(data.tagIds)) {
      updateData.tags = {
        set: data.tagIds.map((tagId) => ({ id: tagId })),
      };
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    if (slug && slug !== existing.slug) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error("[API_BLOG_POST_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update article.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.article.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    await prisma.article.delete({
      where: { id },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error: any) {
    console.error("[API_BLOG_POST_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete article.", details: error?.message },
      { status: 500 }
    );
  }
}
