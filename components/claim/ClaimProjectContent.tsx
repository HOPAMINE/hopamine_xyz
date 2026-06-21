"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import {
  HACKATHON_PROJECTS,
  getHackathonProjectByIndex,
  type HackathonProject,
} from "@/lib/hackathonDirectory";
import { roboto, robotoMono } from "../../fonts";
import { ClaimNavbar } from "./ClaimNavbar";
import { ClaimProjectCard } from "./ClaimProjectCard";

const inputClassName = `${robotoMono.className} w-full rounded-lg border border-white/25 bg-[#13450E] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50`;

const primaryButtonClass = `${robotoMono.className} inline-flex items-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#13450E] transition-opacity hover:opacity-90 disabled:opacity-40`;

const secondaryLinkClass = `${robotoMono.className} inline-flex items-center text-xs font-semibold uppercase tracking-wide text-white/75 underline underline-offset-4 transition-colors hover:text-white`;

function projectMatchesQuery(project: HackathonProject, query: string) {
  const haystack = `${project.title} ${project.builder} ${project.blurb}`.toLowerCase();
  return haystack.includes(query);
}

export function ClaimProjectContent() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const myClaim = useQuery(api.hackathonClaims.getMyProject);
  const claimProject = useMutation(api.hackathonClaims.claimProject);

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return HACKATHON_PROJECTS.map((project, index) => ({ project, index })).filter(
      ({ project }) => {
        if (!query) return true;
        return projectMatchesQuery(project, query);
      },
    );
  }, [search]);

  const selectedProject =
    selectedIndex === null ? null : getHackathonProjectByIndex(selectedIndex);

  const claimedProject =
    myClaim === undefined || myClaim === null
      ? null
      : getHackathonProjectByIndex(myClaim.projectIndex) ?? {
          field: myClaim.field,
          title: myClaim.projectTitle,
          builder: myClaim.builderName,
          blurb: myClaim.blurb,
        };

  async function handleClaim() {
    if (selectedIndex === null || !selectedProject || saving) return;

    setSaving(true);
    setError("");

    try {
      await claimProject({
        projectIndex: selectedIndex,
        projectTitle: selectedProject.title,
        builderName: selectedProject.builder,
        field: selectedProject.field,
        blurb: selectedProject.blurb,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to claim project.");
    } finally {
      setSaving(false);
    }
  }

  if (!clerkLoaded || myClaim === undefined) {
    return (
      <div className="flex min-h-dvh flex-col bg-[#13450E] text-white">
        <ClaimNavbar />
        <p className={`${robotoMono.className} px-5 text-sm text-white/75`}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col bg-[#13450E] text-white">
        <ClaimNavbar />
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <h1 className={`${roboto.className} text-3xl font-bold tracking-[-0.03em] sm:text-4xl`}>
            Claim your project
          </h1>
          <p className={`${roboto.className} mt-4 text-base text-white/80`}>
            Sign in to link your Green Hackathon project on Hopamine.
          </p>
          <Link href="/sign-in?redirect_url=/claim/project" className={`${primaryButtonClass} mt-8`}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (myClaim && claimedProject) {
    return (
      <div className="flex min-h-dvh flex-col bg-[#13450E] text-white">
        <ClaimNavbar />
        <div className="mx-auto w-full max-w-3xl flex-1 px-5 pb-16 pt-4">
          <Link href="/claim" className={secondaryLinkClass}>
            ← All claims
          </Link>
          <h1 className={`${roboto.className} mt-4 text-center text-3xl font-bold tracking-[-0.03em] sm:text-4xl`}>
            Project claimed
          </h1>
          <p className={`${roboto.className} mt-3 text-center text-base text-white/80`}>
            This is your hackathon project card on Hopamine.
          </p>
          <div className="mt-8">
            <ClaimProjectCard
              project={claimedProject}
              claimed
              claimantName={user.fullName ?? user.firstName ?? myClaim.builderName}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#13450E] text-white">
      <ClaimNavbar />

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-5 pb-16 pt-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="min-w-0">
          <Link href="/claim" className={secondaryLinkClass}>
            ← All claims
          </Link>
          <h1 className={`${roboto.className} mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl`}>
            Claim your project
          </h1>
          <p className={`${roboto.className} mt-3 max-w-2xl text-base text-white/80`}>
            Find your hackathon project in the directory and claim your spot on the team. Multiple
            builders can claim the same project.
          </p>

          <label className="mt-6 block">
            <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
              Search projects
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputClassName}
              placeholder="Project name or builder"
            />
          </label>

          <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(({ project, index }) => {
                const isSelected = selectedIndex === index;
                return (
                  <li key={`${project.title}-${project.builder}`}>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={`${robotoMono.className} w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        isSelected
                          ? "border-white bg-white text-[#13450E]"
                          : "border-white/20 bg-white/5 text-white hover:border-white/40"
                      }`}
                    >
                      <span className="block font-semibold uppercase tracking-wide">
                        {project.title}
                      </span>
                      <span className={`mt-1 block text-xs ${isSelected ? "text-[#13450E]/75" : "text-white/65"}`}>
                        {project.builder}
                      </span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className={`${robotoMono.className} rounded-lg border border-white/15 px-4 py-6 text-center text-sm text-white/60`}>
                No projects match your search.
              </li>
            )}
          </ul>
        </section>

        <section className="min-w-0">
          <p className={`${robotoMono.className} mb-3 text-xs font-semibold uppercase tracking-wide text-white/70`}>
            Live preview
          </p>
          <ClaimProjectCard project={selectedProject} />
          {error ? (
            <p className={`${robotoMono.className} mt-4 text-sm text-red-200`} role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={selectedIndex === null || saving}
            onClick={handleClaim}
            className={`${primaryButtonClass} mt-6 w-full justify-center`}
          >
            {saving ? "Claiming…" : "Claim this project"}
          </button>
        </section>
      </div>
    </div>
  );
}
