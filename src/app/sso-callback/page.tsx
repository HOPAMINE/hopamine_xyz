"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function SSOCallbackContent() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function finish() {
      const next =
        searchParams.get("redirect_url") ??
        searchParams.get("after_sign_in_url") ??
        "/dashboard";
      try {
        await handleRedirectCallback({
          signInUrl: "/sign-in",
          signUpUrl: "/sign-up",
          signInFallbackRedirectUrl: next,
          signUpFallbackRedirectUrl: next,
        });
        router.replace(next);
      } catch {
        router.replace("/sign-in");
      }
    }
    void finish();
  }, [handleRedirectCallback, router, searchParams]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-accent-navbar text-white">
      <div
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent"
      />
      <p className="font-mono text-sm uppercase tracking-wide">Signing you in...</p>
    </div>
  );
}

export default function SSOPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-accent-navbar">
          <p className="font-mono text-sm uppercase tracking-wide text-white">Loading...</p>
        </div>
      }
    >
      <SSOCallbackContent />
    </Suspense>
  );
}
