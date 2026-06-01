"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";

const TABS = [
  { id: "projects", label: "My Projects" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabId) ?? "projects";

  function setTab(id: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-28 pb-16 md:pt-32 md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <header>
        <h1 className="font-serif text-4xl tracking-[-0.04em] text-white sm:text-5xl">
          Dashboard
        </h1>

        <nav className="mt-6 flex gap-6 border-b border-white/20">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={[
                  "relative pb-3 font-mono text-sm uppercase tracking-wide transition-colors",
                  isActive
                    ? "font-semibold text-white"
                    : "text-white/50 hover:text-white/80",
                ].join(" ")}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="mt-10">
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </main>
  );
}

function ProjectsTab() {
  return <div />;
}

function ProfileTab() {
  return <div />;
}

function SettingsRow({
  label,
  description,
  value,
  action,
}: {
  label: string;
  description?: string;
  value?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 py-4 border-b border-neutral-100 last:border-0">
      <div className="min-w-0">
        <p className="font-mono text-sm text-neutral-900">{label}</p>
        {description && (
          <p className="mt-0.5 font-mono text-xs text-neutral-400 leading-snug">{description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {value && (
          <span className="font-mono text-sm text-neutral-500 truncate max-w-xs">{value}</span>
        )}
        {action}
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-xs uppercase tracking-widest text-[#00a6f3] mb-1">{title}</h2>
      <div className="border border-neutral-200 rounded-sm divide-y divide-neutral-100 bg-white px-5">
        {children}
      </div>
    </section>
  );
}

function SettingsTab() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const { isAuthenticated: convexAuthed } = useConvexAuth();
  const convexProfile = useQuery(api.users.getCurrentUser, {});
  const deleteAccount = useMutation(api.users.deleteAccount);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "deleting">("idle");

  async function handleDeleteAccount() {
    if (!convexAuthed) return;
    setDeleteStep("deleting");
    try {
      await deleteAccount();
      await user?.delete();
    } catch (err) {
      console.error(err);
      setDeleteStep("confirm");
    }
  }

  const convexDeployUrl =
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string"
      ? process.env.NEXT_PUBLIC_CONVEX_URL
      : "";

  const convexLoading = convexProfile === undefined;
  const convexUser = convexProfile ?? null;

  if (!clerkLoaded || convexLoading) {
    return <p className="font-mono text-sm text-neutral-400">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <SettingsSection title="Account">
        <SettingsRow
          label="Name"
          value={user?.fullName || user?.firstName || "—"}
          action={
            <UserButton appearance={{ variables: { colorPrimary: "#00a6f3" } }} />
          }
        />
        <SettingsRow
          label="Email"
          value={user?.primaryEmailAddress?.emailAddress ?? "—"}
        />
        <SettingsRow
          label="Clerk ID"
          description="Your unique Clerk user identifier"
          value={
            <code className="text-xs text-neutral-500 break-all">{user?.id ?? "—"}</code>
          }
        />
      </SettingsSection>

      <SettingsSection title="Convex Profile">
        {!convexUser ? (
          <div className="py-4">
            <p className="font-mono text-sm text-neutral-500">
              No Convex profile found. Navigate the app while signed in — it syncs automatically.
            </p>
          </div>
        ) : (
          <>
            <SettingsRow label="Name" value={convexUser.name || "—"} />
            <SettingsRow label="Email" value={convexUser.email} />
            {convexUser.username && (
              <SettingsRow label="Username" value={convexUser.username} />
            )}
            <SettingsRow
              label="Convex User ID"
              description="Clerk ID stored in Convex"
              value={
                <code className="text-xs text-neutral-500 break-all">{convexUser.clerkId}</code>
              }
            />
          </>
        )}
        <SettingsRow
          label="Deployment URL"
          value={
            convexDeployUrl ? (
              <code className="text-xs text-neutral-500">{convexDeployUrl}</code>
            ) : (
              <span className="text-xs text-neutral-400">Not set — add NEXT_PUBLIC_CONVEX_URL to .env.local</span>
            )
          }
        />
      </SettingsSection>

      <SettingsSection title="Danger Zone">
        <SettingsRow
          label="Delete account"
          description="Permanently deletes your Convex profile and Clerk account. Cannot be undone."
          action={
            deleteStep === "idle" ? (
              <button
                onClick={() => setDeleteStep("confirm")}
                className="font-mono text-xs uppercase tracking-wide text-red-500 bg-white border border-red-300 px-3 py-1.5 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            ) : deleteStep === "confirm" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={!convexAuthed}
                  className="font-mono text-xs uppercase tracking-wide text-white bg-red-500 border border-red-500 px-3 py-1.5 hover:bg-red-600 transition-colors disabled:opacity-40"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setDeleteStep("idle")}
                  className="font-mono text-xs uppercase tracking-wide text-neutral-600 bg-white border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <span className="font-mono text-xs text-neutral-400">Deleting…</span>
            )
          }
        />
      </SettingsSection>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
