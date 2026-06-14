/** All official hackathon milestones are defined in US Eastern Time. */
export const HACKATHON_TIMEZONE = "America/New_York";

export const PROJECT_DIRECTORY_URL =
  "https://www.hopamine.xyz/public/hackathon-directory.html";

export const SUBMISSION_FORM_URL =
  "https://form.jotform.com/261638211093049";

export type HackathonMilestoneId =
  | "submission"
  | "live-demos"
  | "winner";

export type HackathonMilestone = {
  id: HackathonMilestoneId;
  /** Instant in UTC — derived from America/New_York wall time. */
  instant: Date;
  emoji: string;
  headline: string;
  cardTitle: string;
  details: string[];
  emphasized?: boolean;
};

/** June 14–19, 2026 — The Green Hackathon judging timeline. */
export const HACKATHON_MILESTONES: HackathonMilestone[] = [
  {
    id: "submission",
    instant: new Date("2026-06-15T03:00:00.000Z"), // Jun 14, 11:00 PM EDT
    emoji: "⏳",
    headline: "Submission Deadline",
    cardTitle: "Submit Your Project",
    emphasized: true,
    details: [
      "Deadline locked at 11:00 PM ET on June 14th — unchanged.",
      "Upload your 90-second Loom pitch via the submission form below.",
      "Include startup name, solution summary, and application description.",
    ],
  },
  {
    id: "live-demos",
    instant: new Date("2026-06-16T03:00:00.000Z"), // Jun 15, 11:00 PM EDT
    emoji: "🎥",
    headline: "Live Demos",
    cardTitle: "90-Second Live Presentations",
    details: [
      "Monday, June 15th at 11:00 PM ET.",
      "Each project gets 90 seconds in front of judges and the network.",
      "Full visual + verbal walkthrough of your demo.",
    ],
  },
  {
    id: "winner",
    instant: new Date("2026-06-19T23:00:00.000Z"), // Jun 19, 7:00 PM EDT
    emoji: "🏆",
    headline: "Winner Announcement",
    cardTitle: "Official Results",
    details: [
      "Friday, June 19th at 7:00 PM ET.",
      "Top ideas and first place featured on Hopamine + Coffee Jesus.",
      "First place gets final polish for the scaling campaign.",
    ],
  },
];

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
};

export function formatLocalTime(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, dateTimeOptions).format(date);
}

export function formatEasternTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    ...dateTimeOptions,
    timeZone: HACKATHON_TIMEZONE,
  }).format(date);
}

export function getUserTimezoneLabel(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
  } catch {
    return "Local time";
  }
}

export type MilestonePhase = "upcoming" | "current" | "completed";

export function getMilestonePhase(
  now: number,
  index: number,
  milestones: HackathonMilestone[] = HACKATHON_MILESTONES,
): MilestonePhase {
  const milestone = milestones[index];
  if (!milestone) return "upcoming";

  const eventTime = milestone.instant.getTime();
  if (now >= eventTime) {
    return "completed";
  }

  const previousTime = milestones[index - 1]?.instant.getTime() ?? 0;
  if (now >= previousTime) {
    return "current";
  }

  return "upcoming";
}

export function getActiveMilestoneIndex(
  now: number,
  milestones: HackathonMilestone[] = HACKATHON_MILESTONES,
): number {
  for (let i = 0; i < milestones.length; i++) {
    if (getMilestonePhase(now, i, milestones) === "current") {
      return i;
    }
  }
  return milestones.length - 1;
}

export function getCountdownParts(
  target: Date,
  now: number,
): { days: number; hours: number; minutes: number; seconds: number } | null {
  const diff = target.getTime() - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function padTimeUnit(value: number): string {
  return value.toString().padStart(2, "0");
}
