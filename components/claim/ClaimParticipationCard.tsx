"use client";

import { forwardRef } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { robotoMono, sortsMillGoudy } from "../../fonts";
import {
  derivePreviewBuilderNumber,
  deriveReferenceId,
  formatBuilderLabel,
} from "./participationCardIds";
import {
  PARTICIPATION_CARD_FOOTER_MIN_HEIGHT,
  PARTICIPATION_CARD_GOLD,
  PARTICIPATION_CARD_GREEN,
  PARTICIPATION_CARD_HERO_HEIGHT,
  PARTICIPATION_CARD_HERO_IMAGE,
  PARTICIPATION_CARD_HERO_WIDTH,
  PARTICIPATION_CARD_QR_SIZE,
  PARTICIPATION_CARD_WIDTH,
  getParticipationCardNameFontSize,
} from "./participationCardStyles";

export type ClaimParticipationCardProps = {
  name: string;
  builderNumber?: number;
  userSeed?: string;
  projectTitle?: string;
  projectBlurb?: string;
  profileUrl?: string;
  referenceId?: string;
  claimed?: boolean;
  hideClaimedBadge?: boolean;
};

export const ClaimParticipationCard = forwardRef<HTMLElement, ClaimParticipationCardProps>(
  function ClaimParticipationCard(
    {
      name,
      builderNumber,
      userSeed,
      projectTitle,
      projectBlurb,
      profileUrl,
      referenceId,
      claimed = false,
      hideClaimedBadge = false,
    },
    ref,
  ) {
    const displayName = name.split(" ")[0] ?? name;
    const nameFontSize = getParticipationCardNameFontSize(displayName);
    const displayProjectTitle = projectTitle
      ? formatProjectTitle(projectTitle)
      : "Your project";
    const displayProjectDescription =
      projectBlurb ?? "Claim your hackathon project to show it here.";
    const resolvedBuilderNumber =
      builderNumber ?? (userSeed ? derivePreviewBuilderNumber(userSeed) : undefined);
    const displayBuilderLabel =
      resolvedBuilderNumber !== undefined
        ? formatBuilderLabel(resolvedBuilderNumber)
        : "BUILDER #---";
    const displayReferenceId =
      referenceId?.trim() || (userSeed ? deriveReferenceId(userSeed) : "REFERENCE ID: #--------");

    return (
      <article
        ref={ref}
        className="relative mx-auto flex w-full max-w-full flex-col overflow-hidden rounded-[1.875rem] border border-white/25 bg-accent-events"
        style={{ maxWidth: PARTICIPATION_CARD_WIDTH }}
      >
        {claimed && !hideClaimedBadge ? (
          <span
            className={`${robotoMono.className} absolute right-3 top-3 z-30 rounded-full border border-white/35 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#13450E]`}
          >
            Claimed
          </span>
        ) : null}

        <Image
          src={PARTICIPATION_CARD_HERO_IMAGE}
          alt=""
          width={PARTICIPATION_CARD_HERO_WIDTH}
          height={PARTICIPATION_CARD_HERO_HEIGHT}
          unoptimized
          priority
          aria-hidden
          className="block h-auto w-full shrink-0"
        />

        <div
          className="flex shrink-0 items-stretch justify-between gap-3 mt-4 border-t border-white/25 bg-accent-events px-7 pb-6 pt-5"
          style={{ minHeight: PARTICIPATION_CARD_FOOTER_MIN_HEIGHT }}
        >
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
            <div>
              <h2
                className={`${sortsMillGoudy.className} normal-case mt-2 leading-[0.9] tracking-[-0.05em] text-white`}
                style={{ fontSize: nameFontSize }}
              >
                {displayName}
              </h2>
              <p
                className={`${robotoMono.className} mt-1.5 whitespace-nowrap text-[14px] font-semibold uppercase tracking-wide`}
                style={{ color: PARTICIPATION_CARD_GOLD }}
              >
                {displayBuilderLabel}
              </p>
            </div>

            {profileUrl ? (
              <div className="rounded-md bg-accent-events p-1">
                <QRCode
                  value={profileUrl}
                  size={PARTICIPATION_CARD_QR_SIZE}
                  bgColor={PARTICIPATION_CARD_GREEN}
                  fgColor="#ffffff"
                  style={{ width: PARTICIPATION_CARD_QR_SIZE, height: "auto" }}
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded-md border border-dashed border-white/25 bg-accent-events/80"
                style={{
                  width: PARTICIPATION_CARD_QR_SIZE,
                  height: PARTICIPATION_CARD_QR_SIZE,
                }}
              >
                <span
                  className={`${robotoMono.className} px-1 text-center text-[14px] mt-4 mb-10 font-semibold uppercase leading-tight tracking-wide text-white/45`}
                >
                  QR
                </span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end justify-between gap-3 text-right">
            <div className="flex flex-col items-end gap-2">
              <h3
                className={`${sortsMillGoudy.className} min-w-[10.25rem] max-w-[10.75rem] text-[1.35rem] normal-case leading-[1.05] tracking-[-0.04em] text-white`}
              >
                {displayProjectTitle}
              </h3>
              <p
                className={`${robotoMono.className} min-w-[10.25rem] max-w-[10.75rem] line-clamp-5 text-[10px] font-semibold uppercase leading-snug tracking-wide text-white`}
              >
                {displayProjectDescription}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p
                className={`${robotoMono.className} text-[11px] font-semibold uppercase tracking-wide text-white/70`}
              >
                {displayReferenceId}
              </p>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/icon.svg"
                  alt=""
                  width={128}
                  height={128}
                  unoptimized
                  aria-hidden
                  className="h-7 w-auto shrink-0 object-contain"
                />
                <Image
                  src="/Hopamine_text.svg"
                  alt="Hopamine"
                  width={93}
                  height={24}
                  unoptimized
                  className="h-5 w-auto shrink-0 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  },
);

ClaimParticipationCard.displayName = "ClaimParticipationCard";
