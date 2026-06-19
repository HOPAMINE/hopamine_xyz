import { Instrument_Serif, Roboto, Roboto_Flex, Roboto_Mono, Sorts_Mill_Goudy } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const roboto = Roboto({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const sortsMillGoudy = Sorts_Mill_Goudy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sorts-mill-goudy",
  display: "swap",
});
