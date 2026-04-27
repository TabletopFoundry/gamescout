import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Details — GameScout",
  description:
    "View game details, price comparisons, reviews, play logs, and similar games.",
};

export default function GameDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
