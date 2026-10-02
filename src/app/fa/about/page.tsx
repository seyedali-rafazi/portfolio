import type { Metadata } from "next";
import { AboutView } from "@/views/AboutView";
import { getAboutMetadata } from "@/lib/metadata";

export const metadata: Metadata = getAboutMetadata("fa");

export default function FaAboutPage() {
  return <AboutView locale="fa" />;
}
