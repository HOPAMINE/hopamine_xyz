"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Suspense } from "react";
import { api } from "../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../../fonts";
import { ProfileTabContent } from "./ProfileTab";

function ProfilePageContent() {
  const { isLoaded: clerkLoaded } = useUser();
  const convexProfile = useQuery(api.users.getCurrentUser, {});

  const convexLoading = convexProfile === undefined;
  const convexUser = convexProfile ?? null;

  if (!clerkLoaded || convexLoading) {
    return (
      <main
        className={`relative min-h-dvh w-full bg-accent-navbar pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
      >
        <div className="mx-auto w-full pt-10px">
          <p className={`${robotoMono.className} text-sm text-white/75`}>Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[112px] pb-10 md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full">
        <section className="w-full" aria-label="Profile">
          {!convexUser ? (
            <p className={`${robotoFlex.className} text-sm text-white/75`}>
              No profile found yet. Navigate the app while signed in — it syncs automatically.
            </p>
          ) : (
            <ProfileTabContent user={convexUser} showFirstNameOnCard />
          )}
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  );
}
