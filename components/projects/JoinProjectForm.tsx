"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { robotoMono } from "../../fonts";

type JoinProjectFormProps = {
  onCancel: () => void;
  onJoined: () => void;
  variant?: "dark" | "light";
};

export function JoinProjectForm({
  onCancel,
  onJoined,
  variant = "dark",
}: JoinProjectFormProps) {
  const joinWithCode = useMutation(api.projects.joinWithCode);
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClassName =
    variant === "light"
      ? `${robotoMono.className} w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm uppercase tracking-widest text-neutral-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-neutral-400 focus:border-[#00a6f3] focus:outline-none`
      : `${robotoMono.className} w-full rounded-sm border border-white/35 bg-white/10 px-3 py-2 text-sm uppercase tracking-widest text-white placeholder:normal-case placeholder:tracking-normal placeholder:text-white/40 focus:border-white focus:outline-none`;

  const primaryButtonClass =
    variant === "light"
      ? `${robotoMono.className} inline-flex items-center rounded-full border border-[#00a6f3] bg-[#00a6f3] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#0096dc] disabled:opacity-40`
      : `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-accent-events transition-colors hover:bg-white/90 disabled:opacity-40`;

  const secondaryButtonClass =
    variant === "light"
      ? `${robotoMono.className} inline-flex items-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:opacity-40`
      : `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-events px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events disabled:opacity-40`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Enter a project code.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await joinWithCode({ code: trimmedCode });
      setSuccess(`Joined ${result.projectTitle}.`);
      setCode("");
      onJoined();
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "Could not join project");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="join-project-code"
          className={`${robotoMono.className} mb-1.5 block text-xs font-semibold uppercase tracking-wide ${
            variant === "light" ? "text-neutral-500" : "text-white/75"
          }`}
        >
          Project code
        </label>
        <input
          id="join-project-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className={inputClassName}
          placeholder="e.g. ABC123"
          autoComplete="off"
          spellCheck={false}
        />
        <p
          className={`${robotoMono.className} mt-2 text-[11px] ${
            variant === "light" ? "text-neutral-500" : "text-white/60"
          }`}
        >
          Ask a project owner for their join code.
        </p>
      </div>

      {error ? (
        <p className={`${robotoMono.className} text-sm text-red-500`}>{error}</p>
      ) : null}
      {success ? (
        <p className={`${robotoMono.className} text-sm text-emerald-600`}>{success}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Joining…" : "Join project"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className={secondaryButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}
