"use client";

import { useState } from "react";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { PROJECT_TILES } from "@/lib/projectTiles";

function AddProjectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-[22px] w-[22px] shrink-0 sm:h-6 sm:w-6 ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

const CATEGORIES = ["Projects", "Learn", "News"] as const;

export default function ProjectsPage() {
  const [selected, setSelected] = useState<(typeof CATEGORIES)[number]>(
    "Projects",
  );

  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-28 pb-16 md:pt-32 md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <div className="flex w-full flex-wrap items-start justify-between gap-x-3 gap-y-3">
        <div className="flex min-w-0 max-w-[calc(100%-3.75rem)] flex-1 flex-wrap gap-2 sm:max-w-none sm:flex-none sm:gap-3">
          {CATEGORIES.map((label) => {
            const isSelected = selected === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(label)}
                className={`inline-flex min-h-11 shrink-0 touch-manipulation items-center rounded-none border border-transparent bg-white px-3 py-2.5 font-mono text-[10px] uppercase tracking-wide text-accent-navbar transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-navbar sm:px-4 sm:py-3 sm:text-[0.9375rem] ${isSelected ? "gap-2.5" : ""}`}
              >
                {isSelected ? (
                  <span
                    className="block h-2 w-2 shrink-0 rounded-full bg-accent-navbar"
                    aria-hidden
                  />
                ) : null}
                {label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Add project"
          className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-none border-2 border-accent-navbar bg-white text-accent-navbar transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-navbar sm:size-auto sm:min-h-11 sm:min-w-11 sm:px-4 sm:py-3"
        >
          <AddProjectIcon />
        </button>
      </div>

      <section
        aria-labelledby="projects-grid-heading"
        className="mt-6 w-full md:mt-8"
      >
        <h2 id="projects-grid-heading" className="sr-only">
          Project tiles
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-3 lg:gap-3 xl:gap-4 [&>article]:min-w-0">
          {PROJECT_TILES.map(({ caption, title, person }) => (
            <article key={title} className="flex min-w-0 flex-col">
              <div className="relative aspect-video min-h-0 w-full rounded-none border-2 border-accent-navbar bg-white md:aspect-3/2">
                <div className="absolute bottom-0 left-0 flex max-w-[92%] flex-col items-start gap-1.5 p-3 sm:max-w-[90%] sm:p-4 md:gap-1.5 md:p-3 lg:p-4">
                  <p className="line-clamp-3 font-mono text-xs leading-snug tracking-wide text-accent-navbar uppercase sm:text-[22px] md:text-[10px] lg:text-xs">
                    {caption}
                  </p>
                  <h3 className="wrap-break-word font-serif text-[2rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 normal-case line-clamp-3 md:line-clamp-2 md:text-[1rem] lg:text-[1.88rem] xl:text-[2.2rem]">
                    {title}
                  </h3>
                </div>
              </div>
              <div className="mt-3 space-y-1 md:mt-3 md:space-y-1">
                <p className="hidden wrap-break-word font-serif leading-snug tracking-[-0.02em] text-neutral-900 md:block md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem]">
                  {title}
                </p>
                <p className="wrap-break-word text-right font-mono text-sm tracking-wide text-neutral-700 normal-case md:text-left md:text-xs lg:text-sm">
                  {person}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
