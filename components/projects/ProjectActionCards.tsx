"use client";

import { ProjectPlaceholderCard } from "./ProjectPlaceholderCard";

type ProjectActionCardsProps = {
  onAddProject: () => void;
  onJoinWithCode: () => void;
  variant?: "events" | "dashboard";
  className?: string;
};

export function ProjectActionCards({
  onAddProject,
  onJoinWithCode,
  variant = "dashboard",
  className = "",
}: ProjectActionCardsProps) {
  return (
    <>
      <div className={className}>
        <ProjectPlaceholderCard
          label="Add project"
          onClick={onAddProject}
          variant={variant}
        />
      </div>
      <div className={className}>
        <ProjectPlaceholderCard
          label="Join with code"
          onClick={onJoinWithCode}
          variant={variant}
        />
      </div>
    </>
  );
}
