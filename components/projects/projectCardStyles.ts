/** Width of project cards in the dashboard horizontal scroll. */
export const DASHBOARD_PROJECT_CARD_WIDTH_PX = 280;

/** Reference width for a full-size project card in the /projects grid (~3 columns). */
export const PROJECT_CARD_REFERENCE_WIDTH_PX = 380;

/** Grid used on `/projects` for the hackathon project cards. */
export const projectsPageGridClassName =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

/**
 * Fixed footprint for one project card — matches a single column in the
 * `/projects` grid at `lg` (3 columns inside `max-w-7xl`).
 */
export const projectsPageCardFootprintClassName =
  "w-full shrink-0 lg:w-[calc((min(100%,80rem)-2rem)/3)]";

/**
 * Fixed footprint for dashboard project cards — full width on mobile, and on `lg+`
 * matches a single column in the `/projects` grid inside `max-w-7xl`.
 */
export const dashboardProjectCardFootprintClassName =
  "w-full shrink-0 lg:w-[calc((80rem-2rem)/3)] lg:min-w-[calc((80rem-2rem)/3)]";

/** Scale factor used to shrink a reference card to the dashboard thumb width. */
export const DASHBOARD_PROJECT_CARD_SCALE =
  DASHBOARD_PROJECT_CARD_WIDTH_PX / PROJECT_CARD_REFERENCE_WIDTH_PX;

/** min-h-[15.18rem] scaled to {@link DASHBOARD_PROJECT_CARD_WIDTH_PX} vs a ~380px grid column. */
const projectCardCompactFootprintClassName =
  "w-[280px] min-h-[11.19rem] shrink-0 p-[14px]";

export const projectCardShellClassName =
  "group/card flex min-h-[15.18rem] flex-1 cursor-pointer flex-col rounded-[1.875rem] border border-white/20 bg-accent-events p-5 text-left text-white shadow-sm transition-colors duration-200 hover:bg-white sm:p-6";

/** Blue project card for the /projects portal page. */
export const projectCardPortalShellClassName =
  "group/card flex min-h-[15.18rem] flex-1 cursor-pointer flex-col rounded-[1.875rem] border border-white/20 bg-accent-navbar p-5 text-left text-white shadow-sm transition-colors duration-200 hover:bg-white sm:p-6";

/** Green project card without hover invert (dashboard profile projects). */
export const projectCardStaticShellClassName =
  "group/card flex min-h-[15.18rem] flex-1 cursor-pointer flex-col rounded-[1.875rem] border border-white/20 bg-accent-events p-5 text-left text-white shadow-sm sm:p-6";

export const projectCardDashboardShellClassName =
  "group/card flex min-h-[15.18rem] flex-1 cursor-pointer flex-col rounded-[1.875rem] border border-accent-navbar/20 bg-white p-5 text-left shadow-sm transition-colors duration-200 hover:bg-accent-navbar sm:p-6";

export const projectCardCompactShellClassName = `group/card flex cursor-pointer flex-col rounded-[1.875rem] border border-white/20 bg-accent-events text-left text-white shadow-sm transition-colors duration-200 hover:bg-white ${projectCardCompactFootprintClassName}`;

export const projectCardCompactPortalShellClassName = `group/card flex cursor-pointer flex-col rounded-[1.875rem] border border-white/20 bg-accent-navbar text-left text-white shadow-sm transition-colors duration-200 hover:bg-white ${projectCardCompactFootprintClassName}`;

export const projectCardCompactDashboardShellClassName = `group/card flex cursor-pointer flex-col rounded-[1.875rem] border border-accent-navbar/20 bg-white text-left shadow-sm transition-colors duration-200 hover:bg-accent-navbar ${projectCardCompactFootprintClassName}`;

export const projectCardCompactAddClassName = `${projectCardCompactFootprintClassName} flex items-center justify-center rounded-[1.875rem] border border-dashed border-accent-events/40 text-center text-accent-events/75 transition-colors hover:border-accent-events hover:text-accent-events`;

/** Full-size add-project card — same footprint as {@link projectCardShellClassName}. */
export const projectCardAddReferenceClassName =
  "flex min-h-[15.18rem] w-full items-center justify-center rounded-[1.875rem] border border-dashed border-accent-events/40 p-5 text-center text-sm text-accent-events/75 transition-colors hover:border-accent-events hover:text-accent-events sm:p-6";
