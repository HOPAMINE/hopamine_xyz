/** Shared panel styling — matches the submission deadline banner. */
export const hopathonPanelClassName =
  "rounded-lg border border-white/25 bg-[#0C4506]/70";

export const hopathonCardClassName = [
  hopathonPanelClassName,
  "min-h-24 flex-1 p-4 sm:p-5 lg:min-h-0 lg:p-3 lg:overflow-y-auto lg:[scrollbar-width:thin] xl:p-4",
].join(" ");

export const hopathonCountdownUnitClassName = [
  hopathonPanelClassName,
  "flex min-w-[4.5rem] flex-col items-center px-3 py-4 sm:min-w-[5.5rem] sm:px-4 lg:min-w-[3.75rem] lg:px-2 lg:py-2.5 xl:min-w-[4.5rem] xl:px-3 xl:py-3",
].join(" ");
