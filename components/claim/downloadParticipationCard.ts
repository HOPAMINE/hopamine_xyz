import { toPng } from "html-to-image";

export async function downloadParticipationCard(element: HTMLElement, fileName: string) {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 3,
    backgroundColor: "#126609",
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
