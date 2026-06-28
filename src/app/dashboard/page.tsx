"use client";

import { useUser } from "@clerk/nextjs";
import { useConvex, useQuery } from "convex/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../../fonts";
import { ProfileTabContent } from "./ProfileTab";

function ProfilePageContent() {
  const { isLoaded: clerkLoaded } = useUser();
  const convexProfile = useQuery(api.users.getCurrentUser, {});
  const convex = useConvex();

  const convexLoading = convexProfile === undefined;
  const convexUser = convexProfile ?? null;

  const [isOnline, setIsOnline] = useState(false);
  const presenceFetchedRef = useRef(false);

  useEffect(() => {
    if (!convexUser || presenceFetchedRef.current) return;
    presenceFetchedRef.current = true;
    convex.query(api.presence.getByUser, { userId: convexUser._id }).then((result) => {
      setIsOnline(result?.isOnline ?? false);
    });
  }, [convexUser, convex]);

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
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-[104px] pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pt-[116px] md:pb-12 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full">
        <section className="w-full" aria-label="Profile">
          {!convexUser ? (
            <p className={`${robotoFlex.className} text-sm text-white/75`}>
              No profile found yet. Navigate the app while signed in — it syncs automatically.
            </p>
          ) : (
            <ProfileTabContent user={convexUser} showFirstNameOnCard isOnline={isOnline} />
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
