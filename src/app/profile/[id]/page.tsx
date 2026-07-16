"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { normalizeUsername } from "@/lib/profileUrls";
import { PublicProfileShell } from "../PublicProfileShell";

function PublicProfilePageContent() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded: clerkLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, clerkLoaded ? {} : "skip");

  const usernameParam = typeof params.id === "string" ? params.id : "";
  const normalizedUsername = normalizeUsername(usernameParam);

  const profile = useQuery(
    api.users.getPublicProfileByUsername,
    normalizedUsername ? { username: normalizedUsername } : "skip",
  );

  const isOwnProfile =
    !!currentUser?.username &&
    normalizeUsername(currentUser.username) === normalizedUsername;

  useEffect(() => {
    if (!clerkLoaded || currentUser === undefined || !isOwnProfile) return;
    router.replace("/dashboard");
  }, [clerkLoaded, currentUser, isOwnProfile, router]);

  return (
    <PublicProfileShell
      profile={normalizedUsername ? profile : null}
      isRedirecting={isOwnProfile && currentUser !== undefined}
      invalidMessage="Profile not found."
      notFoundMessage={`No profile found for @${normalizedUsername}.`}
    />
  );
}

export default function ProfileByUsernamePage() {
  return (
    <Suspense>
      <PublicProfilePageContent />
    </Suspense>
  );
}
