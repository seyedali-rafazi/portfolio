export const siteConfig = {
  name: "Seyedali Rafazi",
  nameFa: "سید علی رفضی",
  titleEn: "Seyedali Rafazi | Frontend Engineer",
  titleFa: "سید علی رفضی | مهندس فرانت‌اند",
  descriptionEn:
    "Seyedali Rafazi is a Frontend Engineer specializing in React, Next.js, TypeScript, and high-performance geospatial data visualization.",
  descriptionFa:
    "سید علی رفضی، توسعه‌دهنده و مهندس ارشد فرانت‌اند مسلط به React، Next.js، TypeScript و سامانه‌های تجسم داده‌های مکانی و سه‌بعدی.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://seyedalirafazi.com",
  defaultLocale: "en" as const,
  locales: ["en", "fa"] as const,
  author: "Seyedali Rafazi",
  email: "seyedalirafazi80@gmail.com",
  phone: "+98 937 989 8954",
  locationEn: "Tehran, Iran",
  locationFa: "تهران، ایران",
  links: {
    github: "https://github.com/seyedali-rafazi",
    linkedin: "https://www.linkedin.com/in/seyedali-rafazi",
    telegram: "https://t.me/ali_rfzt",
  },
  socialHandles: {
    telegram: "@ali_rfzt",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
