"use client";

import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { BuilderCard } from "./BuilderCard";
import {
  buildHexMosaic,
  TriDatum,
  MOSAIC_ROT_RANGE,
  MOSAIC_DX_RANGE,
  MOSAIC_DY_RANGE,
} from "./hexMosaic";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomMosaic() {
  return {
    rot: rand(...MOSAIC_ROT_RANGE),
    triangles: buildHexMosaic(rand(...MOSAIC_DX_RANGE), rand(...MOSAIC_DY_RANGE)),
  };
}

export default function BuildersPage() {
  const builders = useQuery(api.users.listBuilders);
  // Compute mosaics once per builder ID — never regenerate on re-render
  const mosaicsRef = useRef<Record<string, { rot: number; triangles: TriDatum[] }>>({});
  if (builders) {
    for (const b of builders) {
      if (!mosaicsRef.current[b._id]) {
        mosaicsRef.current[b._id] = randomMosaic();
      }
    }
  }

  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-28 pb-16 md:pt-32 md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <section aria-labelledby="builders-grid-heading" className="w-full">
        <h2 id="builders-grid-heading" className="sr-only">
          Builder tiles
        </h2>
        {builders === undefined ? (
          <p className="font-mono text-sm text-neutral-400">Loading builders…</p>
        ) : builders.length === 0 ? (
          <p className="font-mono text-sm text-neutral-400">No builders yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-3 lg:gap-3 xl:gap-4 [&>article]:min-w-0">
            {builders.map((builder) => {
              const { rot, triangles } = mosaicsRef.current[builder._id];
              return (
                <BuilderCard
                  key={builder._id}
                  name={builder.name}
                  skills={(builder.skills ?? []).slice(0, 3)}
                  projects={[]}
                  discordUsername={builder.socialLinks?.discord}
                  lastSeenAt={builder.lastSeenAt}
                  rot={rot}
                  triangles={triangles}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
