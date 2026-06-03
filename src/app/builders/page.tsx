import { NAV_ALIGN_PAD } from "@/lib/layoutConstants";
import { BuilderCard } from "./BuilderCard";
import {
  buildHexMosaic,
  MOSAIC_ROT_RANGE,
  MOSAIC_DX_RANGE,
  MOSAIC_DY_RANGE,
} from "./hexMosaic";

export const dynamic = "force-dynamic";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type BuilderTile = {
  name: string;
  projects: string[];
  skills: [string, string, string];
  discordUsername?: string;
};

function randomMosaic() {
  return {
    rot: rand(...MOSAIC_ROT_RANGE),
    triangles: buildHexMosaic(rand(...MOSAIC_DX_RANGE), rand(...MOSAIC_DY_RANGE)),
  };
}

const BUILDER_TILES: BuilderTile[] = [
  {
    name: "Jordan Mills",
    projects: ["Builder starter kit", "API platform"],
    skills: ["TypeScript", "Distributed systems", "Developer tooling"],
  },
  {
    name: "Sam Rivera",
    projects: ["Community calendar"],
    skills: ["Figma", "Design systems", "User research"],
  },
  {
    name: "Taylor Brooks",
    projects: ["Research archive", "Policy briefs"],
    skills: ["Data analysis", "Writing", "Synthesis"],
  },
  {
    name: "Morgan Lee",
    projects: ["Residency program"],
    skills: ["Operations", "Partnerships", "Strategy"],
  },
];

export default function BuildersPage() {
  return (
    <main
      className={`min-h-dvh w-full bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)] pt-28 pb-16 md:pt-32 md:pb-24 ${NAV_ALIGN_PAD}`}
    >
      <section aria-labelledby="builders-grid-heading" className="w-full">
        <h2 id="builders-grid-heading" className="sr-only">
          Builder tiles
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-3 lg:gap-3 xl:gap-4 [&>article]:min-w-0">
          {BUILDER_TILES.map((builder) => {
            const { rot, triangles } = randomMosaic();
            return <BuilderCard key={builder.name} {...builder} rot={rot} triangles={triangles} discordUsername={builder.discordUsername} />;
          })}
        </div>
      </section>
    </main>
  );
}
