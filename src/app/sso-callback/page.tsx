"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function SSOCallbackContent() {
  const clerk = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let navigated = false;
    const go = (to: string) => {
      if (navigated) return;
      navigated = true;
      router.replace(to);
    };

    async function finish() {
      const next =
        searchParams.get("redirect_url") ??
        searchParams.get("after_sign_in_url") ??
        "/dashboard";

      try {
        // Process the OAuth callback. `transferable: false` stops Clerk from
        // opaquely creating an account when someone signs in via Google with an
        // email that has no account — which previously let people "log in"
        // without an account and skip the whole onboarding flow.
        //
        // The no-op navigate callback suppresses Clerk's own routing so we can
        // decide where to go ourselves based on whether a session was actually
        // established (Clerk still activates the session internally on success).
        await clerk.handleRedirectCallback(
          {
            transferable: false,
            signInUrl: "/sign-in",
            signUpUrl: "/sign-up",
            signInFallbackRedirectUrl: next,
            signUpFallbackRedirectUrl: next,
          },
          async () => {},
        );
      } catch (err) {
        // A failed/dead-end OAuth sign-in throws here. That's expected when no
        // account exists; fall through to the session check below.
        if (process.env.NODE_ENV === "development") {
          console.debug(
            "[sso-callback] handleRedirectCallback threw:",
            err,
          );
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.debug("[sso-callback] state after callback:", {
          isSignedIn: clerk.isSignedIn,
          signInStatus: clerk.client?.signIn?.status,
          firstFactor: clerk.client?.signIn?.firstFactorVerification?.status,
          firstFactorError:
            clerk.client?.signIn?.firstFactorVerification?.error?.code,
          signUpStatus: clerk.client?.signUp?.status,
        });
      }

      if (clerk.isSignedIn) {
        // Existing account — sign-in completed and the session is active.
        go(next);
        return;
      }

      // No account for this Google identity. The OAuth attempt leaves a dangling
      // "transferable" sign-in on the client; if we just navigate to /sign-up the
      // prebuilt <SignUp> hands that state back to the sign-in flow and bounces
      // the user to /sign-in. signOut() resets the client to a clean state, so we
      // clear it first, then do a hard navigation to sign up with an explanation.
      navigated = true;
      try {
        await clerk.signOut();
      } catch {
        // Ignore — there's no active session, we only want the client reset.
      }
      window.location.replace("/sign-up?notice=no-account");
    }

    void finish();
  }, [clerk, router, searchParams]);

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
