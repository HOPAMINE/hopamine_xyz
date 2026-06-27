"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

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

const gradient =
  "bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]";

const fieldBase =
  "w-full rounded-md border border-neutral-300 bg-neutral-50 px-4 text-neutral-900 shadow-sm placeholder:text-neutral-500 focus:border-transparent focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-navbar";

const submitButton =
  "w-full rounded-lg bg-accent-navbar py-3 px-4 font-inter text-[1.0625rem] font-semibold text-white shadow-md transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-50 md:text-lg";

const linkButton =
  "font-semibold text-accent-navbar underline decoration-accent-navbar/40 underline-offset-4 transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-50";

const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type ClerkError = { errors?: Array<{ code?: string; message?: string }> };

/**
 * Translate Clerk's raw error codes into human, on-brand copy. Falls back to
 * Clerk's own message, then a generic line, so we never surface an empty error.
 */
function friendlyClerkError(err: unknown, fallback: string): string {
  const first = (err as ClerkError).errors?.[0];
  switch (first?.code) {
    case "form_identifier_not_found":
      return "No account found for that email.";
    case "form_code_incorrect":
    case "verification_failed":
      return "That code isn't right. Double-check it and try again.";
    case "verification_expired":
      return "That code has expired. Request a new one below.";
    case "form_password_pwned":
      return "That password showed up in a data breach. Please choose a different one.";
    case "form_password_length_too_short":
      return "Use at least 8 characters for your new password.";
    default:
      return first?.message ?? fallback;
  }
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className={`${shell} flex items-center justify-center ${gradient}`}>
          <p className="font-mono text-sm text-white">Loading…</p>
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}

type Mode = "signin" | "forgot";
type ForgotStep = "email" | "code";

function SignInPageContent() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_url") ?? "/dashboard";
  const ssoCallback = `/sso-callback?redirect_url=${encodeURIComponent(redirectTo)}`;
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");

  // `email` is shared across sign-in and reset so users never retype it.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Resend cooldown so a code can be re-sent without hammering Clerk.
  const [resendIn, setResendIn] = useState(0);
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTo);
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err: unknown) {
      setError(friendlyClerkError(err, "Invalid email or password"));
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
      setError(friendlyClerkError(err, "Failed to sign in with Google"));
      setGoogleLoading(false);
    }
  };

  const enterForgot = () => {
    setError("");
    setMode("forgot");
    setForgotStep("email");
  };

  const backToSignIn = () => {
    setError("");
    setMode("signin");
    setForgotStep("email");
    setCode("");
    setNewPassword("");
    setShowNewPassword(false);
  };

  // Send (or resend) the 6-digit reset code. Clerk's `create` with the
  // reset_password_email_code strategy both starts the reset and emails the code.
  const sendResetCode = async () => {
    if (!isLoaded) return false;
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setResendIn(30);
      return true;
    } catch (err: unknown) {
      setError(friendlyClerkError(err, "Couldn't send a reset code. Try again."));
      return false;
    }
  };

  const handleSendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const ok = await sendResetCode();
    setLoading(false);
    if (ok) setForgotStep("code");
  };

  const handleResend = async () => {
    if (resendIn > 0 || loading) return;
    setError("");
    await sendResetCode();
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    if (code.trim().length < 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    if (newPassword.length < 8) {
      setError("Use at least 8 characters for your new password");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTo);
      } else if (result.status === "needs_second_factor") {
        setError(
          "Your account has two-factor enabled. Finish signing in from the sign-in screen.",
        );
      } else {
        setError("Couldn't reset your password. Please try again.");
      }
    } catch (err: unknown) {
      setError(friendlyClerkError(err, "Couldn't reset your password."));
    } finally {
      setLoading(false);
    }
  };

  const heading =
    mode === "signin"
      ? "Sign in & build."
      : forgotStep === "email"
        ? "Reset your password."
        : "Check your email.";

  return (
    <div className={`${shell} flex items-center justify-center ${gradient}`}>
      <div className="flex w-full max-w-md flex-col items-stretch">
        <div className="w-full">
          <div className="mt-10 mb-8 lg:mt-14 text-center">
            <h1 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_1px_24px_rgba(0,0,0,0.15)] md:text-6xl lg:text-[3.35rem]">
              {heading}
            </h1>
            <p className="mt-5 font-mono text-sm uppercase tracking-wide leading-relaxed text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.12)]">
              The Hopamine Network.
            </p>
          </div>

          <Card>
            {error ? <ErrorBanner message={error} /> : null}

            {mode === "signin" ? (
              <>
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

                <Divider />

                <form
                  onSubmit={(e) => void handleSubmit(e)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="signin-email"
                      className="font-mono text-sm font-medium text-neutral-800"
                    >
                      Email
                    </label>
                    <input
                      id="signin-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      placeholder="Enter your email"
                      required
                      className={`${fieldBase} py-3 font-inter text-lg md:py-[0.7rem]`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <label
                        htmlFor="signin-password"
                        className="font-mono text-sm font-medium text-neutral-800"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={enterForgot}
                        className="font-mono text-xs text-accent-navbar underline decoration-accent-navbar/40 underline-offset-4 transition hover:brightness-[1.05]"
                      >
                        Forgot password?
                      </button>
                    </div>
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

                  <button
                    type="submit"
                    disabled={loading || !isLoaded}
                    className={submitButton}
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
                    className={linkButton}
                  >
                    Sign up
                  </Link>
                </p>
              </>
            ) : forgotStep === "email" ? (
              <form
                onSubmit={(e) => void handleSendCode(e)}
                className="space-y-4"
              >
                <p className="font-mono text-sm leading-relaxed text-neutral-600">
                  Enter your email and we&apos;ll send you a 6-digit code to
                  reset your password.
                </p>
                <div>
                  <label htmlFor="reset-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Enter your email"
                    required
                    autoFocus
                    className={`${fieldBase} py-3 font-inter text-lg md:py-[0.7rem]`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className={submitButton}
                >
                  {loading ? "Sending code…" : "Send reset code"}
                </button>

                <BackToSignIn onClick={backToSignIn} />
              </form>
            ) : (
              <form
                onSubmit={(e) => void handleResetPassword(e)}
                className="space-y-4"
              >
                <p className="font-mono text-sm leading-relaxed text-neutral-600">
                  We sent a code to{" "}
                  <span className="font-medium text-neutral-900">{email}</span>.
                  Enter it below with your new password.
                </p>

                <div className="space-y-2">
                  <label
                    htmlFor="reset-code"
                    className="font-mono text-sm font-medium text-neutral-800"
                  >
                    Verification code
                  </label>
                  <input
                    id="reset-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(ev) =>
                      setCode(ev.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="------"
                    required
                    autoFocus
                    className={`${fieldBase} py-3 text-center font-mono text-xl tracking-[0.5em]`}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => void handleResend()}
                      disabled={resendIn > 0 || loading}
                      className="font-mono text-xs text-accent-navbar underline decoration-accent-navbar/40 underline-offset-4 transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
                    >
                      {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="reset-new-password"
                    className="font-mono text-sm font-medium text-neutral-800"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="reset-new-password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(ev) => setNewPassword(ev.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className={`${fieldBase} py-3 pr-16 font-mono text-sm md:text-base`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 my-auto h-fit font-mono text-xs font-medium text-neutral-500 transition hover:text-neutral-800"
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className={submitButton}
                >
                  {loading ? "Resetting…" : "Reset password & sign in"}
                </button>

                <BackToSignIn onClick={backToSignIn} />
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-[0_28px_80px_rgba(0,0,0,0.12)] md:p-9">
      {children}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 font-mono text-sm text-red-800">
      {message}
    </div>
  );
}

function Divider() {
  return (
    <div className="relative mb-6 mt-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 font-mono text-neutral-500">OR</span>
      </div>
    </div>
  );
}

function BackToSignIn({ onClick }: { onClick: () => void }) {
  return (
    <p className="pt-1 text-center font-mono text-sm text-neutral-600">
      <button type="button" onClick={onClick} className={linkButton}>
        ← Back to sign in
      </button>
    </p>
  );
}
