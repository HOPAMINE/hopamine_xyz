import { ClaimParticipationContent } from "../../../../components/claim/ClaimParticipationContent";
import { ClaimAccessGate } from "../../../../components/claim/ClaimAccessGate";

export default function ClaimParticipationPage() {
  return (
    <ClaimAccessGate>
      <ClaimParticipationContent />
    </ClaimAccessGate>
  );
}
