"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  DEFAULT_DITHER_OPTIONS,
  drawAfterPreview,
  loadImageFromUrl,
  type DitherOptions,
} from "@/lib/ditherAvatar";

type DitheredAvatarImageProps = {
  src: string;
  alt?: string;
  size: number;
  className?: string;
  options?: DitherOptions;
};

/**
 * Client-side Hopamine dither overlay for any profile photo.
 * Uses a plain <img> fallback (not next/image) so we don't queue the
 * Next image optimizer for every Discover/profile avatar.
 * Falls back to the original image if the URL can't be canvas-read (CORS).
 */
export function DitheredAvatarImage({
  src,
  alt = "",
  size,
  className = "h-full w-full object-cover",
  options = DEFAULT_DITHER_OPTIONS,
}: DitheredAvatarImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const paint = useEffectEvent(
    async (
      url: string,
      pixelSize: number,
      contrast: number,
      ditherStrength: number,
      displaySize: number,
    ) => {
      try {
        const img = await loadImageFromUrl(url);
        const canvas = canvasRef.current;
        if (!canvas) return false;
        drawAfterPreview(
          canvas,
          img,
          { pixelSize, contrast, ditherStrength },
          displaySize,
        );
        return true;
      } catch {
        return false;
      }
    },
  );

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setFailed(false);

    void (async () => {
      const ok = await paint(
        src,
        options.pixelSize,
        options.contrast,
        options.ditherStrength,
        size,
      );
      if (cancelled) return;
      if (ok) setReady(true);
      else setFailed(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [src, size, options.pixelSize, options.contrast, options.ditherStrength]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avoid /_next/image proxy storm for many avatars
      <img src={src} alt={alt} width={size} height={size} className={className} />
    );
  }

  return (
    <>
      {!ready ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} width={size} height={size} className={className} />
      ) : null}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        aria-label={alt || undefined}
        aria-hidden={!alt}
        className={className}
        style={{ display: ready ? "block" : "none" }}
      />
    </>
  );
}
