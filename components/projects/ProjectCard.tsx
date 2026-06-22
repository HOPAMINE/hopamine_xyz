"use client";

import Image from "next/image";
import { robotoMono, sortsMillGoudy } from "../../fonts";
import type { HackathonProject } from "@/lib/hackathonDirectory";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { ProjectLinkPills } from "./ProjectLinkPills";
import { projectCardDashboardShellClassName, projectCardShellClassName } from "./projectCardStyles";

type ProjectCardProps = Pick<
  HackathonProject,
  "title" | "builder" | "blurb" | "liveUrl" | "demoUrl" | "repoUrl"
> & {
  fieldLabel: string;
  onOpen: () => void;
  showLinkPills?: boolean;
  variant?: "events" | "dashboard";
};

export function ProjectCard({
  fieldLabel,
  title,
  builder,
  blurb,
  liveUrl,
  demoUrl,
  repoUrl,
  onOpen,
  showLinkPills = true,
  variant = "events",
}: ProjectCardProps) {
  const shellClassName = variant === "dashboard" ? projectCardDashboardShellClassName : projectCardShellClassName;
  const textColor = variant === "dashboard" ? "text-accent-navbar" : "text-white";
  const textMuted = variant === "dashboard" ? "text-accent-navbar/80" : "text-white/80";
  const hoverText = variant === "dashboard" ? "group-hover/card:text-white" : "group-hover/card:text-accent-events";
  const hoverTextMuted = variant === "dashboard" ? "group-hover/card:text-white/80" : "group-hover/card:text-accent-events/80";

  return (
    <div className="flex h-full flex-col gap-3">
      <button
        type="button"
        onClick={onOpen}
        className={shellClassName}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="relative flex min-w-0 items-center">
            <Image
              src="/greenhack_tl.svg"
              alt=""
              width={340}
              height={138}
              unoptimized
              aria-hidden
              className="h-[1.8rem] w-auto shrink-0 transition-opacity duration-200 group-hover/card:opacity-0 sm:h-[2.1rem]"
            />
            <Image
              src="/greenhack_white.svg"
              alt="The Green Hackathon"
              width={340}
              height={138}
              unoptimized
              className="absolute left-0 top-0 h-[1.8rem] w-auto shrink-0 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 sm:h-[2.1rem]"
            />
          </div>
          <p
            className={`${robotoMono.className} text-right text-xs font-semibold uppercase tracking-wide ${textColor} transition-colors duration-200 ${hoverText} sm:text-sm`}
          >
            {fieldLabel}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <p
            className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide ${textMuted} transition-colors duration-200 ${hoverTextMuted} sm:text-sm`}
          >
            {builder}
          </p>
          <h3
            className={`${sortsMillGoudy.className} mt-2 text-3xl normal-case leading-[1.02] tracking-[-0.05em] ${textColor} transition-colors duration-200 ${hoverText} sm:text-4xl sm:tracking-[-0.06em]`}
          >
            {formatProjectTitle(title)}
          </h3>
          <p
            className={`${robotoMono.className} mt-3 line-clamp-2 text-xs font-semibold uppercase leading-relaxed tracking-wide ${textColor} transition-colors duration-200 ${hoverText} sm:text-sm`}
          >
            {blurb}
          </p>
        </div>
      </button>
      {showLinkPills ? (
        <ProjectLinkPills demoUrl={demoUrl} liveUrl={liveUrl} repoUrl={repoUrl} />
      ) : null}
    </div>
  );
}
