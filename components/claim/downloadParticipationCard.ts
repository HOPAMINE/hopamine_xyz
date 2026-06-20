import { toPng } from "html-to-image";
import {
  PARTICIPATION_CARD_BORDER_RADIUS,
  PARTICIPATION_CARD_GREEN,
  PARTICIPATION_CARD_TOTAL_HEIGHT,
  PARTICIPATION_CARD_WIDTH,
} from "./participationCardStyles";

const EXPORT_PIXEL_RATIO = 3;

function clipRoundedCorners(
  dataUrl: string,
  width: number,
  height: number,
  radius: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas not supported"));
        return;
      }

      context.beginPath();
      context.roundRect(0, 0, width, height, radius);
      context.clip();
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error("Failed to prepare card image"));
    image.src = dataUrl;
  });
}

export async function downloadParticipationCard(element: HTMLElement, fileName: string) {
  const width = PARTICIPATION_CARD_WIDTH;
  const height = Math.max(
    Math.ceil(element.getBoundingClientRect().height),
    PARTICIPATION_CARD_TOTAL_HEIGHT,
  );
  const scaledWidth = width * EXPORT_PIXEL_RATIO;
  const scaledHeight = height * EXPORT_PIXEL_RATIO;
  const scaledRadius = PARTICIPATION_CARD_BORDER_RADIUS * EXPORT_PIXEL_RATIO;

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: EXPORT_PIXEL_RATIO,
    backgroundColor: PARTICIPATION_CARD_GREEN,
    width,
    height,
    style: {
      margin: "0",
      overflow: "hidden",
      borderRadius: `${PARTICIPATION_CARD_BORDER_RADIUS}px`,
      width: `${width}px`,
      maxWidth: `${width}px`,
      boxSizing: "border-box",
    },
  });

  const clippedDataUrl = await clipRoundedCorners(
    dataUrl,
    scaledWidth,
    scaledHeight,
    scaledRadius,
  );

  const link = document.createElement("a");
  link.download = fileName;
  link.href = clippedDataUrl;
  link.click();
}
