"use client";

import { useState } from "react";
import { TriDatum, VW, VH, TRI_STYLE } from "./hexMosaic";

type Props = {
  name: string;
  projects: string[];
  skills: [string, string, string];
  rot: number;
  triangles: TriDatum[];
  discordUsername?: string;
};

const AVATAR_SIZE = 72;
const BANNER_H = 112;

export function BuilderCard({ name, projects, skills, rot, triangles, discordUsername }: Props) {
  const [copied, setCopied] = useState(false);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="relative flex min-w-0 flex-col border-2 border-accent-navbar bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      {/* Mosaic banner strip */}
      <div className="w-full overflow-hidden" style={{ height: BANNER_H }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          className="h-full w-full"
        >
          <style>{TRI_STYLE}</style>
          <rect width={VW} height={VH} fill="#00a6f3" />
          <g transform={`rotate(${rot} ${VW / 2} ${VH / 2})`}>
            {triangles.map(({ id, pts, shade }) => (
              <polygon key={id} className={`tri tri-${shade}`} points={pts} />
            ))}
          </g>
        </svg>
      </div>

      {/* Avatar — left-aligned, centered on banner bottom edge */}
      <div
        className="absolute left-4 flex items-center justify-center rounded-full border-[3px] border-white bg-[#0090d4]"
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          top: BANNER_H - AVATAR_SIZE / 2,
        }}
      >
        <span className="font-serif text-xl font-semibold text-white">{initials}</span>
      </div>

      {/* Content — left-aligned, padded to clear avatar */}
      <div
        className="flex flex-grow flex-col gap-4 px-4 pb-6"
        style={{ paddingTop: AVATAR_SIZE / 2 + 16 }}
      >
        <h3 className="wrap-break-word font-serif text-[1.2rem] leading-snug tracking-[-0.02em] text-neutral-900">
          {name}
        </h3>
        <div className="space-y-2">
          <p className="wrap-break-word font-mono text-[11px] uppercase tracking-wide text-neutral-700">
            {skills.join(" · ")}
          </p>
          <p className="wrap-break-word font-mono text-[10px] text-neutral-500">
            Building @ {projects.join(", ")}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          {discordUsername ? (
            <button
              onClick={() => {
                void navigator.clipboard.writeText(discordUsername);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-[#00a6f3] px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#0090d4]"
            >
              {copied ? "Copied!" : "Connect"}
            </button>
          ) : (
            <button className="bg-[#00a6f3] px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#0090d4] opacity-50 cursor-default">
              Connect
            </button>
          )}
          <button className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#00a6f3] transition-colors hover:text-[#0090d4] hover:underline">
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}
