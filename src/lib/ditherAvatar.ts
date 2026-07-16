/** Ordered Bayer dither → Hopamine blue pixel art avatar. */

export const AVATAR_PIXEL_SIZES = [32, 48, 64] as const;
export type AvatarPixelSize = (typeof AVATAR_PIXEL_SIZES)[number];

const EXPORT_SIZE = 512;

/** 4×4 Bayer matrix normalized to 0–1 thresholds. */
const BAYER_4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
] as const;

/** Brand palette from darkest → lightest. */
const HOPAMINE_PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [0, 61, 92], // deep navy
  [0, 119, 168],
  [0, 166, 243], // accent
  [92, 200, 247],
  [205, 238, 252],
  [255, 255, 255],
];

function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function pickPaletteColor(
  lum: number,
  threshold: number,
): readonly [number, number, number] {
  // Spread luminance across palette levels, nudge by Bayer threshold.
  const steps = HOPAMINE_PALETTE.length - 1;
  const nudged = Math.min(1, Math.max(0, lum + (threshold - 0.5) * 0.35));
  const index = Math.min(steps, Math.max(0, Math.round(nudged * steps)));
  return HOPAMINE_PALETTE[index]!;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

/** Center-crop source to square, then sample into a pixelSize×pixelSize grid. */
function sampleSquarePixels(
  img: HTMLImageElement,
  pixelSize: number,
): ImageData {
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = Math.floor((img.naturalWidth - side) / 2);
  const sy = Math.floor((img.naturalHeight - side) / 2);

  const crop = document.createElement("canvas");
  crop.width = pixelSize;
  crop.height = pixelSize;
  const ctx = crop.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas not supported.");

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, pixelSize, pixelSize);
  return ctx.getImageData(0, 0, pixelSize, pixelSize);
}

function ditherImageData(source: ImageData): ImageData {
  const { width, height, data } = source;
  const out = new ImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;

      const threshold = BAYER_4[y % 4]![x % 4]!;
      const [pr, pg, pb] = pickPaletteColor(luminance(r, g, b), threshold);

      out.data[i] = pr;
      out.data[i + 1] = pg;
      out.data[i + 2] = pb;
      out.data[i + 3] = a < 128 ? 0 : 255;
    }
  }

  return out;
}

/** Upscale dithered pixel grid for crisp display/export. */
function upscalePixels(pixels: ImageData, targetSize: number): HTMLCanvasElement {
  const low = document.createElement("canvas");
  low.width = pixels.width;
  low.height = pixels.height;
  const lowCtx = low.getContext("2d");
  if (!lowCtx) throw new Error("Canvas not supported.");
  lowCtx.putImageData(pixels, 0, 0);

  const high = document.createElement("canvas");
  high.width = targetSize;
  high.height = targetSize;
  const highCtx = high.getContext("2d");
  if (!highCtx) throw new Error("Canvas not supported.");
  highCtx.imageSmoothingEnabled = false;
  highCtx.drawImage(low, 0, 0, targetSize, targetSize);
  return high;
}

export type DitheredAvatarResult = {
  /** Object URL for preview (caller must revoke). */
  previewUrl: string;
  /** PNG blob ready for Convex upload. */
  blob: Blob;
  pixelSize: AvatarPixelSize;
};

export async function createDitheredAvatar(
  file: File,
  pixelSize: AvatarPixelSize,
): Promise<DitheredAvatarResult> {
  const img = await loadImageFromFile(file);
  const sampled = sampleSquarePixels(img, pixelSize);
  const dithered = ditherImageData(sampled);
  const canvas = upscalePixels(dithered, EXPORT_SIZE);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Failed to export avatar."));
      },
      "image/png",
    );
  });

  return {
    previewUrl: URL.createObjectURL(blob),
    blob,
    pixelSize,
  };
}
