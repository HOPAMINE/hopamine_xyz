"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { roboto } from "../../fonts";
import { SUBMISSION_FORM_URL } from "./hackathonSchedule";
import { hopathonCardClassName } from "./hopathonStyles";

const CRITERIA = [
  {
    title: "Scalability",
    description: "Can it hold 10,000 users?",
  },
  {
    title: "Universality",
    description: "Does it work as well in Hong Kong as in Rio?",
  },
  {
    title: "User-Friendly",
    description: "Can anyone, any age, use it with ease?",
  },
  {
    title: "Equitable",
    description: "Does it serve people reciprocally, not extractively?",
  },
] as const;

export function SubmitInfoCard() {
  return (
    <div className={hopathonCardClassName}>
      <p className="mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl">
        WHEN &amp; HOW TO SUBMIT
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed sm:space-y-3">
        <li>
          <span className="font-bold">THE SUBMISSION</span> — deadline is June
          14th @ 11PM EST. Upload your 90-second Loom pitch and brief written
          description (startup name, solution, and application) via the{" "}
          <a
            href={SUBMISSION_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2 hover:text-white/80"
          >
            submission form
          </a>
          .
        </li>
        <li>
          <span className="font-bold">MAKE SURE TO REVIEW </span>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="font-bold underline underline-offset-2 hover:text-white/80"
              >
                CRITERIAS
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
              <Dialog.Content
                aria-describedby={undefined}
                className={`${roboto.className} fixed left-1/2 top-1/2 z-50 w-[min(94vw,44rem)] max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/25 bg-[#0C4506]/70 p-8 text-[#f5f0e8] shadow-xl outline-none sm:p-10`}
              >
                <Dialog.Title className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
                  Judging Criteria
                </Dialog.Title>
                <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                  Four things, equal weight (25% each), scored 1–5 by all three
                  judges (60 points total):
                </p>
                <ul className="mt-6 space-y-4 text-base text-white/90 sm:text-lg">
                  {CRITERIA.map(({ title, description }) => (
                    <li key={title}>
                      <span className="font-bold">{title}</span> — {description}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg">
                  When scores are close: most Equitable build wins first, then
                  Scalability, then People&apos;s Choice.
                </p>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="mt-8 w-full rounded-full bg-white px-6 py-3 text-base font-bold tracking-[-0.03em] text-[#13450E] hover:opacity-90 sm:text-lg"
                  >
                    Close
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </li>
        <li>
          <a
            href={SUBMISSION_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2 hover:text-white/80"
          >
            SUBMIT YOUR PROJECT HERE
          </a>
        </li>
      </ul>
    </div>
  );
}
