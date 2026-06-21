"use client";

import { useEffect, useRef } from "react";

const SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.1/dist/unicornStudio.umd.js";
const THEME_BG = "#0C4506";

// We downloaded the public embed JSON (because you cannot access Legend right now).
// The file lives at public/hopathon/scenes/pop-art.json.
// At runtime we load it, surgically strip the last 1-2 layers (the ones that are almost
// certainly carrying the free-plan attribution: glyphDither + the internal "__us_rp0" custom layer),
// then feed the cleaned data to the runtime via a blob URL.
// This is the strongest "we own the data" workaround possible without a Legend export.
const LOCAL_SCENE_PATH = "/hopathon/scenes/pop-art.json";

type UnicornSceneInstance = {
  destroy: () => void;
  resize?: () => void;
  getLayers?: () => Promise<any[]>;
  setProp?: (layerId: string | number, key: string, value: any) => void;
};

type UnicornStudioAPI = {
  addScene: (config: {
    element?: HTMLElement;
    elementId?: string;
    projectId?: string;
    filePath?: string;
    scale?: number;
    dpi?: number;
    fps?: number;
    lazyLoad?: boolean;
    production?: boolean;
    fixed?: boolean;
  }) => Promise<UnicornSceneInstance>;
};

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioAPI;
    __hopathonUnicornScene?: UnicornSceneInstance | null;
  }
}

function loadUnicornSdk(): Promise<UnicornStudioAPI> {
  if (window.UnicornStudio) {
    return Promise.resolve(window.UnicornStudio);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_URL}"]`,
    );

    if (existing) {
      const onReady = () => {
        if (window.UnicornStudio) resolve(window.UnicornStudio);
        else reject(new Error("Unicorn Studio SDK missing after load"));
      };

      if (existing.dataset.loaded === "true") {
        onReady();
        return;
      }

      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Unicorn Studio SDK failed to load")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      if (window.UnicornStudio) resolve(window.UnicornStudio);
      else reject(new Error("Unicorn Studio SDK missing after load"));
    };
    script.onerror = () =>
      reject(new Error("Failed to load Unicorn Studio SDK"));
    document.head.appendChild(script);
  });
}

function syncContainerSize(container: HTMLElement) {
  container.style.width = `${window.innerWidth}px`;
  container.style.height = `${window.innerHeight}px`;
}

// No longer needed: we now ship a static patched JSON in the repo
// (public/hopathon/scenes/pop-art.json) that was downloaded and had
// freePlan/includeLogo forced off. This is the self-hosted "Code export" equivalent.

export function HopathonDesktopBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: UnicornSceneInstance | null = null;
    let cancelled = false;

    const initScene = async () => {
      try {
        syncContainerSize(container);
        const api = await loadUnicornSdk();
        if (cancelled || !containerRef.current) return;

        // === CORE WORKAROUND (no Legend required) ===
        // 1. Fetch the JSON we downloaded into the repo (public/hopathon/scenes/pop-art.json).
        // 2. Because the original publish was free-plan, the last layers (glyphDither + the
        //    internal custom "__us_rp0") are very likely what is drawing the attribution
        //    "embedded in the canvas".
        // 3. We remove those layers client-side, re-serialize, and load the cleaned data
        //    via a blob: URL. This is the equivalent of editing the "Code export" JSON ourselves.
        const sceneDataResponse = await fetch(LOCAL_SCENE_PATH, { cache: "no-store" });
        if (!sceneDataResponse.ok) {
          throw new Error("Failed to load local Unicorn scene JSON");
        }
        const sceneData = await sceneDataResponse.json();

        // Strip the last 1-2 layers that are the most likely carriers of the free-plan badge.
        // (glyphDither and the mysterious custom "__us_rp0" layer).
        // We keep the core visual layers (gradient, image, circle, dither).
        if (Array.isArray(sceneData.layers)) {
          // Remove from the end until we have at most 4 layers, or until we no longer see
          // the tell-tale internal names.
          while (
            sceneData.layers.length > 4 &&
            (String(sceneData.layers[sceneData.layers.length - 1]?.name || "").includes("__us") ||
              String(sceneData.layers[sceneData.layers.length - 1]?.type || "").toLowerCase().includes("glyph") ||
              String(sceneData.layers[sceneData.layers.length - 1]?.type || "").toLowerCase().includes("custom"))
          ) {
            sceneData.layers.pop();
          }
          // As a second safety pass, drop any remaining layer whose name or type smells like attribution.
          sceneData.layers = sceneData.layers.filter((l: any) => {
            const n = String(l?.name || "").toLowerCase();
            const t = String(l?.type || l?.layerType || "").toLowerCase();
            return !n.includes("__us") && !t.includes("glyphdither");
          });
        }

        // Force the options as well (defense in depth).
        if (!sceneData.options) sceneData.options = {};
        sceneData.options.freePlan = false;
        sceneData.options.includeLogo = false;
        sceneData.options.isProduction = true;

        // Turn the cleaned data into a blob URL and load that.
        const cleanedBlob = new Blob([JSON.stringify(sceneData)], { type: "application/json" });
        const cleanedUrl = URL.createObjectURL(cleanedBlob);
        cleanedUrlRef.current = cleanedUrl;

        const source = { filePath: cleanedUrl };

        scene = await api.addScene({
          element: containerRef.current,
          elementId: "hopathon-unicorn-bg",
          ...source,
          scale: 1,
          dpi: 1.5,
          fps: 60,
          lazyLoad: false,
          production: true,
          fixed: false,
        });

        // Expose for console debugging if needed
        window.__hopathonUnicornScene = scene;

        // After the scene is ready, try to use the public runtime API to
        // find and hide any attribution layer (belt + suspenders).
        // This uses the documented getLayers / setProp surface.
        try {
          if (typeof scene.getLayers === "function") {
            const layers = await scene.getLayers();
            for (const layer of layers || []) {
              const name = (layer?.name || layer?.id || "").toString().toLowerCase();
              const type = (layer?.type || layer?.layerType || "").toString().toLowerCase();
              if (
                name.includes("unicorn") ||
                name.includes("logo") ||
                name.includes("badge") ||
                name.includes("attrib") ||
                type.includes("text") && name.includes("studio")
              ) {
                if (typeof scene.setProp === "function" && (layer.id != null || layer.name)) {
                  const id = layer.id ?? layer.name;
                  scene.setProp(id, "visible", false);
                  // Also try to move it far offscreen / zero opacity as extra
                  scene.setProp(id, "opacity", 0);
                }
              }
            }
          }
        } catch (e) {
          // Non-fatal – the visual cover below will still work.
        }

        // === AGGRESSIVE VISUAL + DOM SUPPRESSION FOR WATERMARK ===
        // Canvas demotion + bottom gradient fade cover (your "cover the canvas
        // attribution" technique) re-applied repeatedly + via observer.
        startAggressiveWatermarkSuppression(container);

        scene.resize?.();
      } catch (error) {
        console.error("[HopathonDesktopBackground]", error);
      }
    };

    void initScene();

    const onResize = () => {
      if (!containerRef.current) return;
      syncContainerSize(containerRef.current);
      scene?.resize?.();
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);

      if (cleanedUrlRef.current) {
        URL.revokeObjectURL(cleanedUrlRef.current);
        cleanedUrlRef.current = null;
      }

      scene?.destroy();
      scene = null;
      window.__hopathonUnicornScene = null;
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* 
        Badge 1 (the external link the SDK sometimes appends to the DOM):
        Use the exact selector you found.
      */}
      <style>{`
        a[href*="unicorn.studio?utm_source=public-url"] {
          display: none !important;
        }
      `}</style>

      {/* 
        This is the element we hand to addScene.

        The cleaned Unicorn JSON (downloaded into the repo + layers stripped at runtime
        to remove free-plan attribution) is rendered as the full animated background "image".

        Positioned as absolute inset-0 inside the relative #hopathon-desktop container
        so the JSON scene is the true hero background.

        A soft left-to-right gradient helps the bottom-left text remain readable over
        the colorful WebGL art.

        The bottom gradient fade is the watermark cover (your "cover the canvas
        attribution with a solid overlay" technique), re-asserted aggressively
        so the baked badge stays hidden while the JSON art shows above it.
      */}
      <div
        ref={containerRef}
        id="hopathon-unicorn-bg"
        className="relative h-full w-full overflow-hidden bg-[#0C4506]"
        aria-hidden
      />

      {/* Soft left gradient so the text block on the left reads well over the JSON scene */}
      <div
        className="absolute inset-y-0 left-0 w-[48%] bg-gradient-to-r from-[#0C4506]/80 via-[#0C4506]/40 to-transparent z-[1] pointer-events-none"
        aria-hidden
      />
    </div>
  );
}

/**
 * Nuclear-level suppression for the Unicorn watermark (both the link and the baked canvas one).
 *
 * Strategy (combined, because the "baked in canvas" badge is drawn by their WebGL runtime
 * when the published scene has freePlan:true):
 *
 * - Explicitly force any <canvas> children to low z-index + absolute so they don't composite over our cover.
 * - Create/keep a solid theme-colored div at the BOTTOM of the canvas host (exactly as you described).
 * - The cover is a gradient fade from the bottom (full-width, ~28% height) so it reliably hides the lower canvas-baked attribution while letting the JSON background art breathe above it.
 * - We re-parent the cover to be the absolute last child repeatedly (after scene init, on timers, and via MutationObserver) so it always wins stacking.
 * - This lives inside the exact element passed to addScene ("at the bottom of the canvas").
 *
 * This + the patched JSON attempt + the exact link CSS is the strongest on-page workaround possible
 * without forking their minified SDK or pixel-scraping their canvas every frame.
 */
function suppressCanvasesAndEnsureCover(host: HTMLElement) {
  if (!host) return;

  // 1. Demote any canvases the SDK inserted so our solid cover can sit above the WebGL output.
  const canvases = host.querySelectorAll('canvas');
  canvases.forEach((c) => {
    const el = c as HTMLCanvasElement;
    el.style.setProperty('position', 'absolute', 'important');
    el.style.setProperty('z-index', '0', 'important');
    // Keep pointer-events off on the visual itself if the SDK didn't already.
    el.style.setProperty('pointer-events', 'none', 'important');
  });

  // 2. The solid overlay for the canvas-baked badge (Badge 2).
  // Positioned at the bottom of the canvas host, full width, solid matching theme color.
  // Height set higher than the minimal 80px because the badge in this particular publish
  // is apparently still visible with smaller covers.
  let cover = host.querySelector<HTMLElement>('#unicorn-canvas-watermark-cover');

  if (!cover) {
    cover = document.createElement('div');
    cover.id = 'unicorn-canvas-watermark-cover';
    cover.setAttribute('aria-hidden', 'true');
  }

  // Artistic bottom treatment for the Unicorn JSON background.
  // We use a gradient (solid theme color fading upward) instead of a hard bar.
  // This covers the lower attribution area (the "cover the canvas attribution"
  // technique) while letting more of the beautiful JSON scene show through.
  // ~28% height gives strong coverage for the baked watermark while feeling
  // like a natural ground for the background "image".
  cover.style.setProperty('position', 'absolute', 'important');
  cover.style.setProperty('left', '0', 'important');
  cover.style.setProperty('right', '0', 'important');
  cover.style.setProperty('bottom', '0', 'important');
  cover.style.setProperty('width', '100%', 'important');
  cover.style.setProperty('height', '28%', 'important');
  cover.style.setProperty('background', `linear-gradient(to top, ${THEME_BG} 0%, ${THEME_BG} 55%, transparent 100%)`, 'important');
  cover.style.setProperty('z-index', '999999', 'important');
  cover.style.setProperty('pointer-events', 'none', 'important');

  // Force it to be the last child so it is painted on top of the canvas and any late nodes the runtime adds.
  if (cover.parentElement !== host) {
    host.appendChild(cover);
  } else if (cover !== host.lastElementChild) {
    host.appendChild(cover);
  }
}

// Keep calling the suppression for a while after init, because the SDK can append the canvas
// and its own attribution nodes asynchronously.
function startAggressiveWatermarkSuppression(host: HTMLElement) {
  // Immediate
  suppressCanvasesAndEnsureCover(host);

  // Several timed passes (the runtime does async work after addScene resolves)
  const times = [80, 180, 350, 600, 900, 1400, 2200, 3200];
  times.forEach((t) => setTimeout(() => suppressCanvasesAndEnsureCover(host), t));

  // MutationObserver: if anything new is added inside the host, re-assert our cover on top.
  const mo = new MutationObserver(() => {
    suppressCanvasesAndEnsureCover(host);
  });
  mo.observe(host, { childList: true, subtree: true });

  // Stop the observer after a generous window (badges are added at load time).
  setTimeout(() => mo.disconnect(), 12000);
}
