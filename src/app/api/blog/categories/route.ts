import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createCategorySchema } from "@/lib/validations/blog";
import { generateSlug } from "@/lib/blog/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      articleCount: c._count.articles,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error: any) {
    console.error("[API_BLOG_CATEGORIES_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch categories.", details: error?.message },
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
    const body = await req.json();
    const parseResult = createCategorySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description } = parseResult.data;
    let slug = parseResult.data.slug || generateSlug(name);

    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath("/blog");
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("[API_BLOG_CATEGORIES_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create category.", details: error?.message },
      { status: 500 }
    );
  }
}
