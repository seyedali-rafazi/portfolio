import fa from "./locales/fa.json";
import en from "./locales/en.json";

export type Locale = "en" | "fa";

export const dictionaries = {
  fa,
  en,
};

export type TranslationKeys = typeof en;

// Helper to get nested value by dot notation like 'hero.title'
export function getNestedTranslation(
  obj: Record<string, unknown>,
  path: string
): string {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }

  return typeof current === "string" ? current : path;
}

/**
 * Returns a locale-aware internal URL.
 * English routes stay clean without prefix (e.g. /, /about, /projects)
 * Persian routes are prefixed with /fa (e.g. /fa, /fa/about, /fa/projects)
 */
export function getLocalizedHref(path: string, locale: Locale): string {
  // External links, mailto, tel, or hash-only links
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  // Parse path and potential query/hash
  const [withoutHash, hash] = path.split("#");
  const hashSuffix = hash !== undefined ? `#${hash}` : "";
  const [pathname, ...rest] = withoutHash.split("?");
  const searchSuffix = rest.length > 0 ? `?${rest.join("?")}` : "";
  const suffix = `${searchSuffix}${hashSuffix}`;

  // Persian
  if (locale === "fa") {
    if (pathname === "/" || pathname === "") {
      return `/fa${suffix}`;
    }
    if (pathname.startsWith("/fa")) {
      return `${pathname}${suffix}`;
    }
    return `/fa${pathname}${suffix}`;
  }

  // English (default - no prefix)
  if (pathname === "/fa") {
    return `/${suffix}`;
  }
  if (pathname.startsWith("/fa/")) {
    const clean = pathname.replace(/^\/fa/, "");
    return `${clean || "/"}${suffix}`;
  }
  return `${pathname}${suffix}`;
}

/**
 * Given the current pathname, returns the reciprocal path for switching to targetLocale.
 * Preserves the sub-path exactly:
 * /about -> switch to fa -> /fa/about
 * /fa/about -> switch to en -> /about
 * /blog -> switch to fa -> /fa/blog
 * /fa/blog -> switch to en -> /blog
 * /blog/slug -> switch to fa -> /fa/blog/slug
 * /fa/blog/slug -> switch to en -> /blog/slug
 * / -> switch to fa -> /fa
 * /fa -> switch to en -> /
 */
export function getAlternateLocalePath(pathname: string, targetLocale: Locale): string {
  const [withoutHash, hash] = pathname.split("#");
  const hashSuffix = hash !== undefined ? `#${hash}` : "";
  const [cleanPath, ...rest] = withoutHash.split("?");
  const searchSuffix = rest.length > 0 ? `?${rest.join("?")}` : "";
  const suffix = `${searchSuffix}${hashSuffix}`;

  if (targetLocale === "fa") {
    if (cleanPath === "/blog") {
      return `/fa/blog${suffix}`;
    }
    if (cleanPath.startsWith("/blog/")) {
      return `/fa${cleanPath}${suffix}`;
    }
    if (cleanPath.startsWith("/fa")) {
      return `${cleanPath}${suffix}`;
    }
    return cleanPath === "/" || cleanPath === "" ? `/fa${suffix}` : `/fa${cleanPath}${suffix}`;
  }

  // targetLocale === "en"
  if (cleanPath === "/fa/blog") {
    return `/blog${suffix}`;
  }
  if (cleanPath.startsWith("/fa/blog/")) {
    const stripped = cleanPath.replace(/^\/fa/, "");
    return `${stripped}${suffix}`;
  }
  if (cleanPath === "/fa") {
    return `/${suffix}`;
  }
  if (cleanPath.startsWith("/fa/")) {
    const stripped = cleanPath.replace(/^\/fa/, "");
    return `${stripped || "/"}${suffix}`;
  }
  return `${cleanPath}${suffix}`;
}
