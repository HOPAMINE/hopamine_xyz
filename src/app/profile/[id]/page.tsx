"use client";

import { useParams } from "next/navigation";
import { PublicBadgePage } from "../../../../components/profile/PublicBadgePage";

export default function ProfileBadgeRoutePage() {
  const params = useParams();
  const username = typeof params.id === "string" ? params.id : "";

  return <PublicBadgePage username={username} />;
}
