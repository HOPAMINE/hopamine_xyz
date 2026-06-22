"use client";

import { ProjectPlaceholderCard } from "./ProjectPlaceholderCard";

type AddProjectCardProps = {
  onClick?: () => void;
  variant?: "events" | "dashboard";
  className?: string;
};

export function AddProjectCard({ onClick, variant = "events", className = "" }: AddProjectCardProps) {
  return (
    <ProjectPlaceholderCard
      label="Add project"
      onClick={onClick}
      variant={variant}
      className={className}
    />
  );
}
