"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { HACKATHON_FIELDS } from "@/lib/hackathonDirectory";
import { robotoFlex, robotoMono } from "../fonts";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const bellButtonClass =
  "relative inline-flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const actionButtonClass = `${robotoMono.className} inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-40`;

export function NavbarNotifications() {
  const { isLoaded, isSignedIn } = useUser();
  const invites = useQuery(api.projects.listPendingInvites);
  const acceptInvite = useMutation(api.projects.acceptInvite);
  const declineInvite = useMutation(api.projects.declineInvite);

  const [open, setOpen] = useState(false);
  const [actingOnInviteId, setActingOnInviteId] = useState<Id<"projectInvites"> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const inviteCount = invites?.length ?? 0;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!isLoaded || !isSignedIn) {
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
    <div ref={panelRef} className="relative">
      <button
        type="button"
        className={bellButtonClass}
        aria-label={inviteCount > 0 ? `${inviteCount} notifications` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <BellIcon />
        {inviteCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-accent-navbar">
            {inviteCount > 9 ? "9+" : inviteCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute top-[calc(100%+0.75rem)] right-0 z-60 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/20 bg-white text-neutral-900 shadow-xl"
        >
          <div className="border-b border-neutral-100 px-4 py-3">
            <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-neutral-500`}>
              Notifications
            </p>
          </div>

          {invites === undefined ? (
            <p className={`${robotoMono.className} px-4 py-6 text-sm text-neutral-500`}>Loading…</p>
          ) : invites.length === 0 ? (
            <p className={`${robotoMono.className} px-4 py-6 text-sm text-neutral-500`}>
              No new notifications.
            </p>
          ) : (
            <ul className="max-h-[min(24rem,60dvh)] overflow-y-auto">
              {invites.map((invite) => {
                const isActing = actingOnInviteId === invite._id;

                return (
                  <li key={invite._id} className="border-b border-neutral-100 px-4 py-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <Image
                        src={invite.inviterAvatarUrl}
                        alt=""
                        width={36}
                        height={36}
                        unoptimized
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`${robotoMono.className} text-[10px] uppercase tracking-wide text-neutral-500`}>
                          {invite.inviterName} invited you
                        </p>
                        <p className={`${robotoFlex.className} mt-0.5 text-sm font-semibold text-neutral-900`}>
                          {invite.projectTitle}
                        </p>
                        <p className={`${robotoMono.className} mt-0.5 text-[10px] uppercase tracking-wide text-neutral-400`}>
                          {HACKATHON_FIELDS[invite.field]}
                        </p>
                        <p className={`${robotoFlex.className} mt-1.5 line-clamp-2 text-xs text-neutral-600`}>
                          {invite.projectBlurb}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleAccept(invite._id)}
                        className={`${actionButtonClass} border-[#00a6f3] bg-[#00a6f3] text-white hover:bg-[#0096dc]`}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleDecline(invite._id)}
                        className={`${actionButtonClass} border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50`}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
