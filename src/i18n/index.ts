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
  const [pathname, ...rest] = path.split("?");
  const searchOrHash = rest.length > 0 ? `?${rest.join("?")}` : "";

  // Persian
  if (locale === "fa") {
    if (pathname === "/" || pathname === "") {
      return `/fa${searchOrHash}`;
    }
    if (pathname.startsWith("/fa")) {
      return `${pathname}${searchOrHash}`;
    }
    return `/fa${pathname}${searchOrHash}`;
  }

  // English (default - no prefix)
  if (pathname === "/fa") {
    return `/${searchOrHash}`;
  }
  if (pathname.startsWith("/fa/")) {
    const clean = pathname.replace(/^\/fa/, "");
    return `${clean || "/"}${searchOrHash}`;
  }
  return `${pathname}${searchOrHash}`;
}

/**
 * Given the current pathname, returns the reciprocal path for switching to targetLocale.
 * Preserves the sub-path exactly:
 * /about -> switch to fa -> /fa/about
 * /fa/about -> switch to en -> /about
 * / -> switch to fa -> /fa
 * /fa -> switch to en -> /
 */
export function getAlternateLocalePath(pathname: string, targetLocale: Locale): string {
  if (targetLocale === "fa") {
    if (pathname.startsWith("/fa")) {
      return pathname;
    }
    return pathname === "/" || pathname === "" ? "/fa" : `/fa${pathname}`;
  }

  // targetLocale === "en"
  if (pathname === "/fa") {
    return "/";
  }
  if (pathname.startsWith("/fa/")) {
    const stripped = pathname.replace(/^\/fa/, "");
    return stripped || "/";
  }
  return pathname;
}
