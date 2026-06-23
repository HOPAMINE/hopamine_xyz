"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isGreenNavRoute, isPortalRoute, MOBILE_MENU_LINKS, NAV_LINKS } from "@/lib/navRoutes";
import { MobileMenu } from "./MobileMenu";
import { NavbarNotifications } from "./NavbarNotifications";
import { ProfileNavLink } from "./ProfileNavLink";

export default function Navbar() {
  const pathname = usePathname();
  const isPortal = isPortalRoute(pathname);
  const isGreenNav = isGreenNavRoute(pathname);
  const mobileNavLinks = MOBILE_MENU_LINKS.map(({ href, label }) => ({ href, label }));

  const mobileClaimClass = isGreenNav
    ? "inline-flex h-10 shrink-0 touch-manipulation items-center justify-center border border-white/35 px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-xs"
    : "inline-flex h-10 shrink-0 touch-manipulation items-center justify-center border border-white/35 px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-navbar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-xs";

  return (
    <header
      className={`fixed top-[max(20px,env(safe-area-inset-top))] rounded-full right-[max(20px,env(safe-area-inset-right))] left-[max(20px,env(safe-area-inset-left))] z-50 m-0 border border-black/20 ${isGreenNav ? "bg-accent-events" : "bg-accent-navbar"}`}
    >
      <nav
        className="mx-auto flex h-[4.5rem] items-center justify-between gap-3 px-4 font-mono text-sm font-bold uppercase tracking-wide text-white sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 text-white sm:gap-2.5"
        >
          <Image
            src="/icon.svg"
            alt=""
            width={128}
            height={128}
            unoptimized
            className="h-9 w-auto shrink-0 object-contain sm:h-10"
          />
          <Image
            src="/Hopamine_text.svg"
            alt="Hopamine"
            width={93}
            height={24}
            unoptimized
            className="h-6 w-auto shrink-0 object-contain sm:h-7"
          />
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          {isPortal ? <NavbarNotifications /> : null}
          <Link href="/claim" className={`md:hidden ${mobileClaimClass}`}>
            Claim
          </Link>
          <ProfileNavLink className="md:hidden" />
          <MobileMenu links={mobileNavLinks} variant={isGreenNav ? "events" : "default"} />
          <ul className="hidden items-center md:flex md:flex-wrap md:justify-end md:gap-6 lg:gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-opacity hover:opacity-80"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <ProfileNavLink showLabel />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
