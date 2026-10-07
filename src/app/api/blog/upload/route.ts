import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported types: JPG, PNG, WEBP, GIF, SVG, AVIF." },
        { status: 400 }
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB maximum limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";

    const uniqueName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("[API_BLOG_UPLOAD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upload image.", details: error?.message },
      { status: 500 }
    );
  }
}
