import Image from "next/image";
import { SUBMISSION_FORM_URL } from "./hackathonSchedule";

export function HopathonParticipantsNavbar() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-2 p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Image
        src="/hopathon/the-green-hackathon.svg"
        alt="The Green Hackathon"
        width={120}
        height={120}
        className="h-auto w-[min(52vw,120px)] sm:w-[120px]"
      />
      <a
        href={SUBMISSION_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:opacity-90 sm:text-base"
      >
        Submit Your Project
      </a>
    </div>
  );
}
