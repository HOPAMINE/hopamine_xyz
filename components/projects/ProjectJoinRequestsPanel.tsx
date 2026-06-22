"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { robotoFlex, robotoMono } from "../../fonts";

const actionButtonClass = `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-40`;

export function ProjectJoinRequestsPanel({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const requests = useQuery(api.projects.listPendingJoinRequests);
  const acceptJoinRequest = useMutation(api.projects.acceptJoinRequest);
  const declineJoinRequest = useMutation(api.projects.declineJoinRequest);
  const [actingOnRequestId, setActingOnRequestId] = useState<Id<"projectJoinRequests"> | null>(
    null,
  );

  if (!requests || requests.length === 0) {
    return null;
  }

  const headingClass =
    variant === "light"
      ? `${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-neutral-500`
      : `${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/75`;

  const cardClass =
    variant === "light"
      ? "rounded-[1.25rem] border border-neutral-200 bg-neutral-50 p-4 sm:p-5"
      : "rounded-[1.25rem] border border-white/20 bg-white/5 p-4 sm:p-5";

  const titleClass =
    variant === "light"
      ? `${robotoFlex.className} mt-1 text-lg font-semibold text-neutral-900`
      : `${robotoFlex.className} mt-1 text-lg font-semibold text-white`;

  const metaClass =
    variant === "light"
      ? `${robotoMono.className} text-xs uppercase tracking-wide text-neutral-500`
      : `${robotoMono.className} text-xs uppercase tracking-wide text-white/70`;

  async function handleAccept(requestId: Id<"projectJoinRequests">) {
    setActingOnRequestId(requestId);
    try {
      await acceptJoinRequest({ requestId });
    } finally {
      setActingOnRequestId(null);
    }
  }

  async function handleDecline(requestId: Id<"projectJoinRequests">) {
    setActingOnRequestId(requestId);
    try {
      await declineJoinRequest({ requestId });
    } finally {
      setActingOnRequestId(null);
    }
  }

  return (
    <section className="mb-8 space-y-3" aria-labelledby="project-join-requests-heading">
      <h2 id="project-join-requests-heading" className={headingClass}>
        Join requests
      </h2>

      <ul className="space-y-3">
        {requests.map((request) => {
          const isActing = actingOnRequestId === request._id;

          return (
            <li key={request._id} className={cardClass}>
              <div className="flex flex-wrap items-start gap-4">
                <Image
                  src={request.requesterAvatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className={metaClass}>{request.requesterName} wants to join</p>
                  <p className={titleClass}>{request.projectTitle}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() => void handleAccept(request._id)}
                  className={
                    variant === "light"
                      ? `${actionButtonClass} border-[#00a6f3] bg-[#00a6f3] text-white hover:bg-[#0096dc]`
                      : `${actionButtonClass} bg-white text-accent-events hover:bg-white/90`
                  }
                >
                  Accept
                </button>
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() => void handleDecline(request._id)}
                  className={
                    variant === "light"
                      ? `${actionButtonClass} border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50`
                      : `${actionButtonClass} bg-accent-events text-white hover:bg-white hover:text-accent-events`
                  }
                >
                  Decline
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
