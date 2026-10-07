import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { updateCategorySchema } from "@/lib/validations/blog";
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
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const body = await req.json();
    const parseResult = updateCategorySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, slug: newSlugRaw, description } = parseResult.data;
    let slug = newSlugRaw ? generateSlug(newSlugRaw) : undefined;

    if (slug && slug !== existing.slug) {
      const slugCollision = await prisma.category.findUnique({ where: { slug } });
      if (slugCollision && slugCollision.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/category/${existing.slug}`);
    if (slug && slug !== existing.slug) {
      revalidatePath(`/blog/category/${slug}`);
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("[API_BLOG_CATEGORY_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update category.", details: error?.message },
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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    if (category._count.articles > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}" because it is currently linked to ${category._count.articles} article(s). Please remove or reassign these articles first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/blog");
    revalidatePath(`/blog/category/${category.slug}`);

    return NextResponse.json({ success: true, message: "Category deleted." });
  } catch (error: any) {
    console.error("[API_BLOG_CATEGORY_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete category.", details: error?.message },
      { status: 500 }
    );
  }
}
