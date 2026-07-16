"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { isPortalRoute, isProjectsRoute, isGreenNavRoute } from "@/lib/navRoutes";
import { getOnboardingPath } from "@/lib/claimRoutes";
import { PORTAL_GRADIENT_BG } from "@/lib/layoutConstants";
import { api } from "../../convex/_generated/api";
import { Providers } from "./providers";

const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;

/** Routes that are exempt from the onboarding gate. */
const ONBOARDING_EXEMPT = ["/onboard", "/sign-in", "/sign-up", "/sso-callback", "/profile-compare", "/hopathon"];

/** Syncs Convex `users` when Clerk session exists and gates incomplete onboarding. */
function UserSyncInner() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const ensureUsername = useMutation(api.users.ensureUsername);
  const existing = useQuery(
    api.users.getCurrentUser,
    isUserLoaded && user ? {} : "skip",
  );
  const pathname = usePathname();
  const router = useRouter();
  const creatingRef = useRef(false);

  // Create the Convex user row once a Clerk session exists AND the Convex auth
  // token is ready. Gating on `isAuthenticated` (rather than firing as soon as
  // the query is loading) avoids a race on fresh signups where the mutation runs
  // before the token propagates, throws "Unauthorized", and is never retried —
  // leaving the user with no row and stranded off the onboarding gate.
  useEffect(() => {
    if (!user || !isUserLoaded || !isAuthenticated) return;
    if (existing || creatingRef.current) return; // row exists or creation in flight

    creatingRef.current = true;
    void getOrCreateUser({
      name: user.fullName ?? user.firstName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      clerkId: user.id,
      avatarUrl: user.imageUrl ?? "",
      username: user.username || undefined,
    })
      .catch((err: unknown) => {
        console.error("[UserSync] getOrCreate failed:", err);
      })
      .finally(() => {
        creatingRef.current = false;
      });
  }, [user, isUserLoaded, isAuthenticated, existing, getOrCreateUser]);

  // Assign a Hopamine username when missing (e.g. legacy accounts or skipped onboarding step)
  useEffect(() => {
    if (!existing || existing.username?.trim()) return;
    void ensureUsername().catch((err: unknown) => {
      console.error("[UserSync] ensureUsername failed:", err);
    });
  }, [existing, ensureUsername]);

  // Redirect to onboarding if the user hasn't completed it yet
  useEffect(() => {
    if (!existing) return;
    if (existing.onboardingCompletedAt) return;
    if (ONBOARDING_EXEMPT.some((p) => pathname.startsWith(p))) return;
    router.replace(getOnboardingPath(pathname));
  }, [existing, pathname, router]);

  return null;
}

function UserGate() {
  if (!convexConfigured) return null;
  return <UserSyncInner />;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = isPortalRoute(pathname);
  const usePortalGradient = isPortal && !isProjectsRoute(pathname) && !isGreenNavRoute(pathname);

  if (usePortalGradient) {
    return (
      <div className="relative min-h-dvh w-full">
        <div
          className={`pointer-events-none absolute inset-0 ${PORTAL_GRADIENT_BG}`}
          aria-hidden
        />
        <Navbar />
        <div className="relative">{children}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHopathon = pathname === "/hopathon" || pathname.startsWith("/hopathon/");
  const isClaim = pathname === "/claim" || pathname.startsWith("/claim/");
  const isLanding = pathname === "/";

  if (isHopathon) {
    return <>{children}</>;
  }

  if (isClaim) {
    return (
      <Providers>
        <UserGate />
        {children}
      </Providers>
    );
  }

  return (
    <Providers>
      <UserGate />
      <div
        className={`h-dvh overflow-x-hidden ${isLanding ? "overflow-y-hidden" : "overflow-y-auto"}`}
      >
        <AppShell>{children}</AppShell>
      </div>
    </Providers>
  );
}
