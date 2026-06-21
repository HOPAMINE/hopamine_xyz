"use client";

import { roboto } from "../../fonts";

const hopathonBg = "bg-[#13450E]";
import {
  PROJECT_DIRECTORY_URL,
  SUBMISSION_FORM_URL,
} from "./hackathonSchedule";

export function HackathonUpdatePage() {
  return (
    <div className={`relative min-h-dvh w-full ${hopathonBg} text-[#f5f0e8]`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)]" />

      {/* Compact navbar — safe-area aware, minimal height */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#13450E]/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
        <div className="mx-auto flex h-11 max-w-6xl items-center px-4 sm:h-12 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hopathon/group-171.svg"
              alt="Hopamine"
              width={178}
              height={46}
              className="h-4 w-auto shrink-0 sm:h-5"
            />
            <span className="h-3 w-px shrink-0 bg-white/25" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hopathon/the-green-hackathon.svg"
              alt="The Green Hackathon"
              width={340}
              height={138}
              className="h-4 w-auto shrink-0 sm:h-5"
            />
          </div>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <p className="max-w-2xl text-sm font-semibold leading-relaxed text-white/80 sm:text-base">
          Welcome to the &quot;GREEN HACKATHON&quot; information page.
        </p>

        {/* Submission requirements */}
        <section className="mt-10 rounded-2xl border border-white/15 bg-[#0C4506]/60 p-5 sm:p-7">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            📋 What you need to submit
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            Your 90-second Loom pitch should include a full visual and verbal
            walkthrough, the problem you&apos;re solving, and how you plan to
            scale (or stay local, if that&apos;s by design).
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/85 sm:text-base">
            <li className="flex gap-2">
              <span aria-hidden>🔗</span>
              <span>Link to your 90-second Loom video</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>✍️</span>
              <span>
                Brief written description: startup name, the solution, and its
                application
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-white/65">
            Submit your project in the form below by latest 11pm EST on June
            14th.
          </p>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white">
          <iframe
            src={SUBMISSION_FORM_URL}
            title="Green Hackathon Project Submission"
            className="min-h-[720px] w-full border-0"
            allow="geolocation; microphone; camera; fullscreen"
          />
        </section>

        {/* Links */}
        <section className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <a
            href={SUBMISSION_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${roboto.className} inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold tracking-[-0.03em] text-[#13450E] transition hover:opacity-90 sm:text-base`}
          >
            ✍️ Submit your project
          </a>
          <a
            href={PROJECT_DIRECTORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${roboto.className} inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold tracking-[-0.03em] text-white transition hover:bg-white/10 sm:text-base`}
          >
            🔍 View project directory
          </a>
        </section>
      </div>
    </div>
  );
}
