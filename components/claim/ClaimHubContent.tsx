"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { roboto, robotoMono } from "../../fonts";
import { hopathonCardClassName } from "../hopathon/hopathonStyles";
import { ClaimNavbar } from "./ClaimNavbar";

const primaryButtonClass = `${robotoMono.className} inline-flex items-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#13450E] transition-opacity hover:opacity-90`;

type ClaimOptionProps = {
  title: string;
  description: string;
  href: string;
  status?: "done" | "pending";
  step: string;
};

function ClaimOption({ title, description, href, status, step }: ClaimOptionProps) {
  return (
    <Link
      href={href}
      className={`${hopathonCardClassName} group block min-h-[14rem] transition-colors hover:bg-white/10`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/60`}>
          {step}
        </p>
        {status === "done" ? (
          <span className={`${robotoMono.className} rounded-full border border-white/35 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#13450E]`}>
            Done
          </span>
        ) : null}
      </div>
      <h2 className={`${roboto.className} mt-4 text-2xl font-bold tracking-[-0.03em] text-white`}>
        {title}
      </h2>
      <p className={`${roboto.className} mt-3 text-sm leading-relaxed text-white/80`}>{description}</p>
      <p className={`${robotoMono.className} mt-6 text-xs font-semibold uppercase tracking-wide text-white/70 transition-colors group-hover:text-white`}>
        Continue →
      </p>
    </Link>
  );
}

export function ClaimHubContent() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const participation = useQuery(
    api.hackathonParticipations.getMine,
    clerkLoaded && user ? {} : "skip",
  );
  const projectClaim = useQuery(
    api.hackathonClaims.getMyProject,
    clerkLoaded && user ? {} : "skip",
  );

  if (!clerkLoaded) {
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
            Claim your hackathon badge
          </h1>
          <p className={`${roboto.className} mt-4 text-base text-white/80`}>
            Sign in to claim your builder participation and your project on Hopamine.
          </p>
          <Link href="/sign-in?redirect_url=/claim" className={`${primaryButtonClass} mt-8`}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const participationDone = participation !== undefined && participation !== null;
  const projectDone = projectClaim !== undefined && projectClaim !== null;
  const loading = participation === undefined || projectClaim === undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-[#13450E] text-white">
      <ClaimNavbar />
      <div className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-4">
        <h1 className={`${roboto.className} text-3xl font-bold tracking-[-0.03em] sm:text-4xl`}>
          Claim your hackathon badge
        </h1>
        <p className={`${roboto.className} mt-3 max-w-2xl text-base text-white/80`}>
          Two separate claims for Green Hackathon participants: your builder participation, then
          your project in the directory.
        </p>

        {loading ? (
          <p className={`${robotoMono.className} mt-8 text-sm text-white/75`}>Loading your claims…</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ClaimOption
              step="Claim 1"
              title="Builder participation"
              description="Verify you participated in the Hopamine Green Hackathon as a builder."
              href="/claim/participation"
              status={participationDone ? "done" : "pending"}
            />
            <ClaimOption
              step="Claim 2"
              title="Your project"
              description="Link yourself to your hackathon project in the directory. Teammates can claim the same project."
              href="/claim/project"
              status={projectDone ? "done" : "pending"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
