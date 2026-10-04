"use client";

import React from "react";
import { Project } from "@/types";
import { useI18n } from "@/i18n/client";
import { CustomSwiper } from "@/components/CustomSwiper";
import { BotProjectCard } from "@/components/ProjectCard";
import { BaleLogo } from "@/components/icons/BrandLogos";
import { Bot } from "lucide-react";

export { BaleLogo };

export interface BotProjectSwiperProps {
  projects: Project[];
}

export const BotProjectSwiper: React.FC<BotProjectSwiperProps> = ({
  projects,
}) => {
  const { t } = useI18n();

  return (
    <CustomSwiper
      items={projects}
      keyExtractor={(item) => item.id}
      id="bot-projects-swiper"
      headerBadge={{
        icon: <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />,
        label: `${projects.length} ${t("botProjects.label")}`,
      }}
      accentColor="emerald"
      autoplayDelay={6000}
      renderItem={(project) => <BotProjectCard project={project} />}
    />
  );
};

export default BotProjectSwiper;
