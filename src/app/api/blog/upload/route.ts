import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  isBlobConfigured,
  uploadBlogImage,
  deleteBlogImage,
} from "@/lib/blob";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

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

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Supported types: JPG, PNG, WEBP, GIF, SVG, AVIF.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB maximum limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension & original filename
    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .substring(0, 50) || "post-img";

    const fileNameWithExt = `${baseName}.${ext}`;

    // Upload to Vercel Blob if credentials are configured
    if (isBlobConfigured()) {
      const blobResult = await uploadBlogImage(buffer, {
        pathname: fileNameWithExt,
        contentType: file.type,
        addRandomSuffix: true,
      });

      return NextResponse.json({
        success: true,
        url: blobResult.url,
        fileName: file.name,
        pathname: blobResult.pathname,
        contentType: blobResult.contentType,
        size: file.size,
      });
    }

    // Local filesystem fallback (for offline local development without credentials)
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

export async function DELETE(req: Request) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let targetUrl = searchParams.get("url");

    if (!targetUrl) {
      const body = await req.json().catch(() => ({}));
      targetUrl = body.url;
    }

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Missing image URL to delete." },
        { status: 400 }
      );
    }

    if (
      isBlobConfigured() &&
      (targetUrl.includes(".blob.vercel-storage.com") || targetUrl.startsWith("blog/"))
    ) {
      await deleteBlogImage(targetUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error: any) {
    console.error("[API_BLOG_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete image.", details: error?.message },
      { status: 500 }
    );
  }
}
