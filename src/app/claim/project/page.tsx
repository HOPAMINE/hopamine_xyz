import { ClaimAccessGate } from "../../../../components/claim/ClaimAccessGate";
import { CLAIM_PARTICIPATION_PATH } from "@/lib/claimRoutes";

export default function ClaimProjectPage() {
  return <ClaimAccessGate redirectWhenReady={CLAIM_PARTICIPATION_PATH} signInRedirectPath="/claim/project" />;
}
