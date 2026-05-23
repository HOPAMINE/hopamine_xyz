// shade = baseShade (0-2, pinwheel pattern) × 3 + lightZone (0-2, positional luminosity nudge)
export type TriDatum = { id: string; pts: string; shade: number };

const HEX_R = 130;
export const VW = 600;
export const VH = 300;

function lightZone(px: number, py: number): 0 | 1 | 2 {
  const t = (px / VW + py / VH) / 2;
  if (t < 0.38) return 0;
  if (t < 0.62) return 1;
  return 2;
}

function buildHexMosaic(dx: number, dy: number): TriDatum[] {
  const colSpacing = Math.sqrt(3) * HEX_R;
  const rowSpacing = 1.5 * HEX_R;
  const out: TriDatum[] = [];
  let hi = 0;

  for (let row = -1; row <= 1; row++) {
    for (let col = -2; col <= 2; col++) {
      const cx =
        VW / 2 + dx + col * colSpacing + (Math.abs(row) % 2 === 1 ? colSpacing / 2 : 0);
      const cy = VH / 2 + dy + row * rowSpacing;

      for (let t = 0; t < 6; t++) {
        const a1 = Math.PI / 6 + t * (Math.PI / 3);
        const a2 = Math.PI / 6 + (t + 1) * (Math.PI / 3);
        const v1x = cx + HEX_R * Math.cos(a1);
        const v1y = cy + HEX_R * Math.sin(a1);
        const v2x = cx + HEX_R * Math.cos(a2);
        const v2y = cy + HEX_R * Math.sin(a2);
        const baseShade = (hi % 2 === 0 ? t : t + 1) % 3;
        const zone = lightZone((cx + v1x + v2x) / 3, (cy + v1y + v2y) / 3);
        out.push({
          id: `h${hi}t${t}`,
          pts: [
            `${cx.toFixed(1)},${cy.toFixed(1)}`,
            `${v1x.toFixed(1)},${v1y.toFixed(1)}`,
            `${v2x.toFixed(1)},${v2y.toFixed(1)}`,
          ].join(" "),
          shade: baseShade * 3 + zone,
        });
      }
      hi++;
    }
  }
  return out;
}

export { buildHexMosaic };

export const MOSAIC_ROT_RANGE = [0, 60] as const;
export const MOSAIC_DX_RANGE = [-100, 100] as const;
export const MOSAIC_DY_RANGE = [-80, 80] as const;

// Dynamic .tri-N class names can't be statically analyzed by Tailwind, so SVG-scoped
// inline styles are required. 9 classes = 3 base shades × 3 position zones.
export const TRI_STYLE = `
  .tri{stroke:rgba(255,255,255,0.15);stroke-width:1.2;transition:fill 180ms ease}
  .tri:hover{fill:#a8dcf5}
  .tri-0{fill:#1aabf4}
  .tri-1{fill:#00a6f3}
  .tri-2{fill:#0099e0}
  .tri-3{fill:#0d96d9}
  .tri-4{fill:#0090d4}
  .tri-5{fill:#0084c2}
  .tri-6{fill:#0d81c0}
  .tri-7{fill:#007ab8}
  .tri-8{fill:#006ea6}
`;
