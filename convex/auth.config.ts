import type { AuthConfig } from "convex/server";

/**
 * Clerk JWT issuer (Frontend API URL), e.g. https://YOUR-INSTANCE.clerk.accounts.dev
 * Set `CLERK_DOMAIN` on this deployment / in `.env.local` when running `npx convex dev`.
 * @see https://docs.convex.dev/auth/clerk
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
