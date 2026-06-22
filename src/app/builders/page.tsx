"use client";

import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PORTAL_MAIN_PAD } from "@/lib/layoutConstants";
import { robotoMono } from "../../../fonts";
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
  const mosaicsRef = useRef<Record<string, { rot: number; triangles: TriDatum[] }>>({});
  if (builders) {
    for (const builder of builders) {
      if (!mosaicsRef.current[builder._id]) {
        mosaicsRef.current[builder._id] = randomMosaic();
      }
    }
  }

  return (
    <main className={`min-h-dvh w-full ${PORTAL_MAIN_PAD} pb-16 md:pb-24`}>
      <div className="mx-auto w-full max-w-7xl">
        <section aria-labelledby="builders-grid-heading" className="w-full">
          <h2 id="builders-grid-heading" className="sr-only">
            Builder directory
          </h2>
          {builders === undefined ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>Loading builders…</p>
          ) : builders.length === 0 ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>
              No builders yet. Complete onboarding to appear here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>article]:min-w-0">
              {builders.map((builder) => {
                const { rot, triangles } = mosaicsRef.current[builder._id];
                return (
                  <BuilderCard
                    key={builder._id}
                    name={builder.name}
                    username={builder.username}
                    avatarUrl={builder.avatarUrl}
                    bio={builder.bio}
                    skills={builder.skills ?? []}
                    interests={builder.interests ?? []}
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
      </div>
    </main>
  );
}
