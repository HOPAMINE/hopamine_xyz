"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { robotoMono } from "../../fonts";

type Collaborator = {
  _id: Id<"users">;
  name: string;
  username?: string;
  avatarUrl: string;
};

type ProjectMemberPickerProps = {
  selectedIds: Id<"users">[];
  onChange: (ids: Id<"users">[]) => void;
};

const inputClassName = `${robotoMono.className} w-full rounded-sm border border-white/35 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none`;

const chipClassName = `${robotoMono.className} inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-xs text-white`;

export function ProjectMemberPicker({ selectedIds, onChange }: ProjectMemberPickerProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useQuery(api.projects.searchCollaborators, { query: debouncedQuery });
  const selectedUsers = useQuery(api.projects.getUsersByIds, { userIds: selectedIds });

  function addUser(user: Collaborator) {
    if (selectedIds.includes(user._id)) return;
    onChange([...selectedIds, user._id]);
    setQuery("");
  }

  function removeUser(userId: Id<"users">) {
    onChange(selectedIds.filter((id) => id !== userId));
  }

  const visibleResults =
    results?.filter((user) => !selectedIds.includes(user._id)) ?? [];

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={inputClassName}
        placeholder="Search builders by name or username"
        autoComplete="off"
      />

      {debouncedQuery.trim().length >= 2 && results === undefined ? (
        <p className={`${robotoMono.className} text-xs text-white/60`}>Searching…</p>
      ) : null}

      {debouncedQuery.trim().length >= 2 && results && visibleResults.length > 0 ? (
        <ul className="space-y-1 rounded-sm border border-white/20 bg-black/20 p-1">
          {visibleResults.map((user) => (
            <li key={user._id}>
              <button
                type="button"
                onClick={() => addUser(user)}
                className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-white/10"
              >
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className={`${robotoMono.className} min-w-0 text-sm text-white`}>
                  <span className="block truncate">{user.name}</span>
                  {user.username ? (
                    <span className="block truncate text-xs text-white/60">@{user.username}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {debouncedQuery.trim().length >= 2 && results && visibleResults.length === 0 ? (
        <p className={`${robotoMono.className} text-xs text-white/60`}>No builders found.</p>
      ) : null}

      {selectedUsers && selectedUsers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <span key={user._id} className={chipClassName}>
              {user.name}
              <button
                type="button"
                onClick={() => removeUser(user._id)}
                className="text-white/70 transition-colors hover:text-white"
                aria-label={`Remove ${user.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className={`${robotoMono.className} text-xs text-white/60`}>
          Invited builders must accept before they appear on the project.
        </p>
      )}
    </div>
  );
}
