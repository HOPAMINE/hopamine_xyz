"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";

export default function DashboardPage() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const convexProfile = useQuery(api.users.getCurrentUser, {});

  const convexDeployUrl =
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string"
      ? process.env.NEXT_PUBLIC_CONVEX_URL
      : "";

  const convexLoading = convexProfile === undefined;
  const convexUser = convexProfile ?? null;

  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-28 pb-16 md:pt-32 md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 normal-case border-b border-accent-navbar/20 pb-8">
        <div className="min-w-0 space-y-1">
          <p className="font-mono text-xs uppercase tracking-wide text-accent-navbar">
            Your account
          </p>
          <h1 className="wrap-break-word font-serif text-4xl tracking-[-0.04em] text-neutral-900 sm:text-5xl">
            Dashboard
          </h1>
          <p className="max-w-xl font-mono text-sm leading-snug text-neutral-600">
            Hopamine profiles use Clerk for sign-in and Convex for realtime app
            data. Manage your Clerk session below; Convex reflects your synced
            user row.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <UserButton appearance={{ variables: { colorPrimary: "#00a6f3" } }} />
          <Link
            href="/"
            className="inline-flex touch-manipulation items-center border border-accent-navbar bg-white px-4 py-2 font-mono text-xs uppercase tracking-wide text-accent-navbar transition-opacity hover:opacity-90"
          >
            Home
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section
          aria-labelledby="clerk-heading"
          className="space-y-4 rounded-none border-2 border-accent-navbar bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="clerk-heading" className="font-mono text-sm uppercase tracking-wide text-accent-navbar">
              Clerk
            </h2>
            <a
              href="https://clerk.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-neutral-500 underline decoration-neutral-400 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Docs ↗
            </a>
          </div>

          {!clerkLoaded ? (
            <p className="font-mono text-sm text-neutral-600">Loading…</p>
          ) : (
            <dl className="grid gap-3 font-mono text-sm normal-case">
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Name
                </dt>
                <dd className="wrap-break-word text-neutral-900">
                  {user?.fullName || user?.firstName || "(not set)"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Email
                </dt>
                <dd className="wrap-break-word text-neutral-900">
                  {user?.primaryEmailAddress?.emailAddress ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                  User ID (Clerk)
                </dt>
                <dd className="break-all font-mono text-xs text-neutral-900">
                  {user?.id ?? "—"}
                </dd>
              </div>
            </dl>
          )}

          <p className="border-t border-neutral-200 pt-4 font-mono text-xs leading-snug normal-case text-neutral-600">
            Use the Clerk button above for account settings (password,
            connections, sessions). Hosted profile is Clerk — your Convex row
            is provisioned automatically when you open the app signed in.
          </p>
        </section>

        <section
          aria-labelledby="convex-heading"
          className="space-y-4 rounded-none border-2 border-accent-navbar bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="convex-heading" className="font-mono text-sm uppercase tracking-wide text-accent-navbar">
              Convex
            </h2>
            <a
              href="https://dashboard.convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-neutral-500 underline decoration-neutral-400 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Dashboard ↗
            </a>
          </div>

          {!clerkLoaded || convexLoading ? (
            <p className="font-mono text-sm text-neutral-600">
              Connecting to Convex…
            </p>
          ) : !user?.id ? (
            <p className="font-mono text-sm text-neutral-600">
              Sign in to load your Convex profile.
            </p>
          ) : convexUser ? (
            <dl className="grid gap-3 font-mono text-sm normal-case">
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Name
                </dt>
                <dd className="wrap-break-word text-neutral-900">
                  {convexUser.name || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Email
                </dt>
                <dd className="wrap-break-word text-neutral-900">
                  {convexUser.email}
                </dd>
              </div>
              {convexUser.username ? (
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                    Username
                  </dt>
                  <dd className="text-neutral-900">{convexUser.username}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Clerk ID stored in Convex
                </dt>
                <dd className="break-all text-xs text-neutral-900">
                  {convexUser.clerkId}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="space-y-2">
              <p className="font-mono text-sm text-neutral-600">
                No Convex user row yet. Navigate the app while signed in — your
                profile syncs automatically from Clerk.
              </p>
              <p className="font-mono text-xs text-neutral-500">
                If this persists, check{" "}
                <code className="rounded-none bg-neutral-100 px-1 py-px">
                  NEXT_PUBLIC_CONVEX_URL
                </code>{" "}
                and that Convex dev is running.
              </p>
            </div>
          )}

          <div className="border-t border-neutral-200 pt-4 normal-case">
            <p className="font-mono text-[10px] uppercase tracking-wide text-neutral-400">
              Deployment URL
            </p>
            {convexDeployUrl ? (
              <code className="mt-2 block wrap-break-word text-xs leading-relaxed text-neutral-800">
                {convexDeployUrl}
              </code>
            ) : (
              <p className="mt-2 font-mono text-xs text-neutral-500">
                Set{" "}
                <code>NEXT_PUBLIC_CONVEX_URL</code> in{" "}
                <code>.env.local</code>
              </p>
            )}
          </div>
        </section>
      </div>

      <aside className="mt-12 rounded-none border border-accent-navbar/30 bg-white/60 p-6 font-mono text-xs uppercase tracking-wide normal-case backdrop-blur-sm">
        <p className="text-neutral-700">
          <strong className="text-accent-navbar">Shortcuts:</strong>{" "}
          <Link href="/projects" className="underline underline-offset-4 hover:opacity-80">
            Projects
          </Link>
          {" · "}
          <Link href="/builders" className="underline underline-offset-4 hover:opacity-80">
            Builders
          </Link>
          {" · "}
          <Link href="/directory" className="underline underline-offset-4 hover:opacity-80">
            Directory
          </Link>
          {" · "}
          <a
            href="https://dashboard.convex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
          >
            Convex clouds
          </a>
          {" · "}
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
          >
            Clerk apps dashboard
          </a>{" "}
          (developers)
        </p>
      </aside>
    </main>
  );
}
