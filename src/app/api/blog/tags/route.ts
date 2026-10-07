import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createTagSchema } from "@/lib/validations/blog";
import { generateSlug } from "@/lib/blog/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
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

    const formatted = tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      articleCount: t._count.articles,
      createdAt: t.createdAt,
    }));

    return NextResponse.json({ tags: formatted });
  } catch (error: any) {
    console.error("[API_BLOG_TAGS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch tags.", details: error?.message },
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
    const parseResult = createTagSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name } = parseResult.data;
    let slug = parseResult.data.slug || generateSlug(name);

    const existingSlug = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    revalidatePath("/blog");
    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (error: any) {
    console.error("[API_BLOG_TAGS_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create tag.", details: error?.message },
      { status: 500 }
    );
  }
}
