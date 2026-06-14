"use client";

import { useEffect, type ReactNode } from "react";

/** Participants page: scroll on mobile, locked viewport on desktop (lg+). */
export function HopathonParticipantsScrollLock({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const scrollRoot = document.getElementById("hopathon-scroll");
    if (!scrollRoot) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const applyScrollMode = () => {
      if (desktopQuery.matches) {
        scrollRoot.classList.remove("overflow-y-auto", "overscroll-y-auto");
        scrollRoot.classList.add("overflow-hidden", "h-dvh", "max-h-dvh");
      } else {
        scrollRoot.classList.remove("overflow-hidden", "h-dvh", "max-h-dvh");
        scrollRoot.classList.add("overflow-y-auto", "overscroll-y-auto");
      }
    };

    applyScrollMode();
    desktopQuery.addEventListener("change", applyScrollMode);

    return () => {
      desktopQuery.removeEventListener("change", applyScrollMode);
      scrollRoot.classList.remove("overflow-hidden", "h-dvh", "max-h-dvh");
      scrollRoot.classList.add("overflow-y-auto", "overscroll-y-auto");
    };
  }, []);

  return <>{children}</>;
}
