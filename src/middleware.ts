import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Enforce clean, prefix-free English URLs:
  // If an incoming request uses /en or /en/*, permanently redirect (301) to clean URL.
  if (pathname === "/en") {
    const cleanUrl = new URL(`/${search}`, request.url);
    return NextResponse.redirect(cleanUrl, 301);
  }

  if (pathname.startsWith("/en/")) {
    const cleanPath = pathname.replace(/^\/en/, "");
    const cleanUrl = new URL(`${cleanPath}${search}`, request.url);
    return NextResponse.redirect(cleanUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, public files (svg, png, jpg, woff2)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)).*)",
  ],
};
