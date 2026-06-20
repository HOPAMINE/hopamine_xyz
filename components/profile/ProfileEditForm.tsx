"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import {
  parseSkillsInput,
  skillsToFormText,
  trimProfileText,
} from "@/lib/profileText";
import { robotoMono } from "../../fonts";
import { LocationInput } from "./LocationInput";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";

type ProfileEditFormProps = {
  user: Doc<"users">;
  fallbackAvatarUrl?: string;
  onCancel: () => void;
  onSaved: () => void;
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${robotoMono.className} mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/75`}
    >
      {children}
    </label>
  );
}

const inputClassName = `${robotoMono.className} w-full rounded-sm border border-white/35 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none`;

const textareaClassName = `${inputClassName} min-h-[88px] resize-y`;

const primaryButtonClass = `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-accent-events transition-colors hover:bg-white/90 disabled:opacity-40`;

const secondaryButtonClass = `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-events px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events disabled:opacity-40`;

function buildFormState(user: Doc<"users">) {
  return {
    name: trimProfileText(user.name),
    username: trimProfileText(user.username),
    bio: trimProfileText(user.bio),
    location: trimProfileText(user.location),
    skills: skillsToFormText(user.skills),
    vision: trimProfileText(user.vision),
  };
}

export function ProfileEditForm({
  user,
  fallbackAvatarUrl,
  onCancel,
  onSaved,
}: ProfileEditFormProps) {
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState(() => buildFormState(user).name);
  const [username, setUsername] = useState(() => buildFormState(user).username);
  const [bio, setBio] = useState(() => buildFormState(user).bio);
  const [location, setLocation] = useState(() => buildFormState(user).location);
  const [skills, setSkills] = useState(() => buildFormState(user).skills);
  const [vision, setVision] = useState(() => buildFormState(user).vision);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = buildFormState(user);
    setName(next.name);
    setUsername(next.username);
    setBio(next.bio);
    setLocation(next.location);
    setSkills(next.skills);
    setVision(next.vision);
  }, [user]);

  function handleCancel() {
    const next = buildFormState(user);
    setName(next.name);
    setUsername(next.username);
    setBio(next.bio);
    setLocation(next.location);
    setSkills(next.skills);
    setVision(next.vision);
    setError("");
    onCancel();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    const trimmedName = name.trim();
    const trimmedVision = vision.trim();
    const parsedSkills = parseSkillsInput(skills);

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateProfile({
        name: trimmedName,
        username: username.trim(),
        bio: bio.trim(),
        location: location.trim(),
        skills: parsedSkills,
        vision: trimmedVision,
      });
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileAvatarUpload
        avatarUrl={user.avatarUrl}
        fallbackUrl={fallbackAvatarUrl}
        name={name || user.name}
      />

      <div>
        <FieldLabel htmlFor="profile-name">Name</FieldLabel>
        <input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClassName}
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <FieldLabel htmlFor="profile-username">Username</FieldLabel>
        <input
          id="profile-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClassName}
          placeholder="yourname"
          autoComplete="username"
        />
        <p className={`${robotoMono.className} mt-1 text-xs text-white/55`}>
          Lowercase, no spaces. Must be unique.
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={textareaClassName}
          placeholder="A short intro about you"
        />
      </div>

      <div>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <LocationInput
          value={location}
          onChange={setLocation}
          inputClassName={inputClassName}
          suggestionHighlightClassName="bg-white text-accent-events"
          suggestionClassName="text-white/90 hover:bg-white hover:text-accent-events"
        />
      </div>

      <div>
        <FieldLabel htmlFor="profile-skills">Skills</FieldLabel>
        <textarea
          id="profile-skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className={textareaClassName}
          placeholder="Software, Marketing, Design"
        />
        <p className={`${robotoMono.className} mt-1 text-xs text-white/55`}>Separate skills with commas.</p>
      </div>

      <div>
        <FieldLabel htmlFor="profile-vision">Vision</FieldLabel>
        <textarea
          id="profile-vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          className={textareaClassName}
          placeholder="What are you building toward?"
        />
      </div>

      {error ? <p className={`${robotoMono.className} text-sm text-red-300`}>{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Saving…" : "Save profile"}
        </button>
        <button type="button" onClick={handleCancel} disabled={saving} className={secondaryButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}
