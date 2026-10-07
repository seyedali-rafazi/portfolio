import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

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
    });

    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: existing.publishedAt || new Date(),
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error("[API_BLOG_PUBLISH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to publish article.", details: error?.message },
      { status: 500 }
    );
  }
}
