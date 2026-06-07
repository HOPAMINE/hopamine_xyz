import Link from "next/link";
import { roboto } from "../../../fonts";

export default function HopathonPage() {
  return (
    <>
      {/* Mobile — 50/50 grid in normal flow (HopathonScroll owns the viewport layer) */}
      <div className="min-h-dvh bg-[#126609] lg:hidden">

        <div className="flex flex-col items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hopathon/green58.svg"
            alt=""
            width={410}
            height={517}
            className="h-auto w-full max-w-full object-contain"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hopathon/the-green-hackathon.svg"
            alt="The Green Hackathon"
            width={340}
            height={138}
            className="mt-4 h-auto w-[min(92vw,340px)]"
          />
          <p
            className={`${roboto.className} mt-3 text-center text-lg font-semibold tracking-[-0.03em] text-[#f5f0e8] sm:text-xl`}
          >
            THINK GLOBALLY , BUILD LOCALLY.
          </p>

          <div className="mt-2 flex h-[55px] w-full items-center justify-center self-stretch bg-[#13450E] px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hopathon/for%20coders%20%26%20non-coders.svg"
              alt="for coders & non-coders"
              width={304}
              height={29}
              className="h-auto w-full max-w-[304px]"
            />
          </div>

          <p
            className={`${roboto.className} mt-2 text-center text-lg font-semibold tracking-[-0.03em] text-[#f5f0e8] sm:text-xl`}
          >
             STARTS ON JUNE 13TH @11AM EST
          </p>
          <div className="w-full self-stretch px-2 pb-2">
            <Link
              href="/hopathon/form"
              className={`${roboto.className} mt-2 flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-xl font-bold uppercase tracking-[-0.03em] text-[#13450E] transition hover:opacity-90 active:scale-[0.985] sm:text-2xl`}
            >
              START HERE
            </Link>
          </div>
        </div>
        
      </div>

      {/* Desktop-only layout */}
      <div
        id="hopathon-desktop"
        className="relative hidden lg:fixed lg:inset-0 lg:z-0 lg:block lg:h-dvh lg:w-full lg:overflow-hidden lg:bg-[#0C4506] lg:text-white"
      >
        {/* Full-bleed background + 10% dark overlay */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#0C4506]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hopathon/bg68.png"
            alt=""
            width={1506}
            height={804}
            className="h-full w-full object-cover [image-rendering:pixelated]"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Foreground character — sits above bg, below text */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hopathon/image-mwl.png"
          alt=""
          className="pointer-events-none absolute bottom-0 right-6 z-[5] w-[320px] select-none lg:w-[370px] xl:w-[420px]"
        />

        {/* Content — centered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-12">
          <div className="flex max-w-xl flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hopathon/group-171.svg"
              alt="Hopamine"
              className="mb-6 h-8 w-auto"
            />
            <p
              className={`${roboto.className} mb-4 text-lg font-semibold tracking-[-0.03em] text-[#f5f0e8] xl:text-xl`}
            >
              STARTS ON JUNE 13TH @11AM EST
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hopathon/the-green-hackathon.svg"
              alt="The Green Hackathon"
              width={340}
              height={138}
              className="mb-6 h-auto w-full max-w-[420px]"
            />
            <p
              className={`${roboto.className} mb-8 text-2xl font-semibold  leading-tight tracking-[-0.03em] text-white/80`}
            >
              Think globally &amp; build locally
            </p>
            <Link
              href="/hopathon/form"
              className={`${roboto.className} inline-flex w-fit rounded-full bg-white px-8 py-4 text-base font-bold tracking-[-0.03em] text-[#0C4506] hover:opacity-90 active:scale-[0.985] transition`}
            >
              Join us
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}

