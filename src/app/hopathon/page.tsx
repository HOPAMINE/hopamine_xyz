import Link from "next/link";
import { roboto } from "../../../fonts";

export default function HopathonPage() {
  return (
    <div
      id="hopathon-landing"
      className="relative min-h-dvh w-full overflow-hidden bg-[#0C4506] text-white"
    >
      {/* Full-bleed background + dark overlay */}
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

      {/* Foreground character — desktop only */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hopathon/image-mwl.png"
        alt=""
        className="pointer-events-none absolute bottom-0 right-6 z-[5] hidden w-[370px] select-none lg:block xl:w-[420px]"
      />

      {/* Content — centered */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 md:px-12">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/" className="mb-4 block sm:mb-6">
            <img
              src="/hopathon/group-171.svg"
              alt="Hopamine"
              className="h-7 w-auto sm:h-8"
            />
          </Link>
          <p
            className={`${roboto.className} mb-3 text-base font-semibold tracking-[-0.03em] text-[#f5f0e8] sm:mb-4 sm:text-lg xl:text-xl`}
          >
            THANK YOU FOR BUILDING WITH US
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hopathon/the-green-hackathon.svg"
            alt="The Green Hackathon"
            width={340}
            height={138}
            className="mb-4 h-auto w-full max-w-[min(88vw,340px)] sm:mb-6 sm:max-w-[420px]"
          />
          <p
            className={`${roboto.className} mb-6 text-lg font-semibold uppercase leading-tight tracking-[-0.03em] text-white sm:mb-8 sm:text-2xl`}
          >
            THINK GLOBALLY · BUILD LOCALLY
          </p>
          <Link
            href="/"
            className={`${roboto.className} inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-bold tracking-[-0.03em] text-[#0C4506] transition hover:opacity-90 active:scale-[0.985] sm:px-8 sm:py-4 sm:text-base`}
          >
            Back to Hopamine
          </Link>
        </div>
      </div>
    </div>
  );
}
