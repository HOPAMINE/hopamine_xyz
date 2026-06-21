import Image from "next/image";
import Link from "next/link";
import { robotoFlex, robotoMono } from "../../../fonts";
import {
  NAV_ALIGN_PAD,
} from "@/lib/layoutConstants";
import { PAST_EVENTS, type EventItem } from "@/lib/events";

function EventCard({ event }: { event: EventItem }) {
  const card = (
    <article className="flex min-w-0 flex-col">
      <Image
        src={event.imageSrc}
        alt={event.title}
        width={event.imageWidth}
        height={event.imageHeight}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="h-auto w-full bg-neutral-100 object-contain"
      />
      <div className={`${robotoFlex.className} mt-3 text-white`}>
        <h3 className="text-sm font-semibold leading-snug sm:text-base">{event.title}</h3>
        <p className="mt-1 text-xs font-medium text-white/90 sm:text-sm">{event.date}</p>
        {event.format ? (
          <p
            className={`${robotoMono.className} mt-1 text-xs font-medium text-white/90 sm:text-sm`}
          >
            {event.format}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (event.href) {
    return (
      <Link href={event.href} className="block min-w-0">
        {card}
      </Link>
    );
  }

  return card;
}

export default function EventsPage() {
  return (
    <main
      className={`relative min-h-dvh w-full bg-accent-events pb-16 pt-28 text-white md:pb-24 md:pt-32 ${NAV_ALIGN_PAD}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="max-w-2xl">
          <h1
            className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl`}
          >
            Events
          </h1>
          <p className={`${robotoFlex.className} mt-3 text-base text-white/90 sm:text-lg`}>
            Gatherings, hackathons, and meetups for eco-tech builders.
          </p>
        </header>

        <section className="mt-6" aria-labelledby="past-events-heading">
          <h2
            id="past-events-heading"
            className={`${robotoFlex.className} mb-5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl`}
          >
            Past events
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {PAST_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
