"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { api } from "../../convex/_generated/api";
import { Providers } from "./providers";

const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;

/** Routes that are exempt from the onboarding gate. */
const ONBOARDING_EXEMPT = ["/onboard", "/sign-in", "/sign-up", "/sso-callback"];

/** Syncs Convex `users` when Clerk session exists and gates incomplete onboarding. */
function UserSyncInner() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const existing = useQuery(
    api.users.getByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const pathname = usePathname();
  const router = useRouter();

  // Create the Convex user row when a Clerk session first appears
  useEffect(() => {
    if (!user || !isUserLoaded || existing !== undefined) return;

    void getOrCreateUser({
      name: user.fullName ?? user.firstName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      clerkId: user.id,
      avatarUrl: user.imageUrl ?? "",
      username: user.username || undefined,
    });
  }, [user, isUserLoaded, getOrCreateUser, existing]);

  // Redirect to onboarding if the user hasn't completed it yet
  useEffect(() => {
    if (!existing) return; // null (not loaded yet) or skip
    if (existing.onboardingCompletedAt) return; // already done
    if (ONBOARDING_EXEMPT.some((p) => pathname.startsWith(p))) return;
    router.replace("/onboard");
  }, [existing, pathname, router]);

  return null;
}

function UserGate() {
  if (!convexConfigured) return null;
  return <UserSyncInner />;
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <UserGate />
      <Navbar />
      {children}
    </Providers>
  );
}
