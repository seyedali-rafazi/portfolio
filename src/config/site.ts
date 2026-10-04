export const siteConfig = {
  name: "Seyekali Rafazi",
  nameFa: "سید علی رفضی",
  titleEn: "Seyekali Rafazi | Frontend Engineer",
  titleFa: "سید علی رفضی | مهندس فرانت‌اند",
  descriptionEn:
    "Seyekali Rafazi is a Frontend Engineer specializing in React, Next.js, TypeScript, and high-performance geospatial data visualization.",
  descriptionFa:
    "سید علی رفضی، توسعه‌دهنده و مهندس ارشد فرانت‌اند مسلط به React، Next.js، TypeScript و سامانه‌های تجسم داده‌های مکانی و سه‌بعدی.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://seyedalirafazi.com",
  defaultLocale: "en" as const,
  locales: ["en", "fa"] as const,
  author: "Seyekali Rafazi",
  email: "seyedalirafazi80@gmail.com",
  phone: "+98 912 345 6789",
  locationEn: "Tehran, Iran",
  locationFa: "تهران، ایران",
  links: {
    github: "https://github.com/seyedalirafazi",
    linkedin: "https://linkedin.com/in/seyedalirafazi",
    telegram: "https://t.me/seyedalirafazi",
    twitter: "https://x.com/seyedalirafazi",
  },
  socialHandles: {
    twitter: "@seyedalirafazi",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
