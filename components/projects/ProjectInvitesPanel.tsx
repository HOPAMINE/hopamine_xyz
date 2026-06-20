"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { HACKATHON_FIELDS } from "@/lib/hackathonDirectory";
import { robotoFlex, robotoMono } from "../../fonts";

const actionButtonClass = `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-40`;

export function ProjectInvitesPanel() {
  const invites = useQuery(api.projects.listPendingInvites);
  const acceptInvite = useMutation(api.projects.acceptInvite);
  const declineInvite = useMutation(api.projects.declineInvite);
  const [actingOnInviteId, setActingOnInviteId] = useState<Id<"projectInvites"> | null>(null);

  if (!invites || invites.length === 0) {
    return null;
  }

  async function handleAccept(inviteId: Id<"projectInvites">) {
    setActingOnInviteId(inviteId);
    try {
      await acceptInvite({ inviteId });
    } finally {
      setActingOnInviteId(null);
    }
  }

  async function handleDecline(inviteId: Id<"projectInvites">) {
    setActingOnInviteId(inviteId);
    try {
      await declineInvite({ inviteId });
    } finally {
      setActingOnInviteId(null);
    }
  }

  return (
    <section className="mb-8 space-y-3" aria-labelledby="project-invites-heading">
      <h2
        id="project-invites-heading"
        className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/75`}
      >
        Project invites
      </h2>

      <ul className="space-y-3">
        {invites.map((invite) => {
          const isActing = actingOnInviteId === invite._id;

          return (
            <li
              key={invite._id}
              className="rounded-[1.25rem] border border-white/20 bg-white/5 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start gap-4">
                <Image
                  src={invite.inviterAvatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className={`${robotoMono.className} text-xs uppercase tracking-wide text-white/70`}>
                    {invite.inviterName} invited you to join
                  </p>
                  <p className={`${robotoFlex.className} mt-1 text-lg font-semibold text-white`}>
                    {invite.projectTitle}
                  </p>
                  <p className={`${robotoMono.className} mt-1 text-xs uppercase tracking-wide text-white/60`}>
                    {HACKATHON_FIELDS[invite.field]}
                  </p>
                  <p className={`${robotoFlex.className} mt-2 text-sm text-white/80`}>
                    {invite.projectBlurb}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() => handleAccept(invite._id)}
                  className={`${actionButtonClass} bg-white text-accent-events hover:bg-white/90`}
                >
                  Accept
                </button>
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() => handleDecline(invite._id)}
                  className={`${actionButtonClass} bg-accent-events text-white hover:bg-white hover:text-accent-events`}
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
