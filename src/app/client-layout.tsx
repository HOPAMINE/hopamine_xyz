"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../components/Navbar";
import { api } from "../../convex/_generated/api";
import { Providers } from "./providers";

const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;

/** Syncs Convex `users` when Clerk session exists — only when Convex is configured. */
function UserSyncInner() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const existing = useQuery(
    api.users.getByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );

  useEffect(() => {
    if (!user || !isUserLoaded || existing !== undefined) return;

    void getOrCreateUser({
      name: user.fullName ?? user.firstName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      clerkId: user.id,
      avatarUrl: user.imageUrl ?? "",
      username: user.username || undefined,
    });
  }, [user, isUserLoaded, getOrCreateUser, existing]);

  return null;
}

function UserGate() {
  if (!convexConfigured) return null;
  return <UserSyncInner />;
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <UserGate />
      <Navbar />
      {children}
    </Providers>
  );
}
