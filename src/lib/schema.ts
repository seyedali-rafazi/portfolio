import { siteConfig, type Locale } from "@/config/site";

export function getPersonSchema(locale: Locale) {
  const isEn = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: isEn ? siteConfig.name : siteConfig.nameFa,
    alternateName: isEn ? siteConfig.nameFa : siteConfig.name,
    url: isEn ? siteConfig.url : `${siteConfig.url}/fa`,
    image: `${siteConfig.url}/my-photo.png`,
    jobTitle: isEn ? "Frontend Engineer" : "مهندس فرانت‌اند",
    description: isEn ? siteConfig.descriptionEn : siteConfig.descriptionFa,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: isEn ? siteConfig.locationEn : siteConfig.locationFa,
      addressCountry: isEn ? "Iran" : "ایران",
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.telegram,
      siteConfig.links.twitter,
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "MapLibre GL JS",
      "CesiumJS",
      "Geospatial Information Systems (GIS)",
      "Web Performance Optimization",
      "Frontend Architecture",
    ],
  };
}

export function getWebSiteSchema(locale: Locale) {
  const isEn = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: isEn ? siteConfig.titleEn : siteConfig.titleFa,
    url: isEn ? siteConfig.url : `${siteConfig.url}/fa`,
    inLanguage: isEn ? "en-US" : "fa-IR",
    description: isEn ? siteConfig.descriptionEn : siteConfig.descriptionFa,
    publisher: {
      "@type": "Person",
      name: isEn ? siteConfig.name : siteConfig.nameFa,
    },
  };
}

export function getBreadcrumbSchema(
  locale: Locale,
  items: { name: string; path: string }[]
) {
  const isEn = locale === "en";
  const baseUrl = siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const itemUrl =
        item.path === "/"
          ? isEn
            ? baseUrl
            : `${baseUrl}/fa`
          : isEn
          ? `${baseUrl}${item.path}`
          : `${baseUrl}/fa${item.path}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: itemUrl,
      };
    }),
  };
}
