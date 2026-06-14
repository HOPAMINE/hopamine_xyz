import { SubmitInfoCard } from "../../../../components/hopathon/SubmitInfoCard";
import { HackathonScheduleCard } from "../../../../components/hopathon/HackathonScheduleCard";
import { HopathonParticipantsNavbar } from "../../../../components/hopathon/HopathonParticipantsNavbar";
import { HopathonParticipantsScrollLock } from "../../../../components/hopathon/HopathonParticipantsScrollLock";
import { SubmissionDeadlineCountdown } from "../../../../components/hopathon/SubmissionDeadlineCountdown";
import { PROJECT_DIRECTORY_URL } from "../../../../components/hopathon/hackathonSchedule";
import {
  hopathonCardClassName,
  hopathonPanelClassName,
} from "../../../../components/hopathon/hopathonStyles";

const cardClassName = hopathonCardClassName;

export default function HopathonParticipantsPage() {
  return (
    <HopathonParticipantsScrollLock>
      <div className="flex min-h-dvh flex-col bg-[#13450E] lg:h-dvh lg:max-h-dvh lg:min-h-0 lg:overflow-hidden">
        <HopathonParticipantsNavbar />

        <div className="flex flex-1 flex-col text-white max-lg:pb-6 lg:min-h-0 lg:overflow-hidden">
          <div className="flex flex-1 flex-col gap-4 px-4 pb-6 sm:px-5 lg:min-h-0 lg:gap-2 lg:px-4 lg:pb-2 xl:gap-3 xl:px-5">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:min-h-0">
              <p
                className={`shrink-0 px-4 py-3 text-center text-xs font-bold leading-snug sm:text-sm lg:py-2 lg:text-[0.7rem] xl:text-xs ${hopathonPanelClassName}`}
              >
                THE DEADLINE FOR SUBMISSION IS JUNE 14TH @ 11PM EST
              </p>

              <p className="mt-4 shrink-0 text-center text-sm font-bold leading-snug sm:mt-5 sm:text-base lg:mt-2 lg:text-xs xl:mt-3 xl:text-sm">
                Welcome Participants to the 🌱 GREEN HACKATHON — HERE&apos;S
                THE MAIN INFORMATION YOU NEED TO KNOW
              </p>

              <div className="mt-4 grid flex-1 grid-cols-1 gap-3 sm:mt-5 md:grid-cols-2 lg:mt-2 lg:min-h-0 lg:grid-cols-4 lg:gap-2 lg:overflow-hidden xl:mt-3 xl:gap-3">
                <SubmitInfoCard />

                <HackathonScheduleCard />

                <div className={cardClassName}>
                  <p className="mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl lg:mb-2 lg:text-base xl:text-xl">
                    WHAT TO SUBMIT
                  </p>
                  <p className="mb-3 text-sm leading-relaxed lg:mb-2 lg:text-xs xl:text-sm">
                    Your 90-second Loom pitch should include:
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed sm:space-y-3 lg:space-y-1.5 lg:text-xs xl:space-y-2 xl:text-sm">
                    <li>A full visual + verbal walkthrough of your demo</li>
                    <li>The problem you&apos;re solving</li>
                    <li>
                      How you plan to solve it at scale (or locally, if
                      that&apos;s by design)
                    </li>
                    <li>
                      A brief written description: startup name, solution, and
                      application
                    </li>
                  </ul>
                </div>

                <div className={cardClassName}>
                  <p className="mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl lg:mb-2 lg:text-base xl:text-xl">
                    PRIZES &amp; RECOGNITION
                  </p>
                  <div className="space-y-4 text-sm leading-relaxed lg:space-y-2 lg:text-xs xl:space-y-3 xl:text-sm">
                    <div>
                      <p className="font-bold">🏆 Grand Prize</p>
                      <p className="mt-2 lg:mt-1">
                        We campaign your build to its first 10,000 users +
                        Hopamine episode feature + warm intro + Addition
                        Discord Permissions
                      </p>
                    </div>
                    <div>
                      <p className="font-bold">🏆 People&apos;s Choice</p>
                      <p className="mt-2 lg:mt-1">
                        Newsletter spotlight + featured role + social media
                        shout out
                      </p>
                    </div>
                    <p className="text-white/80">
                      Browse  projects in the{" "}
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
          </div>

          <SubmissionDeadlineCountdown />
        </div>
      </div>
    </HopathonParticipantsScrollLock>
  );
}
