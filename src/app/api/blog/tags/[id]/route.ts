import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { updateTagSchema } from "@/lib/validations/blog";
import { generateSlug } from "@/lib/blog/slug";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.tag.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Tag not found." }, { status: 404 });
    }

    const body = await req.json();
    const parseResult = updateTagSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, slug: newSlugRaw } = parseResult.data;
    let slug = newSlugRaw ? generateSlug(newSlugRaw) : undefined;

    if (slug && slug !== existing.slug) {
      const slugCollision = await prisma.tag.findUnique({ where: { slug } });
      if (slugCollision && slugCollision.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const updated = await prisma.tag.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/tag/${existing.slug}`);
    if (slug && slug !== existing.slug) {
      revalidatePath(`/blog/tag/${slug}`);
    }

    return NextResponse.json({ success: true, tag: updated });
  } catch (error: any) {
    console.error("[API_BLOG_TAG_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update tag.", details: error?.message },
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
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found." }, { status: 404 });
    }

    if (tag._count.articles > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag "${tag.name}" because it is currently linked to ${tag._count.articles} article(s). Please unassign this tag from articles first.`,
        },
        { status: 400 }
      );
    }

    await prisma.tag.delete({ where: { id } });

    revalidatePath("/blog");
    revalidatePath(`/blog/tag/${tag.slug}`);

    return NextResponse.json({ success: true, message: "Tag deleted." });
  } catch (error: any) {
    console.error("[API_BLOG_TAG_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete tag.", details: error?.message },
      { status: 500 }
    );
  }
}
