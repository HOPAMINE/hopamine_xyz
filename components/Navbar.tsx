"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu, type NavLinkItem } from "./MobileMenu";

const PRIMARY_LINKS: NavLinkItem[] = [
  { href: "/projects", label: "Projects" },
  { href: "/builders", label: "Builders" },
  { href: "/directory", label: "Directory" },
];

const MOBILE_NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "Home" },
  ...PRIMARY_LINKS,
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-[max(20px,env(safe-area-inset-top))] right-[max(20px,env(safe-area-inset-right))] left-[max(20px,env(safe-area-inset-left))] z-50 m-0 border border-white/70 bg-accent-navbar">
      <nav
        className="mx-auto flex items-center justify-between gap-3 px-4 py-4 font-mono text-sm uppercase tracking-wide text-white sm:px-6"
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
          <span className="normal-case font-serif text-2xl tracking-[-0.04em] sm:text-3xl md:text-[1.75rem]">
            Hopamine
          </span>
        </Link>
        <div className="flex shrink-0 items-center md:gap-2">
          <MobileMenu
            links={MOBILE_NAV_LINKS}
            ticketHref="/001"
            mobileTicketVariant={isHome ? "homeBlueBg" : "default"}
          />
          <ul className="hidden items-center md:flex md:flex-wrap md:justify-end md:gap-6 lg:gap-8">
          <li>
            <Link
              href="/projects"
              className="transition-opacity hover:opacity-80"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/builders"
              className="transition-opacity hover:opacity-80"
            >
              Builders
            </Link>
          </li>
          <li>
            <Link
              href="/directory"
              className="transition-opacity hover:opacity-80"
            >
              Directory
            </Link>
          </li>
          <li>
            <a
              href="/001"
              className="inline-flex items-center justify-center bg-white px-5 py-2 text-accent-navbar transition-opacity hover:opacity-90"
            >
              Buy Tickets
            </a>
          </li>
        </ul>
        </div>
      </nav>
    </header>
  );
}
