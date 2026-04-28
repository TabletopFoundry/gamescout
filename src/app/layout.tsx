import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GameScout — Board Game Discovery",
    template: "%s — GameScout",
  },
  description:
    "Discover your next favorite board game with personalized recommendations powered by your taste profile.",
  keywords: ["board games", "board game recommendations", "board game collection", "BGG", "tabletop games"],
  openGraph: {
    title: "GameScout — Board Game Discovery",
    description: "Personalized board game recommendations, collection tracking, and price comparison.",
    type: "website",
    siteName: "GameScout",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-black focus:font-semibold focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} GameScout · Prices shown are for
          informational purposes only. We may earn a commission on purchases. ·{" "}
          <Link href="/privacy" className="hover:text-zinc-400">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-zinc-400">
            Terms
          </Link>
        </footer>
      </body>
    </html>
  );
}
