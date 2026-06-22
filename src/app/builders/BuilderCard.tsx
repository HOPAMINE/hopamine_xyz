"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { robotoMono, sortsMillGoudy } from "../../../fonts";
import { TriDatum, VW, VH, TRI_STYLE } from "./hexMosaic";

type Props = {
  name: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  rot: number;
  triangles: TriDatum[];
  discordUsername?: string;
  lastSeenAt?: number;
};

const AVATAR_SIZE = 72;
const BANNER_H = 112;

function TagPills({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p
        className={`${robotoMono.className} mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500`}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`${robotoMono.className} rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-800 ring-1 ring-neutral-200`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BuilderCard({
  name,
  username,
  avatarUrl,
  bio,
  skills,
  interests,
  rot,
  triangles,
  discordUsername,
  lastSeenAt,
}: Props) {
  const [copied, setCopied] = useState(false);

  const isActive = !!lastSeenAt && Date.now() - lastSeenAt < 2 * 60 * 1000;
  const profileHref = username
    ? `/profile/${encodeURIComponent(username.trim().toLowerCase())}`
    : undefined;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-[1.875rem] border-2 border-accent-navbar bg-[#00a6f3] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <div className="w-full shrink-0" style={{ height: BANNER_H }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          className="block h-full w-full"
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

      <div
        className="absolute left-4 overflow-hidden rounded-full border-[3px] border-white bg-[#0090d4]"
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          top: BANNER_H - AVATAR_SIZE / 2,
        }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-xl font-semibold text-white">
            {initials}
          </span>
        )}
      </div>

      <div
        className={`absolute h-3 w-3 rounded-full border-2 border-white ${isActive ? "bg-[#00a6f3]" : "bg-neutral-300"}`}
        style={{ left: 16 + AVATAR_SIZE - 10, top: BANNER_H - AVATAR_SIZE / 2 + AVATAR_SIZE - 10 }}
      />

      <div
        className="flex flex-grow flex-col gap-4 bg-white px-4 pb-6"
        style={{ paddingTop: AVATAR_SIZE / 2 + 16 }}
      >
        <h3
          className={`${sortsMillGoudy.className} wrap-break-word text-[1.5rem] leading-snug tracking-[-0.03em] text-neutral-900`}
        >
          {name}
        </h3>

        {bio ? (
          <p className={`${robotoMono.className} line-clamp-3 text-[11px] leading-relaxed text-neutral-600`}>
            {bio}
          </p>
        ) : null}

        <TagPills label="Skills" items={skills} />
        <TagPills label="Interests" items={interests} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {discordUsername ? (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(discordUsername);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`${robotoMono.className} rounded-full bg-[#00a6f3] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#0090d4]`}
            >
              {copied ? "Copied!" : "Connect"}
            </button>
          ) : (
            <span
              className={`${robotoMono.className} rounded-full bg-[#00a6f3]/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white`}
            >
              Connect
            </span>
          )}
          {profileHref ? (
            <Link
              href={profileHref}
              className={`${robotoMono.className} text-[11px] font-semibold uppercase tracking-widest text-[#00a6f3] transition-colors hover:text-[#0090d4] hover:underline`}
            >
              View Profile
            </Link>
          ) : (
            <span
              className={`${robotoMono.className} text-[11px] font-semibold uppercase tracking-widest text-neutral-400`}
            >
              View Profile
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
