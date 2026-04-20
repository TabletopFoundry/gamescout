import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Collection — GameScout",
  description: "Manage your board game collection and wishlist.",
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
