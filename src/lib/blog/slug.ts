/**
 * Generates a clean, URL-safe slug from a string.
 * Supports English and non-ASCII (e.g. Persian) characters,
 * trims leading/trailing hyphens, and avoids consecutive hyphens.
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with a hyphen
    .replace(/[\s_]+/g, "-")
    // Remove unwanted characters (keep alphanumeric, hyphens, and unicode letters)
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    // Remove consecutive hyphens
    .replace(/-+/g, "-")
    // Trim hyphens from edges
    .replace(/^-+|-+$/g, "");
}

/**
 * Validates whether a slug matches standard URL slug conventions.
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 120) return false;
  // Slug should not contain whitespace or consecutive hyphens
  return /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug);
}
