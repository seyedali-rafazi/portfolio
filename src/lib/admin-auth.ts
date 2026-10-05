import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "portfolio_admin_token";
export const DEFAULT_ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

/**
 * Validates whether the incoming request is authenticated as Admin.
 * Checks HTTP-Only cookie first, then fallback to Authorization header or x-admin-token.
 */
export async function verifyAdminRequest(req?: Request): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;

  // 1. Check HTTP-Only cookie via Next.js cookies()
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (tokenCookie && tokenCookie === secret) {
      return true;
    }
  } catch {
    // cookies() might fail if called outside request context
  }

  // 2. Check Request headers if available
  if (req) {
    const headerToken = req.headers.get("x-admin-token");
    if (headerToken && headerToken === secret) {
      return true;
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token === secret) {
        return true;
      }
    }
  }

  return false;
}
