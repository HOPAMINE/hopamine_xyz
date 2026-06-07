"use client";

import { useEffect, useRef } from "react";

const PROJECT_ID = "agYxdkCRqIFen86PYoPp";
const SCENE_VERSION = "1";
const SCENE_JSON = "/hopathon/scenes/pop-art.json";
const SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.1/dist/unicornStudio.umd.js";
const THEME_BG = "#0C4506";

type UnicornSceneInstance = {
  destroy: () => void;
  resize?: () => void;
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

async function resolveSceneSource(): Promise<
  { filePath: string } | { projectId: string }
> {
  try {
    const response = await fetch(SCENE_JSON, { method: "HEAD" });
    if (response.ok) return { filePath: SCENE_JSON };
  } catch {
    // Optional self-hosted JSON at public/hopathon/scenes/pop-art.json
  }

  return {
    projectId: `${PROJECT_ID}?production=true&update=${SCENE_VERSION}`,
  };
}

export function HopathonDesktopBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

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

        const source = await resolveSceneSource();

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

        // Robust post-init cleanup for any Unicorn attribution the SDK injects
        // (both the utm link and any small DOM badge nodes). We also re-append
        // our canvas cover so it is the last child and wins in stacking order.
        const host = containerRef.current;
        const runBadgeCleanup = () => {
          if (!host) return;

          // 1. Remove/hide obvious attribution elements the runtime may append
          host.querySelectorAll(
            [
              'a[href*="unicorn"]',
              '[href*="unicorn.studio"]',
              '[class*="unicorn"]',
              '[id*="unicorn"]',
              '[data-us-badge]',
              '[title*="unicorn" i]',
            ].join(',')
          ).forEach((node) => {
            const el = node as HTMLElement;
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.style.setProperty('opacity', '0', 'important');
            // Try hard remove if it's a small badge-like node
            if (el.offsetHeight < 200 && el.offsetWidth < 400) {
              el.remove();
            }
          });

          // 2. Any tiny absolutely positioned children at the bottom that smell like badges
          Array.from(host.children).forEach((child) => {
            const el = child as HTMLElement;
            const style = window.getComputedStyle(el);
            if (
              (style.position === 'absolute' || style.position === 'fixed') &&
              parseFloat(style.bottom) < 120 &&
              el.offsetHeight < 120 &&
              (el.textContent || '').toLowerCase().includes('unicorn')
            ) {
              el.remove();
            }
          });

          // 3. Make sure our solid cover is the last child (so it is top-most among siblings)
          const cover = host.querySelector('#unicorn-canvas-watermark-cover') as HTMLElement | null;
          if (cover && cover.parentElement === host) {
            if (cover !== host.lastElementChild) {
              host.appendChild(cover);
            }
            // Force it above everything the SDK might have added later
            cover.style.zIndex = '99999';
          }
        };

        runBadgeCleanup();
        // The SDK can append nodes a bit after addScene resolves (async resource load, first render, etc.)
        setTimeout(runBadgeCleanup, 250);
        setTimeout(runBadgeCleanup, 800);
        setTimeout(runBadgeCleanup, 1600);

        // Watch for any late DOM mutations inside the host and re-clean
        const mo = new MutationObserver(() => runBadgeCleanup());
        mo.observe(host, { childList: true, subtree: true });

        // Stop observing after a while (the badges are added at init time)
        setTimeout(() => mo.disconnect(), 8000);

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
      scene?.destroy();
      scene = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* 
        Workaround for Unicorn Studio watermark (two badges on free-plan publishes):

        1. Link attribution (the DOM <a> the SDK sometimes injects):
           Exact rule provided: hide a[href*="unicorn.studio?utm_source=public-url"]

        2. Canvas-baked attribution (drawn into the WebGL output itself when the published
           scene has freePlan:true). We cover it with a solid div at the bottom of the
           canvas host, sized ~80px high, matching the page theme color.

        This is a standard site-owner visual masking technique. The overlay is placed
        inside the element we hand to addScene so it is "at the bottom of the canvas".
      */}
      <style>{`
        /* Badge 1 - link attribution */
        a[href*="unicorn.studio?utm_source=public-url"] {
          display: none !important;
        }
      `}</style>

      {/* This is the element we pass to UnicornStudio.addScene.
          The SDK will inject a <canvas> (and possibly other nodes) as children. */}
      <div
        ref={containerRef}
        id="hopathon-unicorn-bg"
        className="relative h-full w-full overflow-hidden bg-[#0C4506]"
        aria-hidden
      >
        {/* Badge 2 cover: solid theme-colored rectangle at the bottom-left of the canvas area.
            Height ~80px as specified. Made a bit wider (320px) to be safe across DPIs/scenes.
            High z so it sits in front of whatever the WebGL drew (and any late-appended SDK nodes). */}
        <div
          id="unicorn-canvas-watermark-cover"
          className="absolute bottom-0 left-0 z-[9999] w-[320px] h-[90px] pointer-events-none"
          style={{ backgroundColor: THEME_BG }}
          aria-hidden
        />
      </div>
    </div>
  );
}
