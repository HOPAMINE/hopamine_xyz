"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { getHackathonProjectByIndex } from "@/lib/hackathonDirectory";
import { getPublicProfileUrl } from "@/lib/profileUrls";
import { roboto, robotoMono } from "../../fonts";
import { ClaimNavbar } from "./ClaimNavbar";
import { ClaimParticipationCard } from "./ClaimParticipationCard";
import { downloadParticipationCard } from "./downloadParticipationCard";
import { deriveReferenceId } from "./participationCardIds";

const inputClassName = `${robotoMono.className} w-full rounded-lg border border-white/25 bg-[#126609] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50`;

const primaryButtonClass = `${robotoMono.className} inline-flex items-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#13450E] transition-opacity hover:opacity-90 disabled:opacity-40`;

const secondaryLinkClass = `${robotoMono.className} inline-flex items-center text-xs font-semibold uppercase tracking-wide text-white/75 underline underline-offset-4 transition-colors hover:text-white`;

const isDev = process.env.NODE_ENV === "development";

type PreviewDraft = {
  name: string;
  builderNumber: string;
  projectTitle: string;
  projectBlurb: string;
  profileUrl: string;
  referenceId: string;
};

const emptyPreviewDraft: PreviewDraft = {
  name: "",
  builderNumber: "",
  projectTitle: "",
  projectBlurb: "",
  profileUrl: "",
  referenceId: "",
};

function parseBuilderNumber(value: string, fallback?: number) {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function ClaimParticipationContent() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const participation = useQuery(api.hackathonParticipations.getMine);
  const projectClaim = useQuery(api.hackathonClaims.getMyProject);
  const convexUser = useQuery(api.users.getCurrentUser, clerkLoaded && user ? {} : "skip");
  const claimParticipation = useMutation(api.hackathonParticipations.claim);
  const cardRef = useRef<HTMLElement>(null);

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [siteOrigin, setSiteOrigin] = useState("");
  const [previewDraft, setPreviewDraft] = useState<PreviewDraft>(emptyPreviewDraft);

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  const displayName = user?.fullName ?? user?.firstName ?? "Builder";
  const claimed = participation !== null && participation !== undefined;

  const projectPreview = useMemo(() => {
    if (projectClaim === undefined || projectClaim === null) {
      return null;
    }

    const directoryProject = getHackathonProjectByIndex(projectClaim.projectIndex);
    return {
      title: directoryProject?.title ?? projectClaim.projectTitle,
      blurb: directoryProject?.blurb ?? projectClaim.blurb,
      projectIndex: projectClaim.projectIndex,
    };
  }, [projectClaim]);

  const defaultProfileUrl = useMemo(() => {
    if (!siteOrigin || !convexUser?.username) return "";
    return getPublicProfileUrl(siteOrigin, convexUser.username);
  }, [convexUser?.username, siteOrigin]);

  const cardName = previewDraft.name.trim() || displayName;
  const cardUserSeed = convexUser?.username ?? user?.id ?? "";
  const cardBuilderNumber = parseBuilderNumber(
    previewDraft.builderNumber,
    claimed ? participation?.builderNumber : undefined,
  );
  const cardProjectTitle = previewDraft.projectTitle.trim() || projectPreview?.title;
  const cardProjectBlurb = previewDraft.projectBlurb.trim() || projectPreview?.blurb;
  const cardProfileUrl = previewDraft.profileUrl.trim() || defaultProfileUrl || undefined;
  const cardReferenceId = previewDraft.referenceId.trim() || undefined;

  function updatePreviewDraft<K extends keyof PreviewDraft>(key: K, value: PreviewDraft[K]) {
    setPreviewDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleClaim() {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await claimParticipation({});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to claim participation.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDownload() {
    if (!cardRef.current || downloading) return;

    setDownloading(true);
    setDownloadError("");

    try {
      const slug = cardName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await downloadParticipationCard(
        cardRef.current,
        `green-hackathon-builder-card${slug ? `-${slug}` : ""}.png`,
      );
    } catch (err: unknown) {
      setDownloadError(err instanceof Error ? err.message : "Failed to download card.");
    } finally {
      setDownloading(false);
    }
  }

  if (!clerkLoaded || participation === undefined || projectClaim === undefined) {
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
            Claim your participation
          </h1>
          <p className={`${roboto.className} mt-4 text-base text-white/80`}>
            Sign in to claim your spot as a Green Hackathon builder on Hopamine.
          </p>
          <Link
            href="/sign-in?redirect_url=/claim/participation"
            className={`${primaryButtonClass} mt-8`}
          >
            Sign in
          </Link>
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
            {claimed ? "Participation claimed" : "Claim your participation"}
          </h1>
          <p className={`${roboto.className} mt-3 max-w-2xl text-base text-white/80`}>
            {claimed
              ? "You’re verified as a Green Hackathon builder on Hopamine. Your builder card updates when you claim a project."
              : "Confirm you participated in the Green Hackathon as a builder. Your card preview updates live on the right."}
          </p>

          {isDev ? (
            <div className="mt-6 space-y-4 rounded-lg border border-white/20 bg-[#126609]/40 p-4">
              <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/75`}>
                Dev card fields
              </p>
              <p className={`${roboto.className} text-sm text-white/70`}>
                Override preview values below. Leave blank to use your account data.
              </p>

              <label className="block">
                <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
                  Name
                </span>
                <input
                  type="text"
                  value={previewDraft.name}
                  onChange={(e) => updatePreviewDraft("name", e.target.value)}
                  className={inputClassName}
                  placeholder={displayName}
                />
              </label>

              <label className="block">
                <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
                  Builder number
                </span>
                <input
                  type="number"
                  min={1}
                  value={previewDraft.builderNumber}
                  onChange={(e) => updatePreviewDraft("builderNumber", e.target.value)}
                  className={inputClassName}
                  placeholder={claimed ? participation.builderNumber.toString() : "6"}
                />
              </label>

              <label className="block">
                <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
                  Project title
                </span>
                <input
                  type="text"
                  value={previewDraft.projectTitle}
                  onChange={(e) => updatePreviewDraft("projectTitle", e.target.value)}
                  className={inputClassName}
                  placeholder={projectPreview?.title ?? "Rooted."}
                />
              </label>

              <label className="block">
                <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
                  Project description
                </span>
                <textarea
                  value={previewDraft.projectBlurb}
                  onChange={(e) => updatePreviewDraft("projectBlurb", e.target.value)}
                  className={`${inputClassName} min-h-[6rem] resize-y`}
                  placeholder={
                    projectPreview?.blurb ?? "Local knowledge into community action."
                  }
                />
              </label>

              <label className="block">
                <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
                  Profile QR link
                </span>
                <input
                  type="url"
                  value={previewDraft.profileUrl}
                  onChange={(e) => updatePreviewDraft("profileUrl", e.target.value)}
                  className={inputClassName}
                  placeholder={defaultProfileUrl || "https://hopamine.xyz/profile/your-username"}
                />
              </label>

              <label className="block">
                <span className={`${robotoMono.className} mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70`}>
                  Reference ID
                </span>
                <input
                  type="text"
                  value={previewDraft.referenceId}
                  onChange={(e) => updatePreviewDraft("referenceId", e.target.value)}
                  className={inputClassName}
                  placeholder={
                    cardUserSeed
                      ? deriveReferenceId(cardUserSeed)
                      : "REFERENCE ID: #12345678"
                  }
                />
              </label>
            </div>
          ) : claimed ? (
            <ul className={`${robotoMono.className} mt-6 space-y-2 text-xs font-semibold uppercase tracking-wide text-white/70`}>
              <li>Builder ID: {participation.builderNumber.toString().padStart(3, "0")}</li>
              <li>Project: {projectPreview ? projectPreview.title : "Not claimed yet"}</li>
            </ul>
          ) : (
            <ul className={`${robotoMono.className} mt-6 space-y-2 text-xs font-semibold uppercase tracking-wide text-white/70`}>
              <li>Your name appears on the card</li>
              <li>Builder number assigned after you claim</li>
              <li>QR code links to your public badge profile once you set a username</li>
            </ul>
          )}

          {error ? (
            <p className={`${robotoMono.className} mt-4 text-sm text-red-200`} role="alert">
              {error}
            </p>
          ) : null}

          {!claimed ? (
            <button
              type="button"
              disabled={saving}
              onClick={handleClaim}
              className={`${primaryButtonClass} mt-6`}
            >
              {saving ? "Claiming…" : "Claim participation"}
            </button>
          ) : projectPreview ? (
            <Link href="/dashboard" className={`${primaryButtonClass} mt-6`}>
              View dashboard
            </Link>
          ) : (
            <Link href="/claim/project" className={`${primaryButtonClass} mt-6`}>
              Claim your project →
            </Link>
          )}
        </section>

        <section className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <p className={`${robotoMono.className} mb-3 text-xs font-semibold uppercase tracking-wide text-white/70`}>
            Live preview
          </p>
          <div className="inline-flex max-w-full">
            <ClaimParticipationCard
              ref={cardRef}
              name={cardName}
              builderNumber={cardBuilderNumber}
              userSeed={cardUserSeed || undefined}
              projectTitle={cardProjectTitle}
              projectBlurb={cardProjectBlurb}
              profileUrl={cardProfileUrl}
              referenceId={cardReferenceId}
              claimed={claimed}
              hideClaimedBadge={isDev}
            />
          </div>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className={`${primaryButtonClass} mt-4 w-full justify-center`}
          >
            {downloading ? "Preparing download…" : "Download card image"}
          </button>

          {downloadError ? (
            <p className={`${robotoMono.className} mt-3 text-sm text-red-200`} role="alert">
              {downloadError}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
