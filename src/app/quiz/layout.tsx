import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taste Quiz — GameScout",
  description: "Rate popular board games and set your preferences to get personalized recommendations.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
