import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { generateSlug } from "@/lib/blog/slug";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.article.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const newTitle = `${existing.title} (Copy)`;
    const newSlug = `${generateSlug(existing.slug)}-copy-${Date.now().toString(36)}`;

    const duplicated = await prisma.article.create({
      data: {
        title: newTitle,
        slug: newSlug,
        excerpt: existing.excerpt,
        content: existing.content,
        coverImage: existing.coverImage,
        status: "DRAFT",
        featured: false,
        readingTime: existing.readingTime,
        seoTitle: existing.seoTitle,
        seoDescription: existing.seoDescription,
        authorId: existing.authorId,
        categories: {
          connect: existing.categories.map((c) => ({ id: c.id })),
        },
        tags: {
          connect: existing.tags.map((t) => ({ id: t.id })),
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json({ success: true, post: duplicated }, { status: 201 });
  } catch (error: any) {
    console.error("[API_BLOG_DUPLICATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to duplicate article.", details: error?.message },
      { status: 500 }
    );
  }
}
