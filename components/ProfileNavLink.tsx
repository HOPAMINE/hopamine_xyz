"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

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

const base =
  "inline-flex size-10 shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-full border-2 border-white/90 bg-white/10 text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:size-11";

export function ProfileNavLink({
  className = "",
}: {
  /** e.g. `md:hidden` (mobile toolbar) vs desktop list item */
  className?: string;
}) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div
        className={`${base} ${className}`}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading account</span>
        <span className="block size-7 animate-pulse rounded-full bg-white/25 md:size-8" />
      </div>
    );
  }

  const href = user?.id ? "/dashboard" : "/sign-in";
  const label =
    user?.id ? `Account dashboard (${user.primaryEmailAddress?.emailAddress ?? "signed in"})` : "Sign in";

  return (
    <Link
      href={href}
      className={`${base} ${className}`}
      aria-label={label}
      title={user?.id ? "Dashboard" : "Sign in"}
    >
      {user?.imageUrl ? (
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
    </Link>
  );
}
