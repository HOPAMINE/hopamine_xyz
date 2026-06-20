"use client";

import Image from "next/image";
import { Doc } from "../../convex/_generated/dataModel";
import { skillsToFormText, trimProfileText } from "@/lib/profileText";
import { robotoFlex, robotoMono } from "../../fonts";

type ProfileDisplayProps = {
  user: Doc<"users">;
  fallbackAvatarUrl?: string;
};

function DisplayField({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div>
      <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-white/55`}>
        {label}
      </p>
      <p className={`${robotoFlex.className} mt-1 text-base text-white/90 whitespace-pre-wrap`}>{value}</p>
    </div>
  );
}

export function ProfileDisplay({ user, fallbackAvatarUrl }: ProfileDisplayProps) {
  const avatarUrl = user.avatarUrl || fallbackAvatarUrl || "";
  const name = trimProfileText(user.name);
  const username = trimProfileText(user.username);
  const bio = trimProfileText(user.bio);
  const location = trimProfileText(user.location);
  const skills = skillsToFormText(user.skills);
  const vision = trimProfileText(user.vision);
  const initials = name.charAt(0).toUpperCase() || "?";

  return (
    <div className="space-y-6">
      <div className="size-20 shrink-0 overflow-hidden rounded-full border-2 border-white/90 bg-white/10 sm:size-24">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={`${robotoMono.className} flex h-full w-full items-center justify-center text-2xl text-white sm:text-3xl`}
          >
            {initials}
          </span>
        )}
      </div>

      <div className="space-y-5">
        <DisplayField label="Name" value={name} />
        <DisplayField label="Username" value={username ? `@${username}` : ""} />
        <DisplayField label="Bio" value={bio} />
        <DisplayField label="Location" value={location} />
        <DisplayField label="Skills" value={skills} />
        <DisplayField label="Vision" value={vision} />
      </div>
    </div>
  );
}
