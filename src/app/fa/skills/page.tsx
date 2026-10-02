import type { Metadata } from "next";
import { SkillsView } from "@/views/SkillsView";
import { getSkillsMetadata } from "@/lib/metadata";

export const metadata: Metadata = getSkillsMetadata("fa");

export default function FaSkillsPage() {
  return <SkillsView locale="fa" />;
}
