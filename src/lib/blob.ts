import { put, del, list, type PutBlobResult, type ListBlobResult } from "@vercel/blob";

export const BLOB_STORE_ID = process.env.BLOB_STORE_ID;
export const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Checks if Vercel Blob credentials are configured.
 */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export interface UploadBlobOptions {
  pathname: string;
  contentType?: string;
  addRandomSuffix?: boolean;
}

/**
 * Uploads a file/buffer to Vercel Blob store.
 *
 * @param data - The file data as Buffer, Blob, or File
 * @param options - Upload options including target pathname, content-type, etc.
 * @returns Upload result with public URL
 */
export async function uploadBlogImage(
  data: Buffer | Blob | File,
  options: UploadBlobOptions
): Promise<PutBlobResult> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN environment variable is not configured for Vercel Blob."
    );
  }

  // Normalize path inside blog folder if not already prefixed
  const pathname = options.pathname.startsWith("blog/")
    ? options.pathname
    : `blog/${options.pathname}`;

  return await put(pathname, data, {
    access: "public",
    token,
    contentType: options.contentType,
    addRandomSuffix: options.addRandomSuffix ?? true,
  });
}

/**
 * Deletes one or multiple blobs from Vercel Blob store.
 *
 * @param urlOrPathname - URL or pathname of blob(s) to delete
 */
export async function deleteBlogImage(
  urlOrPathname: string | string[]
): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  await del(urlOrPathname, { token });
}

/**
 * Lists blobs in the store.
 */
export async function listBlogImages(options?: {
  prefix?: string;
  limit?: number;
}): Promise<ListBlobResult> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return await list({
    prefix: options?.prefix ?? "blog/",
    limit: options?.limit,
    token,
  });
}
