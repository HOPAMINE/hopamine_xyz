"use client";

import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../../fonts";
import { ProfileTabContent, type ProfileUser } from "../dashboard/ProfileTab";

type PublicProfileShellProps = {
  profile: ProfileUser | null | undefined;
  isRedirecting?: boolean;
  invalidMessage?: string;
  notFoundMessage?: string;
};

export function PublicProfileShell({
  profile,
  isRedirecting = false,
  invalidMessage = "Profile not found.",
  notFoundMessage = "No profile found.",
}: PublicProfileShellProps) {
  if (isRedirecting) {
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
        <p className={`${robotoFlex.className} text-sm text-neutral-600`}>{notFoundMessage}</p>
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
