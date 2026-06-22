"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { HACKATHON_FIELDS } from "@/lib/hackathonDirectory";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { robotoMono } from "../../fonts";
import { AddProjectCard } from "./AddProjectCard";
import { AddProjectForm } from "./AddProjectForm";
import { ProjectCard } from "./ProjectCard";
import { ProjectInvitesPanel } from "./ProjectInvitesPanel";
import { ProjectVideoModal } from "./ProjectVideoModal";

type ProjectsTabPanelProps = {
  builderName: string;
};

function formatMemberNames(
  members: { name: string; role: "owner" | "member" }[],
  fallbackName: string,
) {
  if (members.length === 0) return fallbackName;
  return members.map((member) => member.name).join(", ");
}

export function ProjectsTabPanel({ builderName }: ProjectsTabPanelProps) {
  const projects = useQuery(api.projects.listMine);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = projects?.find((project) => project._id === selectedProjectId) ?? null;

  if (projects === undefined) {
    return <p className={`${robotoMono.className} text-sm text-white/75`}>Loading projects…</p>;
  }

  if (isAdding) {
    return (
      <>
        <ProjectInvitesPanel />
        <AddProjectForm
          onCancel={() => setIsAdding(false)}
          onCreated={() => setIsAdding(false)}
        />
      </>
    );
  }

  return (
    <>
      <ProjectInvitesPanel />

      {projects.length === 0 ? (
        <div className="max-w-md">
          <AddProjectCard onClick={() => setIsAdding(true)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              fieldLabel={HACKATHON_FIELDS[project.field]}
              title={project.title}
              builder={formatMemberNames(project.members, builderName)}
              blurb={project.blurb}
              onOpen={() => setSelectedProjectId(project._id)}
              showLinkPills={false}
              variant="dashboard"
            />
          ))}
          <AddProjectCard onClick={() => setIsAdding(true)} />
        </div>
      )}

      <ProjectVideoModal
        project={
          selectedProject
            ? {
                field: selectedProject.field,
                title: selectedProject.title,
                builder: formatMemberNames(selectedProject.members, builderName),
                blurb: selectedProject.blurb,
              }
            : null
        }
        onClose={() => setSelectedProjectId(null)}
        formatTitle={formatProjectTitle}
      />
    </>
  );
}
