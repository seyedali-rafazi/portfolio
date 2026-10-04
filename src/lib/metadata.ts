import type { Metadata } from "next";
import { siteConfig, type Locale } from "@/config/site";
import { dictionaries } from "@/i18n";

interface PageMetadataOptions {
  locale: Locale;
  path: string; // unprefixed path, e.g. "/", "/about", "/projects", "/skills", "/contact"
  title: string;
  description: string;
  keywords?: string[];
  ogType?: "website" | "profile" | "article";
}

/**
 * Builds standard, strict, Google-compliant bilingual SEO metadata for Next.js App Router.
 * - Deterministic, self-referencing canonical URL
 * - Reciprocal bidirectional hreflang (en, fa, x-default)
 * - Open Graph & Twitter Card metadata
 * - Safe robot indexing rules
 */
export function buildLocalizedMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  ogType = "website",
}: PageMetadataOptions): Metadata {
  const isEn = locale === "en";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const pathSuffix = cleanPath === "/" ? "" : cleanPath;

  // Canonical URLs
  const enUrl = `${siteConfig.url}${pathSuffix}`;
  const faUrl = `${siteConfig.url}/fa${pathSuffix}`;
  const currentCanonical = isEn ? enUrl : faUrl;

  const defaultKeywords = isEn
    ? [
        "Seyekali Rafazi",
        "Frontend Engineer",
        "React",
        "Next.js",
        "TypeScript",
        "Geospatial",
        "MapLibre",
        "CesiumJS",
        "Web Development",
        "Portfolio",
      ]
    : [
        "سید علی رفضی",
        "مهندس فرانت‌اند",
        "توسعه‌دهنده React",
        "Next.js",
        "تایپ‌اسکریپت",
        "سامانه‌های مکانی",
        "سزیم",
        "مپ‌لیبره",
        "نمونه کار",
      ];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: isEn ? `%s | ${siteConfig.name}` : `%s | ${siteConfig.nameFa}`,
    },
    description,
    keywords: keywords || defaultKeywords,
    authors: [{ name: isEn ? siteConfig.name : siteConfig.nameFa, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: currentCanonical,
      languages: {
        en: enUrl,
        fa: faUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: currentCanonical,
      siteName: isEn ? siteConfig.name : siteConfig.nameFa,
      locale: isEn ? "en_US" : "fa_IR",
      alternateLocale: isEn ? "fa_IR" : "en_US",
      type: ogType,
      images: [
        {
          url: `${siteConfig.url}/my-photo.png`,
          width: 800,
          height: 800,
          alt: isEn
            ? "Seyekali Rafazi — Frontend Engineer"
            : "سید علی رفضی — مهندس فرانت‌اند",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.socialHandles.twitter,
      images: [`${siteConfig.url}/my-photo.png`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getRootMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return buildLocalizedMetadata({
    locale,
    path: "/",
    title: dict.homeTitle,
    description: dict.homeDesc,
  });
}

export function getHomeMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return buildLocalizedMetadata({
    locale,
    path: "/",
    title: dict.homeTitle,
    description: dict.homeDesc,
  });
}

export function getAboutMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return buildLocalizedMetadata({
    locale,
    path: "/about",
    title: dict.aboutTitle,
    description: dict.aboutDesc,
    ogType: "profile",
  });
}

import type { Project } from "@/types";

export function getProjectsMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return buildLocalizedMetadata({
    locale,
    path: "/projects",
    title: dict.projectsTitle,
    description: dict.projectsDesc,
  });
}

export function getSingleProjectMetadata(locale: Locale, project: Project): Metadata {
  const isEn = locale === "en";
  const title = isEn
    ? `${project.title} — Technical Case Study & Architecture`
    : `${project.titleFa || project.title} — مطالعه موردی و بررسی فنی معماری`;
  const description = project.summary[locale];

  return buildLocalizedMetadata({
    locale,
    path: `/projects/${project.id}`,
    title,
    description,
    keywords: [...project.tags, project.title, "Seyekali Rafazi"],
    ogType: "article",
  });
}

export function getSkillsMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return buildLocalizedMetadata({
    locale,
    path: "/skills",
    title: dict.skillsTitle,
    description: dict.skillsDesc,
  });
}

export function getContactMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return buildLocalizedMetadata({
    locale,
    path: "/contact",
    title: dict.contactTitle,
    description: dict.contactDesc,
  });
}

export function getNotFoundMetadata(locale: Locale): Metadata {
  const dict = dictionaries[locale].seo;
  return {
    title: dict.notFoundTitle,
    description: dict.notFoundDesc,
    robots: {
      index: false,
      follow: false,
    },
  };
}
