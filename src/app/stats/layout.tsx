import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats — GameScout",
  description: "View your board gaming statistics, play history, and trends.",
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
