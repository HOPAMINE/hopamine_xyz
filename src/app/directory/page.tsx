import { PORTAL_MAIN_PAD } from "@/lib/layoutConstants";

export default function DirectoryPage() {
  return (
    <main className={`flex min-h-dvh w-full flex-col ${PORTAL_MAIN_PAD} pb-16 md:pb-24`}>
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="text-center font-serif text-4xl tracking-[-0.04em] text-accent-navbar sm:text-5xl md:text-6xl">
          Coming soon
        </p>
      </div>
    </main>
  );
}
