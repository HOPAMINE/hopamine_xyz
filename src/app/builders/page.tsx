"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useConvex, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
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

// Deterministic per-builder mosaic: seed a small PRNG from the user id so each
// card gets a stable, unique pattern (consistent across renders and reloads)
// without mutating a ref during render.
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededMosaic(seedStr: string) {
  const rng = makeRng(hashSeed(seedStr));
  const pick = (min: number, max: number) => rng() * (max - min) + min;
  return {
    rot: pick(...MOSAIC_ROT_RANGE),
    triangles: buildHexMosaic(pick(...MOSAIC_DX_RANGE), pick(...MOSAIC_DY_RANGE)),
  };
}

export default function BuildersPage() {
  const builders = useQuery(api.users.listBuilders);
  const convex = useConvex();
  const [presenceMap, setPresenceMap] = useState<
    Map<Id<"users">, { isOnline: boolean; updatedAt: number }>
  >(new Map());
  const presenceFetchedRef = useRef(false);

  const mosaics = useMemo(() => {
    const map: Record<string, { rot: number; triangles: TriDatum[] }> = {};
    if (builders) {
      for (const builder of builders) {
        map[builder._id] = seededMosaic(builder._id);
      }
    }
    return map;
  }, [builders]);

  useEffect(() => {
    if (!builders || presenceFetchedRef.current) return;
    presenceFetchedRef.current = true;
    const userIds = builders.map((b) => b._id);
    convex.query(api.presence.getForUsers, { userIds }).then((presenceList) => {
      const map = new Map<Id<"users">, { isOnline: boolean; updatedAt: number }>();
      for (const p of presenceList) {
        map.set(p.userId, { isOnline: p.isOnline, updatedAt: p.updatedAt });
      }
      setPresenceMap(map);
    });
  }, [builders, convex]);

  // Online users first, then most recently active. Users with no presence
  // record (e.g. created after this fetch) fall to the bottom (updatedAt 0).
  const sortedBuilders = builders
    ? [...builders].sort((a, b) => {
        const ap = presenceMap.get(a._id);
        const bp = presenceMap.get(b._id);
        const aOnline = ap?.isOnline ?? false;
        const bOnline = bp?.isOnline ?? false;
        if (aOnline !== bOnline) return aOnline ? -1 : 1;
        return (bp?.updatedAt ?? 0) - (ap?.updatedAt ?? 0);
      })
    : undefined;

  return (
    <main className={`min-h-dvh w-full ${PORTAL_MAIN_PAD} pb-16 md:pb-24`}>
      <div className="mx-auto w-full max-w-7xl">
        <section aria-labelledby="builders-grid-heading" className="w-full">
          <h2 id="builders-grid-heading" className="sr-only">
            Builder directory
          </h2>
          {sortedBuilders === undefined ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>Loading builders…</p>
          ) : sortedBuilders.length === 0 ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>
              No builders yet. Complete onboarding to appear here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>article]:min-w-0">
              {sortedBuilders.map((builder) => {
                const { rot, triangles } = mosaics[builder._id];
                return (
                  <BuilderCard
                    key={builder._id}
                    userId={builder._id}
                    name={builder.name}
                    username={builder.username}
                    avatarUrl={builder.avatarUrl}
                    bio={builder.bio}
                    skills={builder.skills ?? []}
                    interests={builder.interests ?? []}
                    isOnline={presenceMap.get(builder._id)?.isOnline ?? false}
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
