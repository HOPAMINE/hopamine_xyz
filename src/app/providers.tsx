"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useMemo, type ReactNode } from "react";

function ConvexGate({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
  const client = useMemo(
    () =>
      convexUrl !== ""
        ? new ConvexReactClient(convexUrl, {
            verbose: process.env.NODE_ENV === "development",
          })
        : null,
    [convexUrl],
  );

  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <ConvexGate>{children}</ConvexGate>
    </ClerkProvider>
  );
}
