"use client";

import React from "react";
import { Project } from "@/types";
import { useI18n } from "@/i18n/client";
import { CustomSwiper } from "@/components/CustomSwiper";
import { PackageProjectCard } from "@/components/ProjectCard";
import { NpmLogo } from "@/components/icons/BrandLogos";
import { Package } from "lucide-react";

export { NpmLogo };

export interface PackageProjectSwiperProps {
  projects: Project[];
}

export const PackageProjectSwiper: React.FC<PackageProjectSwiperProps> = ({
  projects,
}) => {
  const { t } = useI18n();

  return (
    <CustomSwiper
      items={projects}
      keyExtractor={(item) => item.id}
      id="package-projects-swiper"
      headerBadge={{
        icon: <Package className="w-4 h-4 text-indigo-400 animate-pulse" />,
        label: `${projects.length} ${t("packageProjects.label")}`,
      }}
      accentColor="indigo"
      autoplayDelay={6000}
      renderItem={(project) => <PackageProjectCard project={project} />}
    />
  );
};

export default PackageProjectSwiper;
