"use client";

import Link from "next/link";
import { robotoMono } from "../../fonts";

function LinkButton({
  href,
  label,
}: {
  href?: string;
  label: string;
}) {
  const base = `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-events px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors`;
  const interactive = "hover:bg-white hover:text-accent-events";

  if (!href) {
    return (
      <span className={`${base} pointer-events-none opacity-35`}>{label}</span>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${interactive}`}
    >
      {label}
    </Link>
  );
}

export function ProjectLinkPills({
  demoUrl,
  liveUrl,
  repoUrl,
}: {
  demoUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
      <LinkButton href={demoUrl} label="Live Demo" />
      <LinkButton href={liveUrl} label="Live App" />
      <LinkButton href={repoUrl} label="Live Code" />
    </div>
  );
}
