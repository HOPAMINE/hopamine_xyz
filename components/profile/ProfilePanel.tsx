"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { ProfileDisplay } from "./ProfileDisplay";
import { ProfileEditForm } from "./ProfileEditForm";

type ProfilePanelProps = {
  user: Doc<"users">;
  fallbackAvatarUrl?: string;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
};

export function ProfilePanel({
  user,
  fallbackAvatarUrl,
  isEditing,
  onEditingChange,
}: ProfilePanelProps) {
  if (isEditing) {
    return (
      <ProfileEditForm
        user={user}
        fallbackAvatarUrl={fallbackAvatarUrl}
        onCancel={() => onEditingChange(false)}
        onSaved={() => onEditingChange(false)}
      />
    );
  }

  return <ProfileDisplay user={user} fallbackAvatarUrl={fallbackAvatarUrl} />;
}
