/**
 * Sanitizes input strings to prevent XSS and remove unexpected control characters.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Remove control characters (except newline and carriage return)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Strip script and html tags
    .replace(/<[^>]*>?/gm, "")
    .trim();
}

/**
 * Escapes characters for safe display in HTML environments if needed.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
