"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import {
  AuthCard,
  AuthErrorBanner,
  AuthHeading,
  GoogleButton,
  OrDivider,
  authFieldBase,
  authGradient,
  authShell,
  authSubmitButton,
} from "@/components/AuthUI";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className={`${authShell} flex items-center justify-center ${authGradient}`}>
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
      const clerkErr = err as { errors?: Array<{ code?: string; message?: string }> };
      const firstError = clerkErr.errors?.[0];
      // No account exists for this email — guide them to sign up instead of
      // showing a generic "invalid credentials" message.
      if (firstError?.code === "form_identifier_not_found") {
        setError("No account found for that email. Please sign up first.");
      } else {
        setError(firstError?.message ?? "Invalid email or password");
      }
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
    <div className={`${authShell} flex items-center justify-center ${authGradient}`}>
      <div className="flex w-full max-w-md flex-col items-stretch">
        <div className="w-full">
          <AuthHeading title="Sign in & build." />

          <AuthCard>
            {error ? <AuthErrorBanner message={error} /> : null}

            <GoogleButton
              loading={googleLoading}
              disabled={!isLoaded || googleLoading}
              onClick={() => void handleGoogleSignIn()}
            />

            <OrDivider />

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
                  className={`${authFieldBase} py-3 font-inter text-lg md:py-[0.7rem]`}
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
                    className={`${authFieldBase} py-3 font-mono text-sm md:text-base`}
                  />
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className={authSubmitButton}
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
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
