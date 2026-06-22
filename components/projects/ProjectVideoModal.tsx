"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { robotoFlex, robotoMono, sortsMillGoudy } from "../../fonts";
import { HACKATHON_FIELDS, type HackathonProject } from "@/lib/hackathonDirectory";
import { getDemoEmbed } from "@/lib/demoEmbed";

type ProjectVideoModalProps = {
  project: HackathonProject | null;
  onClose: () => void;
  formatTitle: (title: string) => string;
};

export function ProjectVideoModal({ project, onClose, formatTitle }: ProjectVideoModalProps) {
  const open = project !== null;
  const embed = project?.demoUrl ? getDemoEmbed(project.demoUrl) : null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className={`${robotoFlex.className} fixed left-1/2 top-1/2 z-[111] flex w-[min(94vw,56rem)] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.875rem] border border-white/25 bg-accent-events text-white shadow-xl outline-none`}
        >
          {project ? (
            <>
              <div className="px-5 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-5">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className={`${robotoMono.className} inline-flex items-center gap-1.5 rounded-full border border-white/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events sm:px-4 sm:py-2`}
                  >
                    <span aria-hidden="true">←</span>
                    Back
                  </button>
                </Dialog.Close>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
                {embed?.type === "video" ? (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-black">
                    <iframe
                      key={embed.embedUrl}
                      src={embed.embedUrl}
                      title={`${project.title} demo`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : embed?.type === "external" ? (
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center">
                    <p className="text-sm text-white/85 sm:text-base">
                      This demo opens on an external site rather than as an embedded video.
                    </p>
                    <Link
                      href={embed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${robotoMono.className} mt-4 inline-flex rounded-full border border-white/35 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-accent-events transition-colors hover:bg-white/90`}
                    >
                      Open demo
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center">
                    <p className="text-sm text-white/85 sm:text-base">
                      No demo video is available for this project yet.
                    </p>
                    {project.liveUrl ? (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${robotoMono.className} mt-4 inline-flex rounded-full border border-white/35 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-accent-events transition-colors hover:bg-white/90`}
                      >
                        Open live app
                      </Link>
                    ) : null}
                  </div>
                )}

                <Dialog.Title
                  className={`${sortsMillGoudy.className} mt-5 text-3xl normal-case leading-[1.02] tracking-[-0.05em] sm:mt-6 sm:text-4xl md:text-5xl`}
                >
                  {formatTitle(project.title)}
                </Dialog.Title>
                <p className={`${robotoMono.className} mt-4 text-xs font-semibold uppercase leading-relaxed tracking-wide text-white/85 sm:text-sm`}>
                  {project.blurb}
                </p>

                <div className="mt-auto pt-6 text-left">
                  <p
                    className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/80 sm:text-sm`}
                  >
                    {project.builder}
                  </p>
                  <p
                    className={`${robotoMono.className} mt-1 text-xs font-semibold uppercase tracking-wide text-white/80 sm:text-sm`}
                  >
                    {HACKATHON_FIELDS[project.field]}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
