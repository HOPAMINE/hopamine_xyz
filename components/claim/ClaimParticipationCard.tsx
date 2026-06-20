"use client";

import { forwardRef } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { robotoMono, sortsMillGoudy } from "../../fonts";
import { PARTICIPATION_CARD_ASPECT, PARTICIPATION_CARD_GREEN_DARK } from "./participationCardStyles";

const PARTICIPATION_CARD_IMAGE = "/Group%20181.svg";

export type ClaimParticipationCardProps = {
  name: string;
  builderNumber?: number;
  projectTitle?: string;
  projectBlurb?: string;
  projectUrl?: string;
  referenceId?: string;
  claimed?: boolean;
  hideClaimedBadge?: boolean;
};

function formatBuilderNumber(builderNumber?: number) {
  if (builderNumber === undefined) return "Builder #---";
  return `Builder #${builderNumber.toString().padStart(3, "0")}`;
}

function formatReferenceId(builderNumber?: number, referenceId?: string) {
  if (referenceId?.trim()) return referenceId.trim();
  if (builderNumber === undefined) return "REFERENCE ID: #----";
  return `REFERENCE ID: #${2030 + builderNumber}`;
}

export const ClaimParticipationCard = forwardRef<HTMLElement, ClaimParticipationCardProps>(
  function ClaimParticipationCard(
    {
      name,
      builderNumber,
      projectTitle,
      projectBlurb,
      projectUrl,
      referenceId,
      claimed = false,
      hideClaimedBadge = false,
    },
    ref,
  ) {
    const displayProjectTitle = projectTitle ? formatProjectTitle(projectTitle) : "Your project";
    const displayBlurb = projectBlurb ?? "Claim your hackathon project to show it here.";
    const displayName = name.split(" ")[0] ?? name;
    const displayReferenceId = formatReferenceId(builderNumber, referenceId);

    return (
      <article
        ref={ref}
        className="relative mx-auto w-full max-w-[17.5rem] overflow-hidden rounded-lg border border-white/25 sm:max-w-[19rem]"
      >
        {claimed && !hideClaimedBadge ? (
          <span
            className={`${robotoMono.className} absolute right-3 top-3 z-30 rounded-full border border-white/35 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#13450E]`}
          >
            Claimed
          </span>
        ) : null}

        <div className="relative w-full" style={{ aspectRatio: PARTICIPATION_CARD_ASPECT }}>
          <Image
            src={PARTICIPATION_CARD_IMAGE}
            alt=""
            fill
            unoptimized
            priority
            aria-hidden
            sizes="(max-width: 640px) 17.5rem, 19rem"
            className="object-contain object-center"
          />

          <div className="absolute inset-0 z-10">
            <div className="absolute left-[7.5%] top-[71%] w-[38%]">
              <h2
                className={`${sortsMillGoudy.className} text-[1.35rem] normal-case leading-[0.95] tracking-[-0.05em] text-white sm:text-[1.5rem]`}
              >
                {displayName}
              </h2>
              <p
                className={`${robotoMono.className} mt-1 text-[8px] font-semibold uppercase tracking-wide text-white/75 sm:text-[9px]`}
              >
                {formatBuilderNumber(builderNumber)}
              </p>
            </div>

            <div className="absolute bottom-[3.5%] left-[7.5%]">
              {projectUrl ? (
                <div
                  className="rounded-md p-1"
                  style={{ backgroundColor: PARTICIPATION_CARD_GREEN_DARK }}
                >
                  <QRCode
                    value={projectUrl}
                    size={52}
                    bgColor={PARTICIPATION_CARD_GREEN_DARK}
                    fgColor="#ffffff"
                    className="h-auto w-[3.25rem]"
                  />
                </div>
              ) : (
                <div
                  className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-md border border-dashed border-white/25"
                  style={{ backgroundColor: `${PARTICIPATION_CARD_GREEN_DARK}cc` }}
                >
                  <span
                    className={`${robotoMono.className} px-1 text-center text-[7px] font-semibold uppercase leading-tight tracking-wide text-white/45`}
                  >
                    QR
                  </span>
                </div>
              )}
            </div>

            <div className="absolute right-[6%] top-[64%] w-[42%]">
              <h3
                className={`${sortsMillGoudy.className} text-base normal-case leading-[0.95] tracking-[-0.05em] text-white sm:text-lg`}
              >
                {displayProjectTitle}
              </h3>
              <p
                className={`${robotoMono.className} mt-1.5 line-clamp-3 text-[7px] font-semibold uppercase leading-relaxed tracking-wide text-white/80 sm:text-[8px]`}
              >
                {displayBlurb}
              </p>
              <p
                className={`${robotoMono.className} mt-2 text-[6.5px] font-semibold uppercase tracking-wide text-white/70 sm:text-[7px]`}
              >
                {displayReferenceId}
              </p>
            </div>

            <div className="absolute bottom-[3.5%] right-[6%] flex flex-col items-end gap-1">
              <p
                className={`${robotoMono.className} max-w-[9rem] text-right text-[5.5px] font-semibold uppercase leading-snug tracking-wide text-white/75 sm:text-[6.5px]`}
              >
                The green internet development center.
              </p>
              <Image
                src="/Hopamine_text.svg"
                alt="Hopamine"
                width={88}
                height={24}
                unoptimized
                className="h-[0.85rem] w-auto opacity-95 sm:h-[0.95rem]"
              />
            </div>
          </div>
        </div>
      </article>
    );
  },
);

ClaimParticipationCard.displayName = "ClaimParticipationCard";
