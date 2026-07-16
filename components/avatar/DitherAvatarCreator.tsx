"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  AVATAR_PIXEL_SIZES,
  createDitheredAvatar,
  type AvatarPixelSize,
} from "@/lib/ditherAvatar";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../fonts";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

const primaryBtn = `${robotoMono.className} inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-accent-navbar transition-opacity hover:opacity-90 disabled:opacity-40`;
const secondaryBtn = `${robotoMono.className} inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-navbar disabled:opacity-40`;

export function DitherAvatarCreator() {
  const router = useRouter();
  const { user, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser, clerkLoaded && user ? {} : "skip");
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfilePicture = useMutation(api.users.updateProfilePicture);

  const inputRef = useRef<HTMLInputElement>(null);
  const [pixelSize, setPixelSize] = useState<AvatarPixelSize>(48);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function processFile(file: File, size: AvatarPixelSize) {
    setProcessing(true);
    setError("");
    try {
      const result = await createDitheredAvatar(file, size);
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return result.previewUrl;
      });
      setBlob(result.blob);
    } catch (err: unknown) {
      setBlob(null);
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      setError(err instanceof Error ? err.message : "Could not create avatar.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 8MB.");
      return;
    }

    setSourceFile(file);
    await processFile(file, pixelSize);
  }

  async function handlePixelSizeChange(size: AvatarPixelSize) {
    setPixelSize(size);
    if (sourceFile) await processFile(sourceFile, size);
  }

  async function handleSave() {
    if (!blob) return;
    setSaving(true);
    setError("");
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/png" },
        body: blob,
      });
      if (!response.ok) throw new Error("Upload failed.");

      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
      await updateProfilePicture({ storageId });
      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save avatar.");
      setSaving(false);
    }
  }

  if (!clerkLoaded || (user && convexUser === undefined)) {
    return (
      <main
        className={`relative min-h-dvh w-full bg-accent-navbar pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
      >
        <p className={`${robotoMono.className} text-sm text-white/75`}>Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        className={`relative flex min-h-dvh w-full flex-col items-center justify-center bg-accent-navbar px-5 text-center text-white ${NAV_ALIGN_PAD}`}
      >
        <h1 className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.03em] sm:text-4xl`}>
          Create your pixel avatar
        </h1>
        <p className={`${robotoMono.className} mt-3 max-w-md text-sm text-white/80`}>
          Sign in to upload a photo and turn it into a dithered Hopamine avatar.
        </p>
        <Link href="/sign-in?redirect_url=/avatar" className={`${primaryBtn} mt-8`}>
          Sign in
        </Link>
      </main>
    );
  }

  const currentAvatar = convexUser?.avatarUrl?.trim() || "";

  return (
    <main
      className={`min-h-dvh w-full bg-accent-navbar pt-[112px] pb-16 text-white md:pt-[116px] md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <h1
          className={`${robotoFlex.className} text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl`}
        >
          Create your avatar
        </h1>
        <p className={`${robotoMono.className} mt-3 max-w-md text-sm leading-relaxed text-white/80`}>
          Upload a photo — we&#39;ll pixelate and dither it into a Hopamine blue avatar.
        </p>

        <div className="mt-10 flex size-44 items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-[#0090d4] sm:size-52">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Dithered avatar preview"
              width={208}
              height={208}
              unoptimized
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
          ) : currentAvatar ? (
            <Image
              src={currentAvatar}
              alt="Current avatar"
              width={208}
              height={208}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span className={`${robotoFlex.className} text-5xl font-semibold text-white/90`}>
              {(convexUser?.name ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className={`${robotoMono.className} mr-1 text-[10px] font-semibold uppercase tracking-wide text-white/55`}>
            Pixels
          </span>
          {AVATAR_PIXEL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => void handlePixelSizeChange(size)}
              disabled={processing || saving}
              className={`${robotoMono.className} rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                pixelSize === size
                  ? "bg-white text-accent-navbar"
                  : "border border-white/35 text-white hover:bg-white/10"
              } disabled:opacity-40`}
            >
              {size}
            </button>
          ))}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => void handleFileChange(e)}
          disabled={processing || saving}
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={processing || saving}
            className={secondaryBtn}
          >
            {sourceFile ? "Choose another photo" : "Upload photo"}
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!blob || processing || saving}
            className={primaryBtn}
          >
            {saving ? "Saving…" : processing ? "Processing…" : "Save avatar"}
          </button>
        </div>

        <p className={`${robotoMono.className} mt-4 text-xs text-white/55`}>
          JPG, PNG, WebP, or GIF · max 8MB · saves to your profile
        </p>
        {error ? (
          <p className={`${robotoMono.className} mt-2 text-xs text-red-200`}>{error}</p>
        ) : null}
      </div>
    </main>
  );
}
