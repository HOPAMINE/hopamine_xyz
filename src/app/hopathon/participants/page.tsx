import { SubmitInfoCard } from "../../../../components/hopathon/SubmitInfoCard";
import { HackathonScheduleCard } from "../../../../components/hopathon/HackathonScheduleCard";
import { HopathonParticipantsNavbar } from "../../../../components/hopathon/HopathonParticipantsNavbar";
import { SubmissionDeadlineCountdown } from "../../../../components/hopathon/SubmissionDeadlineCountdown";
import { PROJECT_DIRECTORY_URL } from "../../../../components/hopathon/hackathonSchedule";
import { hopathonCardClassName } from "../../../../components/hopathon/hopathonStyles";

const cardClassName = hopathonCardClassName;

export default function HopathonParticipantsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#13450E]">
      <HopathonParticipantsNavbar />

      <div className="w-full bg-white px-4 py-3 text-center text-xs font-bold text-black sm:text-sm">
        THE DEADLINE FOR SUBMISSION IS JUNE 14TH @ 11PM EST
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 text-white max-lg:pb-6">
        <p className="text-center text-sm font-bold leading-snug sm:text-base">
          Welcome Participants to the 🌱 GREEN HACKATHON — HERE&apos;S THE
          MAIN INFORMATION YOU NEED TO KNOW
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:flex lg:flex-row lg:gap-3">
          <SubmitInfoCard />

          <HackathonScheduleCard />

          <div className={cardClassName}>
            <p className="mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl">
              WHAT TO SUBMIT
            </p>
            <p className="mb-3 text-sm leading-relaxed">
              Your 90-second Loom pitch should include:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed sm:space-y-3">
              <li>A full visual + verbal walkthrough of your demo</li>
              <li>The problem you&apos;re solving</li>
              <li>
                How you plan to solve it at scale (or locally, if that&apos;s
                by design)
              </li>
              <li>
                A brief written description: startup name, solution, and
                application
              </li>
            </ul>
          </div>

          <div className={cardClassName}>
            <p className="mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl">
              PRIZES &amp; RECOGNITION
            </p>
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-bold">🏆 Grand Prize</p>
                <p className="mt-2">
                  We campaign your build to its first 10,000 users + Hopamine
                  episode feature + warm intro + Addition Discord Permissions
                </p>
              </div>
              <div>
                <p className="font-bold">🏆 People&apos;s Choice</p>
                <p className="mt-2">
                  Newsletter spotlight + featured role + social media shout out
                </p>
              </div>
              <p className="text-white/80">
                Browse projects in the{" "}
                <a
                  href={PROJECT_DIRECTORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline underline-offset-2 hover:text-white"
                >
                  project directory
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <SubmissionDeadlineCountdown />
    </div>
  );
}
