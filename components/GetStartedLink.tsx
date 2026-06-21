"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { robotoMono } from "../fonts";

const buttonClass = `${robotoMono.className} inline-flex min-h-11 items-center justify-center border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#00A6F3] transition-opacity hover:opacity-90 sm:px-8 sm:text-base md:px-10 md:py-3.5 md:text-lg`;

export function GetStartedLink() {
  const { user, isLoaded } = useUser();
  const href = isLoaded && user ? "/projects" : "/sign-in";

  return (
    <Link href={href} className={buttonClass}>
      Get Started
    </Link>
  );
}
