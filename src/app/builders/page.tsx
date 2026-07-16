"use client";

import { useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  const mosaics = useMemo(() => {
    const map: Record<string, { rot: number; triangles: TriDatum[] }> = {};
    if (builders) {
      for (const builder of builders) {
        map[builder._id] = seededMosaic(builder._id);
      }
    }
    return map;
  }, [builders]);

  const filteredBuilders = useMemo(() => {
    if (!builders) return undefined;
    const query = search.trim().toLowerCase();
    if (!query) return builders;
    return builders.filter((builder) => {
      const name = builder.name.toLowerCase();
      const username = (builder.username ?? "").toLowerCase();
      return name.includes(query) || username.includes(query);
    });
  }, [builders, search]);

  return (
    <main className={`min-h-dvh w-full ${PORTAL_MAIN_PAD} pb-16 md:pb-24`}>
      <div className="mx-auto w-full max-w-7xl">
        <section aria-labelledby="builders-grid-heading" className="w-full">
          <h2 id="builders-grid-heading" className="sr-only">
            Builder directory
          </h2>

          <div className="mb-6">
            <label htmlFor="builders-search" className="sr-only">
              Search people by name or username
            </label>
            <input
              id="builders-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username…"
              autoComplete="off"
              className={`${robotoMono.className} w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-900 shadow-[0_2px_12px_rgba(0,0,0,0.06)] outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-accent-navbar focus:shadow-[0_2px_16px_rgba(0,166,243,0.18)]`}
            />
          </div>

          {filteredBuilders === undefined ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>Loading builders…</p>
          ) : builders?.length === 0 ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>
              No builders yet. Complete onboarding to appear here.
            </p>
          ) : filteredBuilders.length === 0 ? (
            <p className={`${robotoMono.className} text-sm text-neutral-500`}>
              No people match “{search.trim()}”.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>article]:min-w-0">
              {filteredBuilders.map((builder) => {
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
