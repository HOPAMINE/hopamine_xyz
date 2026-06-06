import Image from "next/image";
import Link from "next/link";
import { roboto } from "../../../fonts";

export default function HopathonPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#13680B]">
      {/* Hero — ~50% of the screen on phones; image crops consistently */}
      <div className="relative h-[50svh] min-h-[240px] max-h-[52svh] w-full shrink-0 overflow-hidden sm:h-[50dvh] sm:max-h-[52dvh]">
        <Image
          src="/test.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
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
  );
}
