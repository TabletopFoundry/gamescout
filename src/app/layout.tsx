import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameScout — Board Game Discovery",
  description:
    "Discover your next favorite board game with personalized recommendations powered by your taste profile.",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} GameScout · Prices shown are for
          informational purposes only. We may earn a commission on purchases. ·{" "}
          <a href="#" className="hover:text-zinc-400">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:text-zinc-400">
            Terms
          </a>
        </footer>
      </body>
    </html>
  );
}
