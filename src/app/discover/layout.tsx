import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Games — GameScout",
  description: "Browse, search, and get personalized board game recommendations.",
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
