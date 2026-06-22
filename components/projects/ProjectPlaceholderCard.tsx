"use client";

import { robotoMono } from "../../fonts";
import { projectCardAddReferenceClassName } from "./projectCardStyles";

type ProjectPlaceholderCardProps = {
  label: string;
  onClick?: () => void;
  variant?: "events" | "dashboard";
  className?: string;
};

export function ProjectPlaceholderCard({
  label,
  onClick,
  variant = "events",
  className = "",
}: ProjectPlaceholderCardProps) {
  const dashboardClass =
    "border-dashed border-accent-events/40 text-accent-events/75 hover:border-accent-events hover:text-accent-events";
  const eventsClass =
    "border-dashed border-white/40 text-white/75 hover:border-white hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${robotoMono.className} ${projectCardAddReferenceClassName} ${
        variant === "dashboard" ? dashboardClass : eventsClass
      } ${className}`}
    >
      {label}
    </button>
  );
}
