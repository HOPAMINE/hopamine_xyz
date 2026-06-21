"use client";

import { useState } from "react";
import { roboto } from "../../fonts";
import type { LabelSize } from "./questionLabels";

const labelHeights: Record<LabelSize, string> = {
  default: "h-6",
  wide: "h-[30px]",
  multiline: "h-12",
};

const fallbackText: Record<LabelSize, string> = {
  default: "text-base sm:text-lg",
  wide: "text-base sm:text-lg",
  multiline: "text-sm leading-snug sm:text-base",
};

export function QuestionLabel({
  src,
  alt,
  size = "default",
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  size?: LabelSize;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const heightClass = labelHeights[size];

  return (
    <div className="relative mb-4" style={{ minHeight: height }}>
      {!loaded ? (
        <p
          className={`${roboto.className} ${heightClass} ${fallbackText[size]} flex items-center font-semibold uppercase tracking-[-0.03em] text-[#f5f0e8]/90`}
          aria-hidden
        >
          {alt}
        </p>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`w-auto max-w-full ${heightClass} transition-opacity duration-150 ${
          loaded ? "opacity-100" : "absolute inset-0 opacity-0"
        }`}
      />
    </div>
  );
}
