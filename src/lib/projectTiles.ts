export type ProjectCategory = "Projects" | "Learn" | "News";

export type ProjectTile = {
  caption: string;
  title: string;
  person: string;
  category: ProjectCategory;
};

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Projects",
  "Learn",
  "News",
];

export const PROJECT_TILES: ProjectTile[] = [
  {
    caption: "Toolkit, docs & onboarding flows",
    title: "Builder starter kit",
    person: "Jordan Mills",
    category: "Projects",
  },
  {
    caption: "Gatherings, salons & town halls",
    title: "Community calendar",
    person: "Sam Rivera",
    category: "Projects",
  },
  {
    caption: "Briefings toward #2036",
    title: "Research archive",
    person: "Taylor Brooks",
    category: "Learn",
  },
  {
    caption: "Partnerships & pilots",
    title: "Residency program",
    person: "Morgan Lee",
    category: "News",
  },
];
