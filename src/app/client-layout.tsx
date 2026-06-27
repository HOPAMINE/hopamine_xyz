"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser, useAuth } from "@clerk/nextjs";
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
  const { getToken } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const ensureUsername = useMutation(api.users.ensureUsername);
  const setOnline = useMutation(api.presence.setOnline);
  const existing = useQuery(
    api.users.getCurrentUser,
    isUserLoaded && user ? {} : "skip",
  );
  const pathname = usePathname();
  const router = useRouter();
  const tokenRef = useRef<string | null>(null);
  const didSetOnlineRef = useRef(false);

  // Create the Convex user row when a Clerk session first appears
  useEffect(() => {
    if (!user || !isUserLoaded || existing !== undefined) return;

    void getOrCreateUser({
      name: user.fullName ?? user.firstName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      clerkId: user.id,
      avatarUrl: user.imageUrl ?? "",
      username: user.username || undefined,
    }).catch((err: unknown) => {
      console.error("[UserSync] getOrCreate failed:", err);
    });
  }, [user, isUserLoaded, getOrCreateUser, existing]);

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

  // Mark online once when user data first becomes available
  useEffect(() => {
    if (!existing || didSetOnlineRef.current) return;
    didSetOnlineRef.current = true;
    void setOnline();
  }, [existing, setOnline]);

  // Keep tokenRef fresh and fire keepalive offline on tab close
  useEffect(() => {
    if (!existing) return;

    const convexSiteUrl = (process.env.NEXT_PUBLIC_CONVEX_URL ?? "")
      .replace(".convex.cloud", ".convex.site");

    const refreshToken = async () => {
      const token = await getToken({ template: "convex" });
      tokenRef.current = token ?? null;
    };

    void refreshToken();

    const handleVisible = () => {
      if (document.visibilityState === "visible") void refreshToken();
    };

    const handlePageHide = () => {
      if (tokenRef.current && convexSiteUrl) {
        void fetch(`${convexSiteUrl}/presence/offline`, {
          method: "POST",
          keepalive: true,
          headers: { Authorization: `Bearer ${tokenRef.current}` },
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleVisible);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleVisible);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [existing, getToken]);

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
