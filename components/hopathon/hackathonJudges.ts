export type HackathonJudge = {
  name: string;
  role: string;
  handle: string;
};

export const HACKATHON_JUDGES: HackathonJudge[] = [
  {
    name: "Aiman Naqvi",
    role: "AI Safety Advocate",
    handle: "@nuancedaiman",
  },
  {
    name: "Kristy Drutman",
    role: "Founder, Green Jobs Board",
    handle: "@browngirl_green",
  },
  {
    name: "Christopher Tavolazzi (Coffee Jesus)",
    role: "Founder, Johny Autoseed",
    handle: "@thecoffeejesus",
  },
];

export function formatJudgeLine(judge: HackathonJudge): string {
  return `${judge.name} · ${judge.role} · ${judge.handle}`;
}
