"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { api } from "../../convex/_generated/api";
import { CLAIM_PARTICIPATION_PATH } from "@/lib/claimRoutes";
import { ClaimNavbar } from "./ClaimNavbar";
import { roboto, robotoMono } from "../../fonts";

const primaryButtonClass = `${robotoMono.className} inline-flex items-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#13450E] transition-opacity hover:opacity-90`;

type ClaimAccessGateProps = {
  children?: ReactNode;
  /** When set, onboarded users are redirected here instead of seeing children. */
  redirectWhenReady?: string;
  signInRedirectPath?: string;
  signInTitle?: string;
  signInDescription?: string;
};

function ClaimGateShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#13450E] text-white">
      <ClaimNavbar />
      {children}
    </div>
  );
}

export function ClaimAccessGate({
  children,
  redirectWhenReady,
  signInRedirectPath = CLAIM_PARTICIPATION_PATH,
  signInTitle = "Claim your hackathon badge",
  signInDescription = "Sign in to claim your builder badge and project on Hopamine.",
}: ClaimAccessGateProps) {
  const router = useRouter();
  const { user, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser, clerkLoaded && user ? {} : "skip");

  const isReady =
    clerkLoaded && !!user && convexUser !== undefined && !!convexUser?.onboardingCompletedAt;

  useEffect(() => {
    if (!isReady || !redirectWhenReady) return;
    router.replace(redirectWhenReady);
  }, [isReady, redirectWhenReady, router]);

  if (!clerkLoaded) {
    return (
      <ClaimGateShell>
        <p className={`${robotoMono.className} px-5 text-sm text-white/75`}>Loading…</p>
      </ClaimGateShell>
    );
  }

  if (!user) {
    const signInHref = `/sign-in?redirect_url=${encodeURIComponent(signInRedirectPath)}`;
    return (
      <ClaimGateShell>
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <h1 className={`${roboto.className} text-3xl font-bold tracking-[-0.03em] sm:text-4xl`}>
            {signInTitle}
          </h1>
          <p className={`${roboto.className} mt-4 text-base text-white/80`}>{signInDescription}</p>
          <Link href={signInHref} className={`${primaryButtonClass} mt-8`}>
            Sign in
          </Link>
        </div>
      </ClaimGateShell>
    );
  }

  if (convexUser === undefined) {
    return (
      <ClaimGateShell>
        <p className={`${robotoMono.className} px-5 text-sm text-white/75`}>Loading…</p>
      </ClaimGateShell>
    );
  }

  if (!convexUser?.onboardingCompletedAt) {
    return (
      <ClaimGateShell>
        <p className={`${robotoMono.className} px-5 text-sm text-white/75`}>
          Finishing setup…
        </p>
      </ClaimGateShell>
    );
  }

  if (redirectWhenReady) {
    return (
      <ClaimGateShell>
        <p className={`${robotoMono.className} px-5 text-sm text-white/75`}>Loading…</p>
      </ClaimGateShell>
    );
  }

  return <>{children}</>;
}
