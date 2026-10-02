import type { Metadata } from "next";
import { ProjectsView } from "@/views/ProjectsView";
import { getProjectsMetadata } from "@/lib/metadata";

export const metadata: Metadata = getProjectsMetadata("en");

export default function ProjectsPage() {
  return <ProjectsView locale="en" />;
}
