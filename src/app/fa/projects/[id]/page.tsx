import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/portfolioData";
import { ProjectDetailView } from "@/views/ProjectDetailView";
import { getSingleProjectMetadata } from "@/lib/metadata";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) {
    return { title: "پروژه پیدا نشد" };
  }
  return getSingleProjectMetadata("fa", project);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} locale="fa" />;
}
