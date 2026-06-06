"use client";

import { useEffect, type ReactNode } from "react";

/** Root layout locks scroll; hopathon pages get their own full-viewport scroll layer. */
export function HopathonScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflowY = "auto";
    html.style.height = "auto";
    body.style.overflowY = "auto";
    body.style.height = "auto";
    body.style.minHeight = "100dvh";

    return () => {
      html.style.overflowY = "";
      html.style.height = "";
      body.style.overflowY = "";
      body.style.height = "";
      body.style.minHeight = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-y-auto [-webkit-overflow-scrolling:touch]">
      {children}
    </div>
  );
}
