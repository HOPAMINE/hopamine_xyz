/** Ordered Bayer dither → Hopamine blue pixel art avatar. */

export const PIXEL_SIZE_MIN = 16;
export const PIXEL_SIZE_MAX = 96;
export const PIXEL_SIZE_DEFAULT = 85;

export const CONTRAST_MIN = 0.5;
export const CONTRAST_MAX = 2;
export const CONTRAST_DEFAULT = 1.25;

export const DITHER_MIN = 0;
export const DITHER_MAX = 1;
export const DITHER_DEFAULT = 0.12;

const EXPORT_SIZE = 512;
const PREVIEW_SIZE = 320;

/** 4×4 Bayer matrix normalized to 0–1 thresholds. */
const BAYER_4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
] as const;

/** Brand palette from darkest → lightest. */
const HOPAMINE_PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [0, 61, 92],
  [0, 119, 168],
  [0, 166, 243],
  [92, 200, 247],
  [205, 238, 252],
  [255, 255, 255],
];

export type DitherOptions = {
  pixelSize: number;
  contrast: number;
  ditherStrength: number;
};

export const DEFAULT_DITHER_OPTIONS: DitherOptions = {
  pixelSize: PIXEL_SIZE_DEFAULT,
  contrast: CONTRAST_DEFAULT,
  ditherStrength: DITHER_DEFAULT,
};

function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function applyContrast(lum: number, contrast: number): number {
  return Math.min(1, Math.max(0, (lum - 0.5) * contrast + 0.5));
}

function pickPaletteColor(
  lum: number,
  threshold: number,
  ditherStrength: number,
): readonly [number, number, number] {
  const steps = HOPAMINE_PALETTE.length - 1;
  const nudge = (threshold - 0.5) * ditherStrength;
  const nudged = Math.min(1, Math.max(0, lum + nudge));
  const index = Math.min(steps, Math.max(0, Math.round(nudged * steps)));
  return HOPAMINE_PALETTE[index]!;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
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

/** Load a remote (or blob) image for canvas dithering. */
export function loadImageFromUrl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // CORS only needed for cross-origin http(s); blob: / data: are same-origin.
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load that image."));
    img.src = src;
  });
}

function getSquareCrop(img: HTMLImageElement) {
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  return {
    sx: Math.floor((img.naturalWidth - side) / 2),
    sy: Math.floor((img.naturalHeight - side) / 2),
    side,
  };
}

/** Draw center-cropped original into a canvas (smooth). */
export function drawBeforePreview(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  size = PREVIEW_SIZE,
) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported.");
  const { sx, sy, side } = getSquareCrop(img);
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
}

function sampleSquarePixels(
  img: HTMLImageElement,
  pixelSize: number,
  contrast: number,
): ImageData {
  const size = Math.round(Math.min(PIXEL_SIZE_MAX, Math.max(PIXEL_SIZE_MIN, pixelSize)));
  const { sx, sy, side } = getSquareCrop(img);

  const crop = document.createElement("canvas");
  crop.width = size;
  crop.height = size;
  const ctx = crop.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas not supported.");

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size);

  // Bake contrast into sampled pixels so dither sees adjusted luminance.
  for (let i = 0; i < data.data.length; i += 4) {
    const r = data.data[i]!;
    const g = data.data[i + 1]!;
    const b = data.data[i + 2]!;
    const lum = applyContrast(luminance(r, g, b), contrast);
    const v = Math.round(lum * 255);
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
  }

  return data;
}

function ditherImageData(source: ImageData, ditherStrength: number): ImageData {
  const { width, height, data } = source;
  const out = new ImageData(width, height);
  const strength = Math.min(DITHER_MAX, Math.max(DITHER_MIN, ditherStrength));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;

      const threshold = BAYER_4[y % 4]![x % 4]!;
      const [pr, pg, pb] = pickPaletteColor(luminance(r, g, b), threshold, strength);

      out.data[i] = pr;
      out.data[i + 1] = pg;
      out.data[i + 2] = pb;
      out.data[i + 3] = a < 128 ? 0 : 255;
    }
  }

  return out;
}

function paintUpscaled(
  canvas: HTMLCanvasElement,
  pixels: ImageData,
  targetSize: number,
) {
  const low = document.createElement("canvas");
  low.width = pixels.width;
  low.height = pixels.height;
  const lowCtx = low.getContext("2d");
  if (!lowCtx) throw new Error("Canvas not supported.");
  lowCtx.putImageData(pixels, 0, 0);

  canvas.width = targetSize;
  canvas.height = targetSize;
  const highCtx = canvas.getContext("2d");
  if (!highCtx) throw new Error("Canvas not supported.");
  highCtx.imageSmoothingEnabled = false;
  highCtx.clearRect(0, 0, targetSize, targetSize);
  highCtx.drawImage(low, 0, 0, targetSize, targetSize);
}

/** Live dither render into the after-preview canvas. */
export function drawAfterPreview(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  options: DitherOptions,
  size = PREVIEW_SIZE,
) {
  const sampled = sampleSquarePixels(img, options.pixelSize, options.contrast);
  const dithered = ditherImageData(sampled, options.ditherStrength);
  paintUpscaled(canvas, dithered, size);
}

/** Export high-res PNG blob for Convex upload. */
export async function exportDitheredAvatar(
  img: HTMLImageElement,
  options: DitherOptions,
): Promise<Blob> {
  const sampled = sampleSquarePixels(img, options.pixelSize, options.contrast);
  const dithered = ditherImageData(sampled, options.ditherStrength);
  const canvas = document.createElement("canvas");
  paintUpscaled(canvas, dithered, EXPORT_SIZE);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Failed to export avatar."));
      },
      "image/png",
    );
  });
}
