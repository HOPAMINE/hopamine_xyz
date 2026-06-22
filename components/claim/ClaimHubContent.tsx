"use client";

import { ClaimAccessGate } from "./ClaimAccessGate";
import { CLAIM_PARTICIPATION_PATH } from "@/lib/claimRoutes";

export function ClaimHubContent() {
  return (
    <ClaimAccessGate
      redirectWhenReady={CLAIM_PARTICIPATION_PATH}
      signInRedirectPath="/claim"
      signInTitle="Claim your hackathon badge"
      signInDescription="Sign in to claim your builder badge and project on Hopamine."
    />
  );
}
