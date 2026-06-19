import { PORTAL_MAIN_PAD } from "@/lib/layoutConstants";
import { robotoFlex } from "../../../fonts";

export default function HomePage() {
  return (
    <main
      className={`min-h-dvh w-full ${PORTAL_MAIN_PAD} pb-16 md:pb-24`}
    >
      <div className="mx-auto max-w-3xl">
        <h1
          className={`${robotoFlex.className} text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl md:text-5xl`}
        >
          Welcome back
        </h1>
        <p className={`${robotoFlex.className} mt-3 text-base text-white/90 sm:text-lg`}>
          Explore projects, connect with people, and build toward a brighter future.
        </p>
      </div>
    </main>
  );
}
