"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M19.8055 10.2292C19.8055 9.55015 19.7501 8.86682 19.6319 8.19904H10.2V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7175 15.8449 19.8055 13.2728 19.8055 10.2292Z"
        fill="#4285F4"
      />
      <path
        d="M10.2 20.0006C12.8934 20.0006 15.1612 19.1151 16.8288 17.5865L13.6062 15.0879C12.7096 15.6979 11.5478 16.0434 10.2037 16.0434C7.59675 16.0434 5.38967 14.2834 4.59976 11.9165H1.27539V14.4923C3.00135 17.8691 6.43041 20.0006 10.2 20.0006Z"
        fill="#34A853"
      />
      <path
        d="M4.59605 11.9165C4.16605 10.6746 4.16605 9.32986 4.59605 8.08794V5.51221H1.27537C-0.165124 8.33794 -0.165124 11.6665 1.27537 14.4923L4.59605 11.9165Z"
        fill="#FBBC04"
      />
      <path
        d="M10.2 3.95805C11.6246 3.93555 13.0004 4.47105 14.0367 5.45305L16.8917 2.60155C15.0754 0.904553 12.6816 -0.0316971 10.2 0.000552898C6.43041 0.000552898 3.00135 2.13205 1.27539 5.51214L4.59607 8.08787C5.38229 5.71637 7.59306 3.95805 10.2 3.95805Z"
        fill="#EA4335"
      />
    </svg>
  );
}

const shell =
  "min-h-dvh w-full px-6 py-12 pb-28 pt-[calc(112px+max(28px,env(safe-area-inset-top)))] md:pb-36 md:pt-[calc(120px+max(28px,env(safe-area-inset-top)))]";

const fieldBase =
  "w-full rounded-md border border-neutral-300 bg-neutral-50 px-4 text-neutral-900 shadow-sm placeholder:text-neutral-500 focus:border-transparent focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-navbar";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className={`${shell} flex items-center justify-center bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]`}>
          <p className="font-mono text-sm text-white">Loading…</p>
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}

function SignInPageContent() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_url") ?? "/dashboard";
  const ssoCallback = `/sso-callback?redirect_url=${encodeURIComponent(redirectTo)}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const router = useRouter();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");

    if (!showPasswordStep) {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
      setShowPasswordStep(true);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTo);
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string }> };
      setError(clerkErr.errors?.[0]?.message ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded || googleLoading) return;

    setGoogleLoading(true);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: ssoCallback,
        redirectUrlComplete: ssoCallback,
      });
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string }> };
      setError(
        clerkErr.errors?.[0]?.message ?? "Failed to sign in with Google",
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className={`${shell} flex items-center justify-center bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]`}
    >
      <div className="flex w-full max-w-md flex-col items-stretch">
        <div className="w-full">
          {/* <div className="flex items-center">
            <Image
              src="/icon.svg"
              alt=""
              width={40}
              height={40}
              className="h-9 w-auto sm:h-10"
              priority
              unoptimized
            />
          </div> */}

          <div className="mt-10 mb-8 lg:mt-14 text-center">
            <h1 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_1px_24px_rgba(0,0,0,0.15)] md:text-6xl lg:text-[3.35rem]">
              Sign in &amp; build.
            </h1>
            <p className="mt-5 font-mono text-sm uppercase tracking-wide leading-relaxed text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.12)]">
              The Hopamine Network.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-[0_28px_80px_rgba(0,0,0,0.12)] md:p-9">
            {error ? (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 font-mono text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleGoogleSignIn()}
              disabled={!isLoaded || googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-neutral-200 bg-neutral-50 py-3.5 pl-5 pr-4 font-inter text-[1.0625rem] font-semibold text-neutral-900 shadow-sm transition hover:border-neutral-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
            >
              {googleLoading ? (
                <>
                  <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
                  <span className="animate-pulse leading-none">
                    Opening Google…
                  </span>
                </>
              ) : (
                <>
                  <GoogleMark className="shrink-0" />
                  <span className="leading-none">Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative mb-6 mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 font-mono text-neutral-500">
                  OR
                </span>
              </div>
            </div>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="sr-only">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(ev) => {
                    setEmail(ev.target.value);
                    if (showPasswordStep) {
                      setShowPasswordStep(false);
                      setPassword("");
                    }
                  }}
                  placeholder="Enter your email"
                  required
                  className={`${fieldBase} py-3 font-inter text-lg md:py-[0.7rem]`}
                />
              </div>

              {showPasswordStep ? (
                <div className="space-y-2">
                  <label
                    htmlFor="signin-password"
                    className="font-mono text-sm font-medium text-neutral-800"
                  >
                    Password
                  </label>
                  <input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`${fieldBase} py-3 font-mono text-sm md:text-base`}
                  />
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full rounded-lg bg-accent-navbar py-3 px-4 font-inter text-[1.0625rem] font-semibold text-white shadow-md transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
              >
                {loading ? "Signing in…" : "Continue"}
              </button>
            </form>

            <p className="mt-6 text-center font-mono text-sm text-neutral-600">
              Don&apos;t have an account?{" "}
              <Link
                href={
                  redirectTo.startsWith("/claim")
                    ? `/sign-up?redirect_url=${encodeURIComponent(redirectTo)}`
                    : "/sign-up"
                }
                className="font-semibold text-accent-navbar underline decoration-accent-navbar/40 underline-offset-4 transition hover:brightness-[1.05]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
