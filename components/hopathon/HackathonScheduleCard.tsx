"use client";

import { JudgesDialog } from "./JudgesDialog";
import { hopathonCardClassName } from "./hopathonStyles";

export function HackathonScheduleCard() {
  return (
    <div className={hopathonCardClassName}>
      <p className="mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl">
        HACKATHON SCHEDULE
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed sm:space-y-3">
        <li>June 14th @ 11PM EST — Submission Deadline</li>
        <li>June 15th @ 11PM EST — Live Demos</li>
        <li>
          June 15th – June 19th — Period where the{" "}
          <JudgesDialog triggerLabel="judges will be reviewing their work" />
        </li>
        <li>June 19th @ 7PM EST — Winner Announcement</li>
      </ul>
    </div>
  );
}
