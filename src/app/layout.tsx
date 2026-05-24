import type { Metadata, Viewport } from "next";
import ClientLayout from "./client-layout";
import { instrumentSerif, robotoMono } from "../../fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hopamine",
  description: "A place to build towards a hopeful future",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

/** Required on iOS so fixed fullscreen layers extend under the notch (no letterboxed black bars). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00a6f3",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${robotoMono.variable} m-0 h-dvh overscroll-none bg-accent-navbar p-0 antialiased md:bg-white`}
    >
      <body className="m-0 flex h-full min-h-0 flex-col overflow-hidden overscroll-none bg-accent-navbar p-0 font-serif text-neutral-900 md:bg-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
