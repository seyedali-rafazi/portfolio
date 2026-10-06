import type { SitemapEntry } from "@/lib/sitemap-data";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatLastModified(date: Date): string {
  return date.toISOString();
}

function renderUrl(entry: SitemapEntry): string {
  const { url, lastModified, changeFrequency, priority, alternates } = entry;

  return [
    "<url>",
    `<loc>${escapeXml(url)}</loc>`,
    `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(alternates.en)}" />`,
    `<xhtml:link rel="alternate" hreflang="fa" href="${escapeXml(alternates.fa)}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(alternates["x-default"])}" />`,
    `<lastmod>${formatLastModified(lastModified)}</lastmod>`,
    `<changefreq>${changeFrequency}</changefreq>`,
    `<priority>${priority}</priority>`,
    "</url>",
  ].join("\n");
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const body = entries.map(renderUrl).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    body,
    "</urlset>",
  ].join("\n");
}
