"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { robotoMono } from "../../fonts";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

type ProfileAvatarUploadProps = {
  avatarUrl: string;
  fallbackUrl?: string;
  name: string;
};

export function ProfileAvatarUpload({ avatarUrl, fallbackUrl, name }: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfilePicture = useMutation(api.users.updateProfilePicture);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl || avatarUrl || fallbackUrl || "";

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
  const changeButtonClass = `${robotoMono.className} inline-flex items-center rounded-full border border-white/35 bg-accent-events px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events disabled:opacity-40`;

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-white/90 bg-white/10 sm:size-24">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt=""
            width={96}
            height={96}
            unoptimized={displayUrl.startsWith("blob:")}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={`${robotoMono.className} flex h-full w-full items-center justify-center text-2xl text-white sm:text-3xl`}
          >
            {initials}
          </span>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className={`${robotoMono.className} text-xs text-white`}>…</span>
          </div>
        ) : null}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={changeButtonClass}
        >
          {uploading ? "Uploading…" : "Change photo"}
        </button>
        <p className={`${robotoMono.className} mt-1.5 text-xs text-white/55`}>JPG, PNG, WebP, or GIF · max 5MB</p>
        {error ? <p className={`${robotoMono.className} mt-1 text-xs text-red-300`}>{error}</p> : null}
      </div>
    </div>
  );
}
