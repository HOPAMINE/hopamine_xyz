"use client";

import { robotoMono } from "../../fonts";

type ProjectSectionHeaderActionsProps = {
  onAddProject: () => void;
  onJoinWithCode: () => void;
  variant?: "events" | "dashboard";
};

const pillBase = `${robotoMono.className} inline-flex shrink-0 touch-manipulation items-center rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-[11px]`;

export function ProjectSectionHeaderActions({
  onAddProject,
  onJoinWithCode,
  variant = "dashboard",
}: ProjectSectionHeaderActionsProps) {
  const primaryClass =
    variant === "dashboard"
      ? `${pillBase} border-accent-navbar/20 bg-accent-navbar text-white hover:bg-white hover:text-accent-navbar focus-visible:outline-accent-navbar`
      : `${pillBase} border-white/35 bg-white text-accent-events hover:bg-accent-events hover:text-white focus-visible:outline-white`;

  const secondaryClass =
    variant === "dashboard"
      ? `${pillBase} border-accent-navbar/20 bg-white text-accent-navbar hover:bg-accent-navbar hover:text-white focus-visible:outline-accent-navbar`
      : `${pillBase} border-white/35 bg-accent-navbar text-white hover:bg-white hover:text-accent-navbar focus-visible:outline-white`;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
      <button type="button" onClick={onJoinWithCode} className={secondaryClass}>
        Join with code
      </button>
      <button type="button" onClick={onAddProject} className={primaryClass}>
        Add project
      </button>
    </div>
  );
}
