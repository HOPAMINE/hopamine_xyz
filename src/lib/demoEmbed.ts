export type DemoEmbedResult =
  | { type: "video"; embedUrl: string; provider: string }
  | { type: "external"; url: string };

export function getDemoEmbed(url: string): DemoEmbedResult | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      let videoId: string | null = null;
      if (parsed.pathname.startsWith("/watch")) {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2] ?? null;
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2] ?? null;
      }
      if (videoId) {
        return {
          type: "video",
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
          provider: "YouTube",
        };
      }
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.slice(1).split("/")[0];
      if (videoId) {
        return {
          type: "video",
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
          provider: "YouTube",
        };
      }
    }

    if (host === "loom.com") {
      const match = parsed.pathname.match(/\/share\/([a-f0-9]+)/i);
      if (match?.[1]) {
        return {
          type: "video",
          embedUrl: `https://www.loom.com/embed/${match[1]}?autoplay=1`,
          provider: "Loom",
        };
      }
    }

    if (host === "drive.google.com") {
      const match = parsed.pathname.match(/\/file\/d\/([^/]+)/);
      if (match?.[1]) {
        return {
          type: "video",
          embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`,
          provider: "Google Drive",
        };
      }
    }

    if (host.endsWith("zoom.us") && parsed.pathname.includes("/clips/share/")) {
      const clipId = parsed.pathname.split("/clips/share/")[1]?.split("/")[0];
      if (clipId) {
        return {
          type: "video",
          embedUrl: `https://${parsed.hostname}/clips/embed/${clipId}`,
          provider: "Zoom",
        };
      }
    }

    return { type: "external", url };
  } catch {
    return null;
  }
}
