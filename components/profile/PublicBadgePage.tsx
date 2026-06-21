"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import Link from "next/link";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { getPublicProfileUrl, normalizeUsername } from "@/lib/profileUrls";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../fonts";
import { ClaimParticipationCard } from "../claim/ClaimParticipationCard";

type PublicBadgePageProps = {
  username: string;
};

export function PublicBadgePage({ username }: PublicBadgePageProps) {
  const normalizedUsername = normalizeUsername(username);
  const badge = useQuery(
    api.users.getPublicBadgeByUsername,
    normalizedUsername ? { username: normalizedUsername } : "skip",
  );
  const [siteOrigin, setSiteOrigin] = useState("");

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  const profileUrl = useMemo(() => {
    if (!siteOrigin || !normalizedUsername) return undefined;
    return getPublicProfileUrl(siteOrigin, normalizedUsername);
  }, [normalizedUsername, siteOrigin]);

  const loading = badge === undefined;
  const notFound = badge === null;

  return (
    <main
      className={`relative min-h-dvh w-full bg-accent-events pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Image
            src="/icon.svg"
            alt=""
            width={128}
            height={128}
            unoptimized
            aria-hidden
            className="h-9 w-auto shrink-0 object-contain"
          />
          <Image
            src="/Hopamine_text.svg"
            alt="Hopamine"
            width={93}
            height={24}
            unoptimized
            className="h-6 w-auto shrink-0 object-contain"
          />
        </Link>

        {loading ? (
          <p className={`${robotoMono.className} text-sm text-white/75`}>Loading badge…</p>
        ) : notFound ? (
          <div className="text-center">
            <h1
              className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] sm:text-4xl`}
            >
              Profile not found
            </h1>
            <p className={`${robotoFlex.className} mt-3 text-base text-white/80`}>
              No builder profile exists for @{normalizedUsername || "unknown"}.
            </p>
          </div>
        ) : badge.builderNumber === undefined ? (
          <div className="text-center">
            <h1
              className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] sm:text-4xl`}
            >
              {badge.name}
            </h1>
            <p className={`${robotoFlex.className} mt-3 text-base text-white/80`}>
              @{badge.username} hasn&apos;t claimed their Green Hackathon builder badge yet.
            </p>
          </div>
        ) : (
          <>
            <p
              className={`${robotoMono.className} mb-4 text-xs font-semibold uppercase tracking-wide text-white/70`}
            >
              Green Hackathon builder badge
            </p>
            <ClaimParticipationCard
              name={badge.name}
              builderNumber={badge.builderNumber}
              userSeed={badge.username}
              projectTitle={badge.projectTitle}
              projectBlurb={badge.projectBlurb}
              profileUrl={profileUrl}
              claimed
              hideClaimedBadge
            />
          </>
        )}
      </div>
    </main>
  );
}
