"use client";

import { robotoMono } from "../../fonts";

type AddProjectCardProps = {
  onClick?: () => void;
};

export function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add project"
      className={`${robotoMono.className} flex min-h-[15.18rem] w-full items-center justify-center rounded-[1.875rem] border border-dashed border-white/40 p-6 text-sm text-white/75 transition-colors hover:border-white hover:text-white`}
    >
      Add project
    </button>
  );
}
