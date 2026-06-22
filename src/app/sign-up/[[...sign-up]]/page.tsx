import { SignUpPanel } from "../SignUpPanel";

const shell =
  "min-h-dvh w-full px-6 py-12 pb-28 pt-[calc(112px+max(28px,env(safe-area-inset-top)))] md:pb-36 md:pt-[calc(120px+max(28px,env(safe-area-inset-top)))]";

export default function SignUpPage() {
  return (
    <div
      className={`${shell} flex items-center justify-center bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]`}
    >
      <div className="flex w-full max-w-md flex-col items-stretch">
        <div className="mt-10 mb-8 lg:mt-14 text-center">
          <h1 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_1px_24px_rgba(0,0,0,0.15)] md:text-6xl lg:text-[3.35rem]">
            Sign up &amp; build.
          </h1>
          <p className="mt-5 font-mono text-sm uppercase tracking-wide leading-relaxed text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.12)]">
            The Hopamine Network.
          </p>
        </div>
        <SignUpPanel />
      </div>
    </div>
  );
}
