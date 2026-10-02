import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/skills", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const now = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const isRoot = route.path === "/";
    const pathSuffix = isRoot ? "" : route.path;

    const enUrl = `${siteConfig.url}${pathSuffix}`;
    const faUrl = `${siteConfig.url}/fa${pathSuffix}`;

    const languages = {
      en: enUrl,
      fa: faUrl,
      "x-default": enUrl,
    };

    // English URL entry
    sitemapEntries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages,
      },
    });

    // Persian URL entry
    sitemapEntries.push({
      url: faUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages,
      },
    });
  }

  return sitemapEntries;
}
