import { SignUp } from "@clerk/nextjs";

const shell =
  "min-h-dvh w-full px-6 py-12 pb-28 pt-[calc(112px+max(28px,env(safe-area-inset-top)))] md:pb-36 md:pt-[calc(120px+max(28px,env(safe-area-inset-top)))]";

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
    // Hide the built-in Clerk header — we render our own heading above
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
        <SignUp routing="path" path="/sign-up" appearance={appearance} forceRedirectUrl="/onboard" />
      </div>
    </div>
  );
}
