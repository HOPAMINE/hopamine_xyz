import Link from "next/link";
import { HopathonDesktopBackground } from "../../../components/hopathon/HopathonDesktopBackground";
import { roboto } from "../../../fonts";

export default function HopathonPage() {
  return (
    <>
      {/* Mobile / current experience — untouched */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-50 flex min-h-dvh flex-col overflow-y-auto bg-[#13680B]">
          <div className="relative min-h-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/test.png"
              alt=""
              className="h-auto w-full"
            />

            <div className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-[7%]">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hopathon/the-green-hackathon.svg"
                  alt="The Green Hackathon"
                  width={340}
                  height={138}
                  className="h-auto w-[min(92vw,340px)]"
                />
                <p
                  className={`${roboto.className} absolute top-full left-1/2 mt-3 w-max max-w-[92vw] -translate-x-1/2 text-center text-lg font-semibold tracking-[-0.03em] text-[#f5f0e8] sm:text-xl`}
                >
                  THINK GLOBALLY, BUILD LOCALLY
                </p>
              </div>
            </div>
          </div>

          <section className="shrink-0 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex w-full items-center justify-center bg-[#13450E] py-4 px-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hopathon/for-coders-and-non-coders.svg"
                alt="for coders & non-coders"
                width={304}
                height={29}
                className="h-auto w-full"
              />
            </div>
            <div className="mt-2 px-5">
              <p
                className={`${roboto.className} mb-3 text-center text-base font-semibold tracking-[-0.03em] text-[#f5f0e8] sm:text-lg`}
              >
                STARTS ON JUNE 13TH @11AM EST
              </p>
              <Link
                href="/hopathon/form"
                className={`${roboto.className} flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-xl font-bold uppercase tracking-[-0.03em] text-[#13680B] sm:text-2xl`}
              >
                START HERE
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Desktop-only layout */}
      <div
        id="hopathon-desktop"
        className="hidden lg:fixed lg:inset-0 lg:z-0 lg:block lg:h-dvh lg:w-full lg:overflow-hidden lg:bg-[#0C4506] lg:text-white"
      >
        <HopathonDesktopBackground />

        {/* Content — bottom left */}
        <div className="absolute bottom-16 left-12 z-10 max-w-xl">
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
            className={`${roboto.className} mb-8 text-2xl font-semibold uppercase leading-tight tracking-[-0.03em] text-white/80`}
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

        {/* Custom fixed image — bottom right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hopathon/image-mwl.png"
          alt=""
          className="fixed bottom-0 right-6 z-20 w-[320px] select-none pointer-events-none lg:w-[370px] xl:w-[420px]"
        />
      </div>
    </>
  );
}

