import type { Metadata } from "next";
import { ProjectsView } from "@/views/ProjectsView";
import { getProjectsMetadata } from "@/lib/metadata";

export const metadata: Metadata = getProjectsMetadata("fa");

export default function FaProjectsPage() {
  return <ProjectsView locale="fa" />;
}
