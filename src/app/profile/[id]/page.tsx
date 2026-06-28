"use client";

import { useUser } from "@clerk/nextjs";
import { useConvex, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { normalizeUsername } from "@/lib/profileUrls";
import { PublicProfileShell } from "../PublicProfileShell";

function PublicProfilePageContent() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded: clerkLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, clerkLoaded ? {} : "skip");
  const convex = useConvex();

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

  const [isOnline, setIsOnline] = useState(false);
  const presenceFetchedRef = useRef(false);

  useEffect(() => {
    if (!profile || presenceFetchedRef.current) return;
    presenceFetchedRef.current = true;
    convex.query(api.presence.getByUser, { userId: profile._id }).then((result) => {
      setIsOnline(result?.isOnline ?? false);
    });
  }, [profile, convex]);

  return (
    <PublicProfileShell
      profile={normalizedUsername ? profile : null}
      isRedirecting={isOwnProfile && currentUser !== undefined}
      invalidMessage="Profile not found."
      notFoundMessage={`No profile found for @${normalizedUsername}.`}
      isOnline={isOnline}
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
