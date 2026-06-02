import type { AuthConfig } from "convex/server";

/**
 * Clerk JWT issuer (Frontend API URL), e.g. https://YOUR-INSTANCE.clerk.accounts.dev
 * Set `CLERK_JWT_ISSUER_DOMAIN` on the Convex deployment (and in `.env.local` for `npx convex dev`).
 * @see https://docs.convex.dev/auth/clerk
 */
const clerkIssuerDomain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ?? process.env.CLERK_DOMAIN;

if (!clerkIssuerDomain) {
  throw new Error(
    "Missing CLERK_JWT_ISSUER_DOMAIN (or CLERK_DOMAIN). Set it in the Convex dashboard and .env.local.",
  );
}

export default {
  providers: [
    {
      domain: clerkIssuerDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
