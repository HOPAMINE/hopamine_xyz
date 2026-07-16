"use client";

import Link from "next/link";
import { robotoMono } from "../../fonts";

function LinkButton({
  href,
  label,
  variant = "events",
}: {
  href?: string;
  label: string;
  variant?: "events" | "portal";
}) {
  const accent =
    variant === "portal"
      ? {
          base: `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-navbar px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors`,
          interactive: "hover:bg-white hover:text-accent-navbar",
        }
      : {
          base: `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-events px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors`,
          interactive: "hover:bg-white hover:text-accent-events",
        };

  if (!href) {
    return (
      <span className={`${accent.base} pointer-events-none opacity-35`}>{label}</span>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${accent.base} ${accent.interactive}`}
    >
      {label}
    </Link>
  );
}

export function ProjectLinkPills({
  demoUrl,
  liveUrl,
  repoUrl,
  variant = "events",
}: {
  demoUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  variant?: "events" | "portal";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton href={demoUrl} label="Demo" variant={variant} />
      <LinkButton href={liveUrl} label="Live" variant={variant} />
      <LinkButton href={repoUrl} label="Repo" variant={variant} />
    </div>
  );
}
