"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

export type NavLinkItem = { href: string; label: string };

function MenuIcon() {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span className="absolute top-0 left-0 block h-0.5 w-full rounded-full bg-current" />
      <span className="absolute top-[6px] left-0 block h-0.5 w-full rounded-full bg-current" />
      <span className="absolute top-[12px] left-0 block h-0.5 w-full rounded-full bg-current" />
    </span>
  );
}

const ticketButtonClasses = {
  default:
    "inline-flex items-center rounded-none border border-white/70 bg-white px-8 py-4 font-serif text-2xl tracking-[-0.03em] text-accent-navbar transition-opacity hover:opacity-90 sm:text-3xl",
  homeBlueBg:
    "inline-flex items-center rounded-none border-2 border-white bg-accent-navbar px-8 py-4 font-serif text-2xl tracking-[-0.03em] text-white transition-opacity hover:opacity-90 sm:text-3xl",
} as const;

export function MobileMenu({
  links,
  ticketHref,
  mobileTicketVariant = "default",
}: {
  links: readonly NavLinkItem[];
  ticketHref: string;
  mobileTicketVariant?: keyof typeof ticketButtonClasses;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-sm border-none text-white md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-neutral-950/50 backdrop-blur-[2px] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Dialog.Content className="fixed inset-0 z-101 flex flex-col bg-accent-navbar outline-none transition-opacity duration-200 ease-out data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-[max(20px,env(safe-area-inset-top))] right-[max(20px,env(safe-area-inset-right))] z-10 flex h-11 w-11 touch-manipulation items-center justify-center rounded-sm border-none text-white transition-opacity hover:opacity-90"
              aria-label="Close menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>

          <div className="flex min-h-0 flex-1 flex-col justify-end px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(2rem,env(safe-area-inset-bottom))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(5rem,env(safe-area-inset-top))]">
            <nav
              className="flex flex-col gap-6 text-white"
              aria-label="Mobile primary"
            >
              {links.map(({ href, label }) => (
                <Dialog.Close asChild key={label}>
                  <Link
                    href={href}
                    className="text-left font-serif text-4xl leading-[1.05] tracking-[-0.04em] transition-opacity hover:opacity-85 sm:text-5xl"
                  >
                    {label}
                  </Link>
                </Dialog.Close>
              ))}
            </nav>

            <div className="mt-14">
              <Dialog.Close asChild>
                <a
                  href={ticketHref}
                  className={ticketButtonClasses[mobileTicketVariant]}
                >
                  Buy Tickets
                </a>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
