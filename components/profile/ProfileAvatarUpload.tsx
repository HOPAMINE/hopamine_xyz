"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DitheredAvatarImage } from "../avatar/DitheredAvatarImage";
import { robotoMono } from "../../fonts";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

type ProfileAvatarUploadProps = {
  avatarUrl: string;
  fallbackUrl?: string;
  name: string;
  /** Visual size of the avatar circle in px. */
  size?: number;
  /** Light = white profile card; dark = events / edit form. */
  variant?: "light" | "dark";
  /**
   * `button` — full Change/Upload control beside the avatar.
   * `link` — compact text control under the avatar (profile card).
   * `none` — avatar itself is the only upload trigger.
   */
  controls?: "button" | "link" | "none";
};

export function ProfileAvatarUpload({
  avatarUrl,
  fallbackUrl,
  name,
  size = 96,
  variant = "dark",
  controls = "button",
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfilePicture = useMutation(api.users.updateProfilePicture);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl || avatarUrl || fallbackUrl || "";
  const isLight = variant === "light";

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
      await updateProfilePicture({ storageId });
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
    } catch (err: unknown) {
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      setError(err instanceof Error ? err.message : "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  }

  const initials = name.trim().charAt(0).toUpperCase() || "?";
  const changeButtonClass = isLight
    ? `${robotoMono.className} inline-flex items-center rounded-full border border-accent-navbar/25 bg-accent-navbar px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-navbar disabled:opacity-40`
    : `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-events px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events disabled:opacity-40`;

  const hintClass = isLight
    ? `${robotoMono.className} mt-1.5 text-xs text-neutral-500`
    : `${robotoMono.className} mt-1.5 text-xs text-white/55`;

  const errorClass = isLight
    ? `${robotoMono.className} mt-1 text-xs text-red-600`
    : `${robotoMono.className} mt-1 text-xs text-red-300`;

  const borderClass = isLight ? "border-2 border-white" : "border-2 border-white/90";

  function openPicker() {
    if (!uploading) inputRef.current?.click();
  }

  return (
    <div
      className={
        controls === "button"
          ? "flex items-center gap-4"
          : "inline-flex flex-col items-start gap-1"
      }
    >
      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label={displayUrl ? "Change profile photo" : "Upload profile photo"}
        className={`relative shrink-0 overflow-hidden rounded-full bg-[#0090d4] ${borderClass} transition-opacity hover:opacity-90 disabled:opacity-60`}
        style={{ width: size, height: size }}
      >
        {displayUrl ? (
          <DitheredAvatarImage
            src={displayUrl}
            size={size}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={`${robotoMono.className} flex h-full w-full items-center justify-center text-2xl text-white`}
            style={{ fontSize: Math.max(16, Math.round(size * 0.35)) }}
          >
            {initials}
          </span>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className={`${robotoMono.className} text-xs text-white`}>…</span>
          </div>
        ) : null}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {controls === "button" ? (
        <div>
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className={changeButtonClass}
          >
            {uploading
              ? "Uploading…"
              : displayUrl
                ? "Change photo"
                : "Upload photo"}
          </button>
          <p className={hintClass}>JPG, PNG, WebP, or GIF · max 5MB</p>
          {error ? <p className={errorClass}>{error}</p> : null}
        </div>
      ) : null}

      {controls === "link" ? (
        <div>
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className={
              isLight
                ? `${robotoMono.className} text-[10px] font-semibold uppercase tracking-wide text-accent-navbar transition-colors hover:underline disabled:opacity-40`
                : `${robotoMono.className} text-[10px] font-semibold uppercase tracking-wide text-white/80 transition-colors hover:underline disabled:opacity-40`
            }
          >
            {uploading
              ? "Uploading…"
              : displayUrl
                ? "Change photo"
                : "Upload photo"}
          </button>
          {error ? <p className={errorClass}>{error}</p> : null}
        </div>
      ) : null}

      {controls === "none" && error ? <p className={errorClass}>{error}</p> : null}
    </div>
  );
}
