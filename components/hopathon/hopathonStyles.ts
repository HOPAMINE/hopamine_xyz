/** Shared panel styling — matches the submission deadline banner. */
export const hopathonPanelClassName =
  "rounded-lg border border-white/25 bg-[#0C4506]/70";

export const hopathonCardClassName = [
  hopathonPanelClassName,
  "min-h-24 flex-1 p-4 sm:p-5",
].join(" ");

export const hopathonCountdownUnitClassName = [
  hopathonPanelClassName,
  "flex min-w-[4.5rem] flex-col items-center px-3 py-4 sm:min-w-[5.5rem] sm:px-4",
].join(" ");
