export type EventItem = {
  id: string;
  title: string;
  date: string;
  format?: "In person" | "Online";
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  href?: string;
};

export const PAST_EVENTS: EventItem[] = [
  {
    id: "ecological-gathering",
    title: "Hopamine Eco-Tech Gathering",
    date: "April 25 · 6 PM EST",
    format: "In person",
    imageSrc: "/event/event.png",
    imageWidth: 612,
    imageHeight: 792,
  },
  {
    id: "green-hackathon",
    title: "The Green Hackathon",
    date: "June 13 · 11 AM EST",
    format: "Online",
    imageSrc: "/event/event2.png",
    imageWidth: 612,
    imageHeight: 792,
    href: "/hopathon",
  },
];
