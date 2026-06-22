"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { normalizeUsername } from "@/lib/profileUrls";
import { robotoFlex, robotoMono } from "../../../../fonts";
import { ProfileTabContent } from "../../dashboard/ProfileTab";

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

  if (!normalizedUsername) {
    return (
      <main
        className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[112px] pb-10 md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
      >
        <p className={`${robotoFlex.className} text-sm text-neutral-600`}>Profile not found.</p>
      </main>
    );
  }

  if (isOwnProfile && currentUser !== undefined) {
    return (
      <main
        className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[112px] pb-10 md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
      >
        <p className={`${robotoMono.className} text-sm text-neutral-500`}>Loading…</p>
      </main>
    );
  }

  if (profile === undefined) {
    return (
      <main
        className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[112px] pb-10 md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
      >
        <p className={`${robotoMono.className} text-sm text-neutral-500`}>Loading profile…</p>
      </main>
    );
  }

  if (profile === null) {
    return (
      <main
        className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[112px] pb-10 md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
      >
        <p className={`${robotoFlex.className} text-sm text-neutral-600`}>
          No profile found for @{normalizedUsername}.
        </p>
      </main>
    );
  }

  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[112px] pb-10 md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full">
        <section className="w-full" aria-label={`${profile.name} profile`}>
          <ProfileTabContent user={profile} readOnly />
        </section>
      </div>
    </main>
  );
}

export default function ProfileByUsernamePage() {
  return (
    <Suspense>
      <PublicProfilePageContent />
    </Suspense>
  );
}
