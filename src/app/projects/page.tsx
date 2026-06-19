"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { robotoFlex, robotoMono, sortsMillGoudy } from "../../../fonts";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import {
  HACKATHON_FIELDS,
  HACKATHON_PROJECTS,
  type HackathonField,
  type HackathonProject,
} from "@/lib/hackathonDirectory";
import { ProjectVideoModal } from "../../../components/projects/ProjectVideoModal";

type FieldFilter = HackathonField | "All";

function formatProjectTitle(title: string): string {
  return title.replace(/\b[A-Z]{2,}[A-Z0-9]*\b/g, (word) => {
    if (word.length <= 1) return word;
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
}

function ProjectLinkPills({
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

function ProjectCard({
  fieldLabel,
  title,
  builder,
  blurb,
  liveUrl,
  demoUrl,
  repoUrl,
  onOpen,
}: Pick<
  HackathonProject,
  "title" | "builder" | "blurb" | "liveUrl" | "demoUrl" | "repoUrl"
> & { fieldLabel: string; onOpen: () => void }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <button
        type="button"
        onClick={onOpen}
        className="group/card flex min-h-[15.18rem] flex-1 cursor-pointer flex-col rounded-[1.875rem] border border-white/20 bg-accent-events p-5 text-left text-white shadow-sm transition-colors duration-200 hover:bg-white sm:p-6"
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
            className={`${robotoMono.className} text-right text-xs font-semibold uppercase tracking-wide text-white transition-colors duration-200 group-hover/card:text-accent-events sm:text-sm`}
          >
            {fieldLabel}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <p
            className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/80 transition-colors duration-200 group-hover/card:text-accent-events/80 sm:text-sm`}
          >
            {builder}
          </p>
          <h3
            className={`${sortsMillGoudy.className} mt-2 text-3xl normal-case leading-[1.02] tracking-[-0.05em] text-white transition-colors duration-200 group-hover/card:text-accent-events sm:text-4xl sm:tracking-[-0.06em]`}
          >
            {formatProjectTitle(title)}
          </h3>
          <p
            className={`${robotoMono.className} mt-3 line-clamp-2 text-xs font-semibold uppercase leading-relaxed tracking-wide text-white transition-colors duration-200 group-hover/card:text-accent-events sm:text-sm`}
          >
            {blurb}
          </p>
        </div>
      </button>
      <ProjectLinkPills demoUrl={demoUrl} liveUrl={liveUrl} repoUrl={repoUrl} />
    </div>
  );
}

export default function ProjectsPage() {
  const [field, setField] = useState<FieldFilter>("All");
  const [selectedProject, setSelectedProject] = useState<HackathonProject | null>(null);

  const filteredProjects = useMemo(() => {
    return HACKATHON_PROJECTS.filter((item) => {
      if (field !== "All" && item.field !== field) return false;
      return true;
    });
  }, [field]);

  const fieldFilters: FieldFilter[] = ["All", ...(Object.keys(HACKATHON_FIELDS) as HackathonField[])];

  return (
    <main
      className={`relative min-h-dvh w-full bg-accent-events pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="max-w-3xl">
          <h1
            className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl`}
          >
            Projects
          </h1>
          <p className={`${robotoFlex.className} mt-3 text-base text-white/90 sm:text-lg`}>
            Every idea pitched and every project shipped — browse for inspiration, find your people,
            and jump into something in progress.
          </p>
        </header>

        <div className="mt-6 flex w-full flex-nowrap justify-start gap-1.5 overflow-x-auto pb-1 md:mt-8 lg:overflow-visible">
          {fieldFilters.map((filter) => {
            const isSelected = field === filter;
            const label = filter === "All" ? "All fields" : HACKATHON_FIELDS[filter];
            const pillBase = `${robotoMono.className} inline-flex shrink-0 touch-manipulation items-center rounded-full border border-white/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3.5 sm:py-2 sm:text-[11px]`;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setField(filter)}
                className={
                  isSelected
                    ? `${pillBase} bg-white text-accent-events`
                    : `${pillBase} bg-accent-events text-white hover:bg-white hover:text-accent-events`
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className={`${robotoMono.className} mt-4 text-xs text-white/75`}>
          {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}
          {field !== "All" ? ` · ${HACKATHON_FIELDS[field]}` : ""}
        </p>

        <section aria-labelledby="projects-grid-heading" className="mt-3 w-full">
          <h2 id="projects-grid-heading" className="sr-only">
            All projects
          </h2>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={`${project.title}-${project.builder}`}
                  fieldLabel={HACKATHON_FIELDS[project.field]}
                  title={project.title}
                  builder={project.builder}
                  blurb={project.blurb}
                  liveUrl={project.liveUrl}
                  demoUrl={project.demoUrl}
                  repoUrl={project.repoUrl}
                  onOpen={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <p className={`${robotoFlex.className} py-8 text-sm text-white/75`}>
              No projects in this field yet.
            </p>
          )}
        </section>
      </div>

      <ProjectVideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        formatTitle={formatProjectTitle}
      />
    </main>
  );
}
