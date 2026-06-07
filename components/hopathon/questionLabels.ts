export type LabelSize = "default" | "wide" | "multiline";

export type QuestionLabelDef = {
  src: string;
  alt: string;
  size: LabelSize;
  width: number;
  height: number;
};

/** Order matches form steps 0–11 */
export const QUESTION_LABELS: QuestionLabelDef[] = [
  {
    src: "/hopathon/questions/your-name.svg",
    alt: "Your Name?",
    size: "default",
    width: 162,
    height: 28,
  },
  {
    src: "/hopathon/questions/your-discord-handle.svg",
    alt: "Your discord handle?",
    size: "default",
    width: 262,
    height: 30,
  },
  {
    src: "/hopathon/questions/email.svg",
    alt: "Email?",
    size: "default",
    width: 84,
    height: 29,
  },
  {
    src: "/hopathon/questions/phone-number.svg",
    alt: "Phone Number?",
    size: "default",
    width: 208,
    height: 29,
  },
  {
    src: "/hopathon/questions/timezone-city.svg",
    alt: "Time zone / city?",
    size: "multiline",
    width: 312,
    height: 65,
  },
  {
    src: "/hopathon/questions/are-you-a-developer.svg",
    alt: "Are you a developer?",
    size: "wide",
    width: 273,
    height: 36,
  },
  {
    src: "/hopathon/questions/specific-skills.svg",
    alt: "What are your specific skills?",
    size: "wide",
    width: 340,
    height: 36,
  },
  {
    src: "/hopathon/questions/have-an-idea.svg",
    alt: "Do you already have an idea?",
    size: "wide",
    width: 353,
    height: 36,
  },
  {
    src: "/hopathon/questions/teams-or-solo.svg",
    alt: "Team or solo?",
    size: "default",
    width: 181,
    height: 29,
  },
  {
    src: "/hopathon/questions/your-commitment.svg",
    alt: "Your commitment.",
    size: "default",
    width: 266,
    height: 28,
  },
  {
    src: "/hopathon/questions/find-in-teammate.svg",
    alt: "What are you hoping to find in a team-mate?",
    size: "multiline",
    width: 352,
    height: 58,
  },
  {
    src: "/hopathon/questions/looking-to-build.svg",
    alt: "What are you looking to build?",
    size: "multiline",
    width: 302,
    height: 58,
  },
];

export const FORM_ASSET_PRELOADS = [
  "/hopathon/the-green-hackathon.svg",
  "/hopathon/questions/your-name.svg",
] as const;
