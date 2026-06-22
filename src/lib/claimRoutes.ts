export const CLAIM_PARTICIPATION_PATH = "/claim/participation";

export const ONBOARD_FROM_CLAIM_PATH = "/onboard?from=claim";

export function isClaimPath(pathname: string): boolean {
  return pathname === "/claim" || pathname.startsWith("/claim/");
}

export function getOnboardingPath(pathname: string): string {
  return isClaimPath(pathname) ? ONBOARD_FROM_CLAIM_PATH : "/onboard";
}
