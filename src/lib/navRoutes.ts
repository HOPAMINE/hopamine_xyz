export const PORTAL_ROUTES = ["/home", "/projects", "/builders", "/directory", "/dashboard"];

export const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
] as const;

export function isPortalRoute(pathname: string): boolean {
  return PORTAL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isEventsRoute(pathname: string): boolean {
  return pathname === "/events" || pathname.startsWith("/events/");
}

export function isProjectsRoute(pathname: string): boolean {
  return pathname === "/projects" || pathname.startsWith("/projects/");
}

export function isGreenNavRoute(pathname: string): boolean {
  return (
    isEventsRoute(pathname) ||
    isProjectsRoute(pathname) ||
    pathname.startsWith("/profile/")
  );
}
