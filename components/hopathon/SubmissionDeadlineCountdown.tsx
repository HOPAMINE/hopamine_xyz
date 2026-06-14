"use client";

import { useEffect, useState } from "react";
import {
  formatEasternTime,
  formatLocalTime,
  getCountdownParts,
  getUserTimezoneLabel,
  HACKATHON_MILESTONES,
  padTimeUnit,
} from "./hackathonSchedule";
import { hopathonCountdownUnitClassName } from "./hopathonStyles";

const submissionDeadline = HACKATHON_MILESTONES.find(
  (milestone) => milestone.id === "submission",
)!.instant;

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className={hopathonCountdownUnitClassName}>
      <span className="text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl lg:text-2xl xl:text-3xl">
        {value}
      </span>
      <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white/60 sm:text-xs lg:text-[0.6rem] xl:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}

export function SubmissionDeadlineCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const parts =
    now === null ? null : getCountdownParts(submissionDeadline, now);
  const localDeadline = formatLocalTime(submissionDeadline);
  const easternDeadline = formatEasternTime(submissionDeadline);
  const timezoneLabel = getUserTimezoneLabel();

  return (
    <section className="shrink-0 border-t border-white/25 bg-[#13450E] px-5 py-8 text-white max-lg:pb-[max(2rem,env(safe-area-inset-bottom))] lg:py-4 xl:py-5">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/70 lg:text-xs xl:text-sm">
          Submission deadline
        </p>

        {now === null ? (
          <div className="mt-6 flex gap-3 sm:gap-4 lg:mt-3 lg:gap-2 xl:mt-4 xl:gap-3">
            {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
              <CountdownUnit key={label} value="--" label={label} />
            ))}
          </div>
        ) : parts ? (
          <>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 lg:mt-3 lg:gap-2 xl:mt-4 xl:gap-3">
              <CountdownUnit
                value={padTimeUnit(parts.days)}
                label="Days"
              />
              <CountdownUnit
                value={padTimeUnit(parts.hours)}
                label="Hours"
              />
              <CountdownUnit
                value={padTimeUnit(parts.minutes)}
                label="Minutes"
              />
              <CountdownUnit
                value={padTimeUnit(parts.seconds)}
                label="Seconds"
              />
            </div>
            <p className="mt-6 text-base font-semibold leading-relaxed text-white sm:text-lg lg:mt-2 lg:text-sm xl:mt-3 xl:text-base">
              {localDeadline}
            </p>
            <p className="mt-1 text-sm text-white/70 lg:text-xs xl:text-sm">
              Shown in your timezone ({timezoneLabel})
            </p>
            <p className="mt-3 text-sm text-white/55 lg:mt-1 lg:text-xs xl:mt-2 xl:text-sm">
              Official deadline: {easternDeadline} ET
            </p>
          </>
        ) : (
          <>
            <p className="mt-6 text-xl font-bold text-white sm:text-2xl">
              Submission deadline has passed
            </p>
            <p className="mt-3 text-sm text-white/70">
              Closed {localDeadline} ({timezoneLabel})
            </p>
            <p className="mt-2 text-sm text-white/55">
              Official deadline was {easternDeadline} ET
            </p>
          </>
        )}
      </div>
    </section>
  );
}
