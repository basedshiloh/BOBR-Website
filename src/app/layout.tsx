import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";

// Display serif for headlines — Fraunces has a warm, slightly playful character
// that pairs the newspaper feel with the fun of the BOBR mascot.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// Clean, highly readable grotesk for body copy (the Verge-style legibility the
// user liked, minus the black background).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://basedbobr.com"),
  title: {
    default: "BOBR — Builder-first crypto, from the trenches",
    template: "%s · BOBR",
  },
  description:
    "BOBR is a crypto news desk for builders. Base, markets, culture and guides — informative, inclusive, and degen-fun.",
  openGraph: {
    siteName: "BOBR",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} ${lexend.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
