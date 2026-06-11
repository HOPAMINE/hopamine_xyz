import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** Temporary: everything except hopathon (and APIs) goes to the hopathon landing. */
function shouldRedirectToHopathon(pathname: string): boolean {
  if (pathname.startsWith("/hopathon")) return false;
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/trpc")) return false;
  return true;
}

export default clerkMiddleware(async (_auth, req) => {
  const { pathname } = req.nextUrl;

  if (shouldRedirectToHopathon(pathname)) {
    return NextResponse.redirect(new URL("/hopathon", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
