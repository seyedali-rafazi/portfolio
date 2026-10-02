import type { Metadata } from "next";
import { SkillsView } from "@/views/SkillsView";
import { getSkillsMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSkillsMetadata("en");

export default function SkillsPage() {
  return <SkillsView locale="en" />;
}
