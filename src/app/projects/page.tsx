"use client";

import { useMemo, useState } from "react";
import { robotoFlex, robotoMono } from "../../../fonts";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import {
  HACKATHON_FIELDS,
  HACKATHON_PROJECTS,
  type HackathonField,
  type HackathonProject,
} from "@/lib/hackathonDirectory";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { ProjectCard } from "../../../components/projects/ProjectCard";
import { ProjectVideoModal } from "../../../components/projects/ProjectVideoModal";

type FieldFilter = HackathonField | "All";

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
