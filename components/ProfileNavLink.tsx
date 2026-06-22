"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { isGreenNavRoute } from "@/lib/navRoutes";

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

const profileAvatar =
  "inline-flex size-10 shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-full border-2 border-white/90 bg-white/10 text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const getStartedMarketing =
  "inline-flex h-10 shrink-0 touch-manipulation items-center justify-center bg-white px-4 font-mono text-xs font-bold uppercase tracking-wide text-accent-navbar transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-sm";

const getStartedEvents =
  "inline-flex h-10 shrink-0 touch-manipulation items-center justify-center bg-white px-4 font-mono text-xs font-bold uppercase tracking-wide text-accent-events transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-sm";

export function ProfileNavLink({
  className = "",
  showLabel = false,
}: {
  /** e.g. `md:hidden` (mobile toolbar) vs desktop list item */
  className?: string;
  showLabel?: boolean;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const isGreenNav = isGreenNavRoute(pathname);
  const getStartedClass = isGreenNav ? getStartedEvents : getStartedMarketing;

  if (!isLoaded) {
    return (
      <div
        className={`${getStartedClass} ${className}`}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading account</span>
        <span
          className={`block h-4 w-20 animate-pulse rounded ${isGreenNav ? "bg-accent-events/20" : "bg-accent-navbar/20"}`}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/sign-in" className={`${getStartedClass} ${className}`}>
        Get Started
      </Link>
    );
  }

  const label = `Account dashboard (${user.primaryEmailAddress?.emailAddress ?? "signed in"})`;

  return (
    <Link
      href="/dashboard"
      className={`inline-flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
      aria-label={showLabel ? undefined : label}
      title="Dashboard"
    >
      {showLabel ? <span>Profile</span> : null}
      <span className={profileAvatar} aria-hidden={showLabel || undefined}>
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt=""
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserCircleIcon className="h-[22px] w-[22px]" />
        )}
      </span>
    </Link>
  );
}
