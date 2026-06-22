"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { robotoFlex, robotoMono } from "../../../fonts";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import {
  HACKATHON_FIELDS,
  type HackathonField,
  type HackathonProject,
} from "@/lib/hackathonDirectory";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { ProjectCard } from "../../../components/projects/ProjectCard";
import { projectsPageGridClassName } from "../../../components/projects/projectCardStyles";
import { ProjectVideoModal } from "../../../components/projects/ProjectVideoModal";
import { CommunityProjectsSection } from "../../../components/projects/CommunityProjectsSection";

type ProjectFilter = HackathonField | "All";

const categoryFilters = Object.keys(HACKATHON_FIELDS) as HackathonField[];

const ALL_CATEGORY_FILTERS: ProjectFilter[] = ["All", ...categoryFilters];
const CATEGORY_ROW_SPLIT = Math.ceil(ALL_CATEGORY_FILTERS.length / 2);

const PROJECT_FILTER_ROWS: ProjectFilter[][] = [
  ALL_CATEGORY_FILTERS.slice(0, CATEGORY_ROW_SPLIT),
  ALL_CATEGORY_FILTERS.slice(CATEGORY_ROW_SPLIT),
];

function getFilterLabel(filter: ProjectFilter): string {
  if (filter === "All") return "All fields";
  return HACKATHON_FIELDS[filter];
}

const categoryPillBase = `${robotoMono.className} inline-flex shrink-0 touch-manipulation items-center rounded-full border border-white/35 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:py-2.5 sm:text-sm`;

export default function ProjectsPage() {
  const directoryProjects = useQuery(api.projects.listHackathonDirectory);
  const [field, setField] = useState<ProjectFilter>("All");
  const [selectedProject, setSelectedProject] = useState<HackathonProject | null>(null);

  const filteredProjects = useMemo(() => {
    if (!directoryProjects) return [];
    return directoryProjects.filter((item) => {
      if (field === "All") return true;
      return item.field === field;
    });
  }, [directoryProjects, field]);

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

        <div className="mt-6 flex w-full flex-col gap-2 md:mt-8">
          {PROJECT_FILTER_ROWS.map((row) => (
            <div key={row.join("-")} className="flex flex-nowrap gap-2 overflow-x-auto pb-0.5">
              {row.map((filter) => {
                const isSelected = field === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setField(filter)}
                    className={
                      isSelected
                        ? `${categoryPillBase} bg-white text-accent-events`
                        : `${categoryPillBase} bg-accent-events text-white hover:bg-white hover:text-accent-events`
                    }
                  >
                    {getFilterLabel(filter)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p className={`${robotoMono.className} mt-4 text-xs text-white/75 sm:text-sm`}>
          {directoryProjects === undefined
            ? "Loading projects…"
            : `${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"}${
                field !== "All" ? ` · ${HACKATHON_FIELDS[field]}` : ""
              }`}
        </p>

        <section aria-labelledby="projects-grid-heading" className="mt-3 w-full">
          <h2 id="projects-grid-heading" className="sr-only">
            All projects
          </h2>
          {directoryProjects === undefined ? (
            <p className={`${robotoFlex.className} py-8 text-sm text-white/75`}>Loading projects…</p>
          ) : filteredProjects.length > 0 ? (
            <div className={projectsPageGridClassName}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={`${project.hackathonIndex}-${project.title}`}
                  fieldLabel={HACKATHON_FIELDS[project.field]}
                  title={project.title}
                  builder={project.builder}
                  blurb={project.blurb}
                  liveUrl={project.liveUrl}
                  demoUrl={project.demoUrl}
                  repoUrl={project.repoUrl}
                  showHackathonBranding={false}
                  onOpen={() =>
                    setSelectedProject({
                      field: project.field,
                      title: project.title,
                      builder: project.builder,
                      discord: project.discord,
                      blurb: project.blurb,
                      liveUrl: project.liveUrl,
                      demoUrl: project.demoUrl,
                      repoUrl: project.repoUrl,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <p className={`${robotoFlex.className} py-8 text-sm text-white/75`}>
              No projects in this field yet.
            </p>
          )}
        </section>

        <CommunityProjectsSection />
      </div>

      <ProjectVideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        formatTitle={formatProjectTitle}
      />
    </main>
  );
}
