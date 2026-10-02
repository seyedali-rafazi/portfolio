import type { Metadata } from "next";
import { AboutView } from "@/views/AboutView";
import { getAboutMetadata } from "@/lib/metadata";

export const metadata: Metadata = getAboutMetadata("en");

export default function AboutPage() {
  return <AboutView locale="en" />;
}
