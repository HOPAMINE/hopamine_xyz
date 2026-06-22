"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PublicProfileShell } from "../../PublicProfileShell";

function PublicProfileByIdPageContent() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded: clerkLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, clerkLoaded ? {} : "skip");

  const userIdParam = typeof params.userId === "string" ? params.userId : "";
  const userId = userIdParam as Id<"users">;

  const profile = useQuery(
    api.users.getPublicProfileByUserId,
    userIdParam ? { userId } : "skip",
  );

  const isOwnProfile = !!currentUser && currentUser._id === userIdParam;

  useEffect(() => {
    if (!clerkLoaded || currentUser === undefined || !isOwnProfile) return;
    router.replace("/dashboard");
  }, [clerkLoaded, currentUser, isOwnProfile, router]);

  return (
    <PublicProfileShell
      profile={userIdParam ? profile : null}
      isRedirecting={isOwnProfile && currentUser !== undefined}
      invalidMessage="Profile not found."
      notFoundMessage="No profile found for this builder."
    />
  );
}

export default function ProfileByUserIdPage() {
  return (
    <Suspense>
      <PublicProfileByIdPageContent />
    </Suspense>
  );
}
