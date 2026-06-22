"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ONBOARD_FROM_CLAIM_PATH } from "@/lib/claimRoutes";

const appearance = {
  variables: {
    colorPrimary: "#00a6f3",
    colorBackground: "#ffffff",
    colorInputBackground: "#fafafa",
    colorInputText: "#171717",
    colorText: "#171717",
    colorTextSecondary: "#737373",
    colorDanger: "#dc2626",
    borderRadius: "0.5rem",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: "1rem",
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    cardBox: {
      width: "100%",
    },
    card: {
      borderRadius: "1.5rem",
      border: "1px solid #f5f5f5",
      backgroundColor: "#ffffff",
      boxShadow: "0 28px 80px rgba(0,0,0,0.12)",
      padding: "2rem",
      width: "100%",
    },
    header: { display: "none" },
    formButtonPrimary: {
      backgroundColor: "#00a6f3",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontWeight: "600",
      fontSize: "1.0625rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    },
    socialButtonsBlockButton: {
      border: "2px solid #e5e5e5",
      backgroundColor: "#fafafa",
      color: "#171717",
      fontWeight: "600",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontSize: "1.0625rem",
    },
    socialButtonsBlockButtonText: {
      fontWeight: "600",
    },
    formFieldInput: {
      border: "1px solid #d4d4d4",
      backgroundColor: "#fafafa",
      color: "#171717",
      borderRadius: "0.375rem",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    },
    formFieldLabel: {
      fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#262626",
    },
    dividerLine: {
      backgroundColor: "#e5e5e5",
    },
    dividerText: {
      fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
      color: "#737373",
      fontSize: "0.875rem",
    },
    footerActionLink: {
      color: "#00a6f3",
      fontWeight: "600",
    },
    footerActionText: {
      fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
      fontSize: "0.875rem",
      color: "#525252",
    },
    identityPreviewText: {
      fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
      fontSize: "0.875rem",
    },
    formResendCodeLink: {
      color: "#00a6f3",
    },
  },
};

function SignUpForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const forceRedirectUrl = redirectUrl?.startsWith("/claim")
    ? ONBOARD_FROM_CLAIM_PATH
    : "/onboard";

  return (
    <SignUp routing="path" path="/sign-up" appearance={appearance} forceRedirectUrl={forceRedirectUrl} />
  );
}

export function SignUpPanel() {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-neutral-500">Loading…</p>}>
      <SignUpForm />
    </Suspense>
  );
}
