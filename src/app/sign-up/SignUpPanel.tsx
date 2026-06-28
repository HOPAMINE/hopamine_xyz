"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ONBOARD_FROM_CLAIM_PATH } from "@/lib/claimRoutes";
import { SignUpForm } from "./SignUpForm";

function SignUpInner() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const destination = redirectUrl?.startsWith("/claim")
    ? ONBOARD_FROM_CLAIM_PATH
    : "/onboard";

  // Set when someone tried to sign in (e.g. with Google) using an email that
  // doesn't have an account yet. We send them here instead of silently creating
  // one, so explain why they landed on sign-up.
  const noAccount = searchParams.get("notice") === "no-account";

  return (
    <div className="w-full">
      {noAccount ? (
        <div className="mb-5 rounded-3xl border border-neutral-100 bg-white px-7 py-6 shadow-[0_18px_50px_rgba(0,166,243,0.10)]">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-navbar">
            No account yet
          </p>
          <p className="font-mono text-[14px] leading-snug text-neutral-700">
            We couldn&apos;t find an account for that email — create one below to
            join the Hopamine Network.
          </p>
        </div>
      ) : null}
      <SignUpForm destination={destination} />
    </div>
  );
}

export function SignUpPanel() {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-neutral-500">Loading…</p>}>
      <SignUpInner />
    </Suspense>
  );
}
