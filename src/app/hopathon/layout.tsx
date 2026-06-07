import type { Metadata } from "next";
import { HopathonScroll } from "../../../components/hopathon/HopathonScroll";
import { FORM_ASSET_PRELOADS } from "../../../components/hopathon/questionLabels";
import { roboto } from "../../../fonts";

export const metadata: Metadata = {
  title: "Hopathon",
  robots: { index: false, follow: false },
};

export default function HopathonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HopathonScroll>
      {FORM_ASSET_PRELOADS.map((href) => (
        <link
          key={href}
          rel="preload"
          href={href}
          as="image"
          type="image/svg+xml"
        />
      ))}
      <div className={`${roboto.className} h-full min-h-dvh bg-[#13450E] lg:min-h-full lg:bg-transparent`}>{children}</div>
    </HopathonScroll>
  );
}
