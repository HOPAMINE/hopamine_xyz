"use client";

import { useSignUp } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AuthCard,
  AuthErrorBanner,
  GoogleButton,
  OrDivider,
  authFieldBase,
  authSubmitButton,
} from "@/components/AuthUI";

/**
 * Custom sign-up card — same presentation as the sign-in card (shared via
 * AuthUI), wired to Clerk's `useSignUp`. Email/password sign-up requires an
 * email verification-code step, which is the one piece sign-in doesn't have.
 *
 * `destination` is where to land after a completed sign-up (e.g. /onboard).
 */
export function SignUpForm({ destination }: { destination: string }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const ssoCallback = `/sso-callback?redirect_url=${encodeURIComponent(destination)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.create({ emailAddress: email, password });

      // Some instances complete immediately (no email verification required).
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(destination);
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ code?: string; message?: string }> };
      const firstError = clerkErr.errors?.[0];
      if (firstError?.code === "form_identifier_exists") {
        setError("An account with that email already exists. Try signing in.");
      } else {
        setError(firstError?.message ?? "Couldn't create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(destination);
      } else {
        setError("That code didn't work. Please try again.");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string }> };
      setError(clerkErr.errors?.[0]?.message ?? "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded || googleLoading) return;

    setGoogleLoading(true);
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: ssoCallback,
        redirectUrlComplete: ssoCallback,
      });
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string }> };
      setError(clerkErr.errors?.[0]?.message ?? "Failed to continue with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthCard>
      {error ? <AuthErrorBanner message={error} /> : null}

      {step === "verify" ? (
        <form onSubmit={(e) => void handleVerify(e)} className="space-y-4">
          <p className="font-mono text-sm text-neutral-600">
            We sent a verification code to{" "}
            <span className="font-semibold text-neutral-900">{email}</span>.
          </p>
          <div className="space-y-2">
            <label
              htmlFor="signup-code"
              className="font-mono text-sm font-medium text-neutral-800"
            >
              Verification code
            </label>
            <input
              id="signup-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(ev) => setCode(ev.target.value)}
              placeholder="Enter the code"
              required
              className={`${authFieldBase} py-3 font-mono text-base tracking-[0.3em]`}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isLoaded}
            className={authSubmitButton}
          >
            {loading ? "Verifying…" : "Verify & continue"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCode("");
              setError("");
            }}
            className="w-full text-center font-mono text-sm text-neutral-500 underline underline-offset-4 transition hover:text-neutral-800"
          >
            Use a different email
          </button>
        </form>
      ) : (
        <>
          <GoogleButton
            loading={googleLoading}
            disabled={!isLoaded || googleLoading}
            onClick={() => void handleGoogleSignUp()}
          />

          <OrDivider />

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="signup-email"
                className="font-mono text-sm font-medium text-neutral-800"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="Enter your email"
                required
                className={`${authFieldBase} py-3 font-mono text-sm md:text-base`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signup-password"
                className="font-mono text-sm font-medium text-neutral-800"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Create a password"
                required
                className={`${authFieldBase} py-3 font-mono text-sm md:text-base`}
              />
            </div>

            {/* Clerk renders its bot/CAPTCHA challenge here when required. */}
            <div id="clerk-captcha" />

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className={authSubmitButton}
            >
              {loading ? "Creating account…" : "Continue"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center font-mono text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-accent-navbar underline decoration-accent-navbar/40 underline-offset-4 transition hover:brightness-[1.05]"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
