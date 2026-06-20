"use client";

import Image from "next/image";
import { HACKATHON_FIELDS, type HackathonField, type HackathonProject } from "@/lib/hackathonDirectory";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { robotoMono, sortsMillGoudy } from "../../fonts";
import { hopathonCardClassName } from "../hopathon/hopathonStyles";

type ClaimProjectCardProps = {
  project: HackathonProject | null;
  claimed?: boolean;
  claimantName?: string;
};

export function ClaimProjectCard({ project, claimed = false, claimantName }: ClaimProjectCardProps) {
  if (!project) {
    return (
      <div
        className={`${hopathonCardClassName} flex min-h-[18rem] flex-col items-center justify-center border-dashed text-center`}
      >
        <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/55`}>
          Project preview
        </p>
        <p className={`${sortsMillGoudy.className} mt-3 max-w-[16rem] text-2xl text-white/80`}>
          Search and select your hackathon project
        </p>
      </div>
    );
  }

  const fieldLabel = HACKATHON_FIELDS[project.field as HackathonField];

  return (
    <article className={`${hopathonCardClassName} relative flex min-h-[18rem] flex-col overflow-hidden`}>
      {claimed ? (
        <span
          className={`${robotoMono.className} absolute right-4 top-4 rounded-full border border-white/35 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#13450E]`}
        >
          Claimed
        </span>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="relative flex min-w-0 items-center">
          <Image
            src="/greenhack_tl.svg"
            alt=""
            width={340}
            height={138}
            unoptimized
            aria-hidden
            className="h-[1.6rem] w-auto shrink-0 sm:h-[1.9rem]"
          />
        </div>
        <p className={`${robotoMono.className} text-right text-xs font-semibold uppercase tracking-wide text-white/85 sm:text-sm`}>
          {fieldLabel}
        </p>
      </div>

      <div className="mt-auto pt-6">
        <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/75 sm:text-sm`}>
          {claimed && claimantName ? claimantName : project.builder}
        </p>
        <h2
          className={`${sortsMillGoudy.className} mt-2 text-3xl normal-case leading-[1.02] tracking-[-0.05em] text-white sm:text-4xl`}
        >
          {formatProjectTitle(project.title)}
        </h2>
        <p className={`${robotoMono.className} mt-3 line-clamp-3 text-xs font-semibold uppercase leading-relaxed tracking-wide text-white/85 sm:text-sm`}>
          {project.blurb}
        </p>
      </div>
    </article>
  );
}
