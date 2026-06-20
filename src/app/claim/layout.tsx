import type { Metadata } from "next";
import { HopathonScroll } from "../../../components/hopathon/HopathonScroll";
import { roboto } from "../../../fonts";

export const metadata: Metadata = {
  title: "Claim · Green Hackathon",
  robots: { index: false, follow: false },
};

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HopathonScroll>
      <div className={`${roboto.className} min-h-dvh h-full bg-[#13450E]`}>{children}</div>
    </HopathonScroll>
  );
}
