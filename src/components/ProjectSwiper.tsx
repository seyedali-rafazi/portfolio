"use client";

import React from "react";
import { Project } from "@/types";
import { useI18n } from "@/i18n/client";
import { CustomSwiper } from "@/components/CustomSwiper";
import { ProjectCard } from "@/components/ProjectCard";
import { Sparkles } from "lucide-react";

export interface ProjectSwiperProps {
  projects: Project[];
}

export const ProjectSwiper: React.FC<ProjectSwiperProps> = ({ projects }) => {
  const { t } = useI18n();

  return (
    <CustomSwiper
      items={projects}
      keyExtractor={(item) => item.id}
      id="featured-projects-swiper"
      headerBadge={{
        icon: (
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)] animate-pulse" />
        ),
        label: `${projects.length} ${t("projects.filterAll")}`,
      }}
      accentColor="primary"
      autoplayDelay={4500}
      renderItem={(project) => (
        <ProjectCard project={project} variant="default" />
      )}
    />
  );
};

export default ProjectSwiper;
