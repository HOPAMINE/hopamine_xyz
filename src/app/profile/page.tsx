"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../../fonts";
import { AddProjectCard } from "../../../components/projects/AddProjectCard";
import { ProjectsTabPanel } from "../../../components/projects/ProjectsTabPanel";
import { ProfilePanel } from "../../../components/profile/ProfilePanel";

const ACCOUNT_TABS = [
  { id: "profile", label: "Profile" },
  { id: "projects", label: "Projects" },
] as const;

type AccountTabId = (typeof ACCOUNT_TABS)[number]["id"];

const pillBase = `${robotoMono.className} inline-flex shrink-0 touch-manipulation items-center rounded-full border border-white/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3.5 sm:py-2 sm:text-[11px]`;

const actionPillClass = `${pillBase} bg-accent-events text-white hover:bg-white hover:text-accent-events`;

function AccountTabPills({
  activeTab,
  onSelect,
  trailingAction,
}: {
  activeTab: AccountTabId;
  onSelect: (tab: AccountTabId) => void;
  trailingAction?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex w-full flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-1 lg:overflow-visible">
      {ACCOUNT_TABS.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(tab.id)}
            className={
              isSelected
                ? `${pillBase} bg-white text-accent-events`
                : `${pillBase} bg-accent-events text-white hover:bg-white hover:text-accent-events`
            }
          >
            {tab.label}
          </button>
        );
      })}
      {trailingAction}
    </div>
  );
}

function ProjectsTabContent({ builderName }: { builderName: string }) {
  return <ProjectsTabPanel builderName={builderName} />;
}

const editProfileButtonClass = actionPillClass;

function ProfilePageContent() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const convexProfile = useQuery(api.users.getCurrentUser, {});
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const activeTab = (searchParams.get("tab") as AccountTabId) ?? "profile";
  const safeTab: AccountTabId = ACCOUNT_TABS.some((tab) => tab.id === activeTab) ? activeTab : "profile";

  const convexLoading = convexProfile === undefined;
  const convexUser = convexProfile ?? null;

  function setTab(tab: AccountTabId) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "profile") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/dashboard?${query}` : "/dashboard");
  }

  useEffect(() => {
    if (safeTab !== "profile") {
      setIsEditingProfile(false);
    }
  }, [safeTab]);

  const heading = safeTab === "projects" ? "Projects" : "Profile";
  const subtitle =
    safeTab === "projects"
      ? "Projects you ship and contribute to."
      : "Your builder identity — name, location, and what you're working on.";

  if (!clerkLoaded || convexLoading) {
    return (
      <main
        className={`relative min-h-dvh w-full bg-accent-events pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className={`${robotoMono.className} text-sm text-white/75`}>Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative min-h-dvh w-full bg-accent-events pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="max-w-3xl">
            <h1
              className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl`}
            >
              {heading}
            </h1>
            <p className={`${robotoFlex.className} mt-3 text-base text-white/90 sm:text-lg`}>{subtitle}</p>
            <AccountTabPills
              activeTab={safeTab}
              onSelect={setTab}
              trailingAction={
                <>
                  {safeTab === "profile" && convexUser && !isEditingProfile ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className={editProfileButtonClass}
                    >
                      Edit profile
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className={actionPillClass}
                  >
                    Logout
                  </button>
                </>
              }
            />
        </header>

        <section
          className={`mt-8 ${safeTab === "projects" ? "w-full" : "max-w-2xl"}`}
          aria-labelledby="account-tab-content"
        >
          <h2 id="account-tab-content" className="sr-only">
            {safeTab === "projects" ? "Your projects" : "Profile"}
          </h2>
          {safeTab === "projects" ? (
            <ProjectsTabContent builderName={convexUser?.name ?? user?.fullName ?? "You"} />
          ) : !convexUser ? (
            <p className={`${robotoFlex.className} text-sm text-white/75`}>
              No profile found yet. Navigate the app while signed in — it syncs automatically.
            </p>
          ) : (
            <ProfilePanel
              user={convexUser}
              fallbackAvatarUrl={user?.imageUrl}
              isEditing={isEditingProfile}
              onEditingChange={setIsEditingProfile}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  );
}
