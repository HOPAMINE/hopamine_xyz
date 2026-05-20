"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/** Enables vertical scrolling on `/projects` while root layout keeps other routes locked. */
export function ProjectsScrollGate({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflowY = "auto";
    html.style.height = "auto";
    html.style.minHeight = "100dvh";

    body.style.overflowY = "auto";
    body.style.height = "auto";
    body.style.minHeight = "auto";

    return () => {
      html.style.overflowY = "";
      html.style.height = "";
      html.style.minHeight = "";

      body.style.overflowY = "";
      body.style.height = "";
      body.style.minHeight = "";
    };
  }, []);

  return children;
}
