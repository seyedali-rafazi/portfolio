export type Language = "fa" | "en";
export type Locale = "en" | "fa";

export type Theme = "dark" | "light";

export interface ProjectTechStackItem {
  category: {
    fa: string;
    en: string;
  };
  items: string[];
}

export interface ProjectChallenge {
  title: {
    fa: string;
    en: string;
  };
  solution: {
    fa: string;
    en: string;
  };
}

export interface Project {
  id: string;
  title: string;
  titleFa?: string;
  category: "geospatial" | "fullstack" | "frontend" | "bot" | "package";
  tags: string[];
  image: string;
  summary: {
    fa: string;
    en: string;
  };
  description: {
    fa: string;
    en: string;
  };
  features: {
    fa: string[];
    en: string[];
  };
  metrics?: {
    fa: string;
    en: string;
  };
  techStackDetailed?: ProjectTechStackItem[];
  challenges?: ProjectChallenge[];
  architecture?: {
    fa: string;
    en: string;
  };
  githubUrl?: string;
  liveUrl?: string;
  npmUrl?: string;
  packageName?: string;
  installCommand?: string;
  botId?: string;
  botUrl?: string;
  botPlatform?: "bale" | "telegram";
}

export interface Skill {
  id: string;
  name: string;
  category: "core" | "state-tools" | "geospatial";
  iconName: string;
  color: string;
  level: number; // 0 to 100
  experience: {
    fa: string;
    en: string;
  };
}

export interface StatItem {
  id: string;
  number: string;
  symbol: string;
  title: {
    fa: string;
    en: string;
  };
  subtitle: {
    fa: string;
    en: string;
  };
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: {
    fa: string;
    en: string;
  };
}
