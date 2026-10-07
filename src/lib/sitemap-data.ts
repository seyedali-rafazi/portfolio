import { siteConfig } from "@/config/site";
import { PROJECTS } from "@/data/portfolioData";

export type SitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: SitemapRoute["changeFrequency"];
  priority: number;
  alternates: {
    en: string;
    fa: string;
    "x-default": string;
  };
};

export function getSitemapRoutes(): SitemapRoute[] {
  return [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    ...PROJECTS.map((project) => ({
      path: `/projects/${project.id}`,
      priority: 0.85,
      changeFrequency: "weekly" as const,
    })),
    { path: "/skills", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  ];
}

export function getSitemapEntries(now = new Date()): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const route of getSitemapRoutes()) {
    const isRoot = route.path === "/";
    const pathSuffix = isRoot ? "" : route.path;

    const enUrl = `${siteConfig.url}${pathSuffix}`;

    const faUrl = `${siteConfig.url}/fa${pathSuffix}`;

    const alternates = {
      en: enUrl,
      fa: faUrl,
      "x-default": enUrl,
    };

    entries.push(
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates,
      },
      {
        url: faUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates,
      },
    );
  }

  return entries;
}
