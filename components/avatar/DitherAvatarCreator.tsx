"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  CONTRAST_DEFAULT,
  CONTRAST_MAX,
  CONTRAST_MIN,
  DEFAULT_DITHER_OPTIONS,
  DITHER_DEFAULT,
  DITHER_MAX,
  DITHER_MIN,
  drawAfterPreview,
  drawBeforePreview,
  exportDitheredAvatar,
  loadImageFromFile,
  PIXEL_SIZE_DEFAULT,
  PIXEL_SIZE_MAX,
  PIXEL_SIZE_MIN,
  type DitherOptions,
} from "@/lib/ditherAvatar";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { robotoFlex, robotoMono } from "../../fonts";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

const primaryBtn = `${robotoMono.className} inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-accent-navbar transition-opacity hover:opacity-90 disabled:opacity-40`;
const secondaryBtn = `${robotoMono.className} inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-navbar disabled:opacity-40`;

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={`${robotoMono.className} text-[10px] font-semibold uppercase tracking-wide text-white/70`}>
          {label}
        </label>
        <span className={`${robotoMono.className} text-[10px] tabular-nums text-white/55`}>{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white disabled:cursor-not-allowed disabled:opacity-40 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}

export function DitherAvatarCreator() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser, clerkLoaded && user ? {} : "skip");
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfilePicture = useMutation(api.users.updateProfilePicture);

  const inputRef = useRef<HTMLInputElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [options, setOptions] = useState<DitherOptions>(DEFAULT_DITHER_OPTIONS);
  const [hasSource, setHasSource] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const renderLive = useEffectEvent((next: DitherOptions) => {
    const img = sourceImageRef.current;
    const before = beforeCanvasRef.current;
    const after = afterCanvasRef.current;
    if (!img || !before || !after) return;
    try {
      drawBeforePreview(before, img);
      drawAfterPreview(after, img, next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not render preview.");
    }
  });

  useEffect(() => {
    if (!hasSource) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      renderLive(options);
      rafRef.current = null;
    });
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [options, hasSource, renderLive]);

  function patchOptions(patch: Partial<DitherOptions>) {
    setSaved(false);
    setOptions((prev) => ({ ...prev, ...patch }));
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

    setLoadingImage(true);
    setError("");
    setSaved(false);
    try {
      const img = await loadImageFromFile(file);
      sourceImageRef.current = img;
      setHasSource(true);
      // Ensure first paint even if options didn't change.
      requestAnimationFrame(() => renderLive(options));
    } catch (err: unknown) {
      sourceImageRef.current = null;
      setHasSource(false);
      setError(err instanceof Error ? err.message : "Could not create avatar.");
    } finally {
      setLoadingImage(false);
    }
  }

  async function handleSave() {
    const img = sourceImageRef.current;
    if (!img) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const blob = await exportDitheredAvatar(img, options);
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/png" },
        body: blob,
      });
      if (!response.ok) throw new Error("Upload failed.");

      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
      await updateProfilePicture({ storageId });
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save avatar.");
    } finally {
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

  return (
    <main
      className={`min-h-dvh w-full bg-accent-navbar pt-[112px] pb-16 text-white md:pt-[116px] md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1
          className={`${robotoFlex.className} text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl`}
        >
          Create your avatar
        </h1>
        <p className={`${robotoMono.className} mt-3 max-w-md text-sm leading-relaxed text-white/80`}>
          Upload a photo, then tune the sliders — before &amp; after update live.
        </p>

        <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <figure className="flex flex-col items-center gap-3">
            <div className="flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-white/40 bg-white/10">
              <canvas
                ref={beforeCanvasRef}
                className={`h-full w-full object-cover ${hasSource ? "" : "hidden"}`}
                aria-label="Original photo"
              />
              {!hasSource ? (
                <span className={`${robotoMono.className} px-4 text-xs text-white/50`}>
                  Upload a photo to preview
                </span>
              ) : null}
            </div>
            <figcaption className={`${robotoMono.className} text-[10px] font-semibold uppercase tracking-wide text-white/60`}>
              Before
            </figcaption>
          </figure>

          <figure className="flex flex-col items-center gap-3">
            <div className="flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-white/90 bg-[#0090d4]">
              <canvas
                ref={afterCanvasRef}
                className={`h-full w-full object-cover [image-rendering:pixelated] ${hasSource ? "" : "hidden"}`}
                aria-label="Dithered avatar"
              />
              {!hasSource ? (
                <span className={`${robotoMono.className} px-4 text-xs text-white/70`}>
                  Live dither appears here
                </span>
              ) : null}
            </div>
            <figcaption className={`${robotoMono.className} text-[10px] font-semibold uppercase tracking-wide text-white/60`}>
              After
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 flex w-full max-w-md flex-col gap-5 text-left">
          <SliderRow
            id="avatar-pixels"
            label="Pixels"
            value={options.pixelSize}
            min={PIXEL_SIZE_MIN}
            max={PIXEL_SIZE_MAX}
            step={1}
            display={`${Math.round(options.pixelSize)}`}
            disabled={!hasSource || loadingImage || saving}
            onChange={(pixelSize) => patchOptions({ pixelSize })}
          />
          <SliderRow
            id="avatar-contrast"
            label="Contrast"
            value={options.contrast}
            min={CONTRAST_MIN}
            max={CONTRAST_MAX}
            step={0.01}
            display={options.contrast.toFixed(2)}
            disabled={!hasSource || loadingImage || saving}
            onChange={(contrast) => patchOptions({ contrast })}
          />
          <SliderRow
            id="avatar-dither"
            label="Dither"
            value={options.ditherStrength}
            min={DITHER_MIN}
            max={DITHER_MAX}
            step={0.01}
            display={options.ditherStrength.toFixed(2)}
            disabled={!hasSource || loadingImage || saving}
            onChange={(ditherStrength) => patchOptions({ ditherStrength })}
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => void handleFileChange(e)}
          disabled={loadingImage || saving}
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loadingImage || saving}
            className={secondaryBtn}
          >
            {loadingImage ? "Loading…" : hasSource ? "Choose another photo" : "Upload photo"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOptions({
                pixelSize: PIXEL_SIZE_DEFAULT,
                contrast: CONTRAST_DEFAULT,
                ditherStrength: DITHER_DEFAULT,
              });
              setSaved(false);
            }}
            disabled={!hasSource || loadingImage || saving}
            className={secondaryBtn}
          >
            Reset sliders
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!hasSource || loadingImage || saving}
            className={primaryBtn}
          >
            {saving ? "Saving…" : "Save avatar"}
          </button>
        </div>

        <p className={`${robotoMono.className} mt-4 text-xs text-white/55`}>
          JPG, PNG, WebP, or GIF · max 8MB · saves to your profile
        </p>
        {saved ? (
          <p className={`${robotoMono.className} mt-2 text-xs text-white`}>
            Avatar saved. Keep tweaking or upload another photo.
          </p>
        ) : null}
        {error ? (
          <p className={`${robotoMono.className} mt-2 text-xs text-red-200`}>{error}</p>
        ) : null}
      </div>
    </main>
  );
}
