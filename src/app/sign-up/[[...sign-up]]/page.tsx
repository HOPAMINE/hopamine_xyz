import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh items-start justify-center overflow-auto bg-accent-navbar pb-28 pt-[calc(112px+max(16px,env(safe-area-inset-top)))] md:pb-36 md:bg-white md:py-36">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
