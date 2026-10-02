import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutStatsSkillsSection } from "@/components/AboutStatsSkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPersonSchema, getWebSiteSchema } from "@/lib/schema";
import type { Locale } from "@/config/site";

interface HomeViewProps {
  locale: Locale;
}

export function HomeView({ locale }: HomeViewProps) {
  const structuredData = [getPersonSchema(locale), getWebSiteSchema(locale)];

  return (
    <>
      <JsonLd data={structuredData} />
      {/* Ambient background glows */}
      <div className="bg-glow one" aria-hidden="true" />
      <div className="bg-glow two" aria-hidden="true" />

      {/* Main navigation */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="flex-1" id="main-content">
        <HeroSection />
        <AboutStatsSkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
