export default function Home() {
  return (
    <>
      <div className="relative z-0 w-full shrink-0 overflow-hidden bg-accent-navbar max-md:fixed max-md:inset-0 max-md:z-0 md:relative md:inset-auto md:h-[65vh] md:min-h-[220px] md:bg-transparent">
        <video
          className="absolute inset-0 z-0 h-full w-full bg-accent-navbar object-cover object-[30%_center] max-md:[clip-path:inset(5%_0_0_0)] max-md:translate-y-[-5%] md:translate-y-0 md:[clip-path:none] md:object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="/Still_Video_of_Object_in_Breeze.mp4"
            type="video/mp4"
          />
        </video>
        <div
          className="pointer-events-none absolute inset-0 max-md:bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_28%,transparent_42%,rgba(0,166,243,0.42)_62%,rgba(0,166,243,0.88)_82%,#00a6f3_100%)] md:bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(0,166,243,0.06)_26%,rgba(0,166,243,0.2)_48%,rgba(0,166,243,0.58)_72%,#00a6f3_92%,#00a6f3_100%)]"
          aria-hidden
        />
      </div>

      <main className="relative z-10 m-0 flex flex-1 flex-col bg-accent-navbar text-white max-md:min-h-dvh max-md:justify-end max-md:bg-transparent md:min-h-0 md:justify-start">
        <div className="mx-4 flex max-w-full flex-col items-start px-0 pb-12 pt-4 text-left max-md:pb-10 max-md:pt-8 sm:mx-[20px] md:pb-20 md:pt-7">
          <div className="w-full max-w-7xl">
            <h1 className="wrap-break-word text-4xl leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.06] md:text-7xl md:leading-[1.05]">
              Building a hopeful future for #2036
            </h1>
            <p className="mt-2 max-w-xl text-lg leading-relaxed text-white/90 sm:mt-3 sm:text-xl md:mt-3 md:text-2xl">
              For builders to gather & build a brighter future for all.
            </p>
            <div className="mt-3 flex w-full max-w-xl flex-row flex-nowrap gap-2 sm:mt-4 sm:gap-3">
              <a
                href="https://discord.gg/ESymdPMhCD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center border-2 border-white bg-white px-3 py-3 font-mono text-xs font-medium uppercase tracking-wide text-accent-navbar transition-opacity hover:opacity-90 sm:px-6 sm:text-sm md:px-8 md:py-3.5 md:text-sm"
              >
                Join the Movement
              </a>
              <a
                href="/001"
                className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center border-2 border-white bg-accent-navbar px-3 py-3 font-mono text-xs font-medium uppercase tracking-wide text-white transition-opacity hover:bg-white/15 sm:px-6 sm:text-sm md:px-8 md:py-3.5 md:text-sm"
              >
                Buy Tickets
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
