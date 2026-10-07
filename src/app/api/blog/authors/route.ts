import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    let authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
    });

    if (authors.length === 0) {
      // Create initial author if none exists
      const defaultAuthor = await prisma.author.create({
        data: {
          name: "Seyedali Rafazi",
          email: "seyedalirafazi@gmail.com",
          bio: "Frontend Engineer specializing in React, Next.js, TypeScript, and Geospatial architectures.",
          avatar: "/my-photo.png",
        },
      });
      authors = [defaultAuthor];
    }

    return NextResponse.json({ authors });
  } catch (error: any) {
    console.error("[API_BLOG_AUTHORS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch authors.", details: error?.message },
      { status: 500 }
    );
  }
}
