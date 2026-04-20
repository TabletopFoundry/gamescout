"use client";

import Image from "next/image";
import type { RatingValue } from "@/types";

interface QuizGame {
  id: number;
  name: string;
  year: number;
  complexity: number;
  description: string;
  thumbnail_url: string;
}

const RATINGS: { value: RatingValue; label: string; emoji: string; color: string }[] = [
  { value: "loved", label: "Loved it", emoji: "❤️", color: "bg-red-500 text-white border-red-500" },
  { value: "liked", label: "Liked it", emoji: "👍", color: "bg-emerald-500 text-black border-emerald-500" },
  { value: "neutral", label: "It's ok", emoji: "😐", color: "bg-yellow-500 text-black border-yellow-500" },
  { value: "disliked", label: "Disliked", emoji: "👎", color: "bg-zinc-600 text-white border-zinc-600" },
  { value: "havent_played", label: "Haven't played", emoji: "🤷", color: "bg-zinc-800 text-zinc-300 border-zinc-700" },
];

interface GameRatingStepProps {
  game: QuizGame;
  selectedRating: RatingValue | undefined;
  imgError: boolean;
  onImgError: () => void;
  onRate: (gameId: number, rating: RatingValue) => void;
  onSkip: () => void;
  onBack: () => void;
  showBack: boolean;
}

export function GameRatingStep({
  game,
  selectedRating,
  imgError,
  onImgError,
  onRate,
  onSkip,
  onBack,
  showBack,
}: GameRatingStepProps) {
  return (
    <div>
      <p className="text-zinc-400 text-sm mb-1">
        Have you played this game?
      </p>
      <h1 className="text-3xl font-bold text-white mb-6">
        {game.name}
      </h1>

      <div className="relative mb-6">
        <div className="w-full aspect-[16/9] max-h-64 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
          {!imgError ? (
            <Image
              src={game.thumbnail_url}
              alt={game.name}
              fill
              className="object-cover"
              onError={onImgError}
              sizes="(max-width: 768px) 100vw, 672px"
            />
          ) : (
            <div className="text-8xl">🎲</div>
          )}
        </div>
      </div>

      <p className="text-zinc-400 text-sm mb-1 italic">{game.description}</p>
      <p className="text-zinc-500 text-xs mb-6">
        {game.year} · Complexity:{" "}
        <span className="text-yellow-400">{game.complexity}/5</span>
      </p>

      <div role="group" aria-label={`Rate ${game.name}`} className="grid grid-cols-1 gap-3">
        {RATINGS.map((r) => {
          const selected = selectedRating === r.value;
          return (
            <button
              key={r.value}
              onClick={() => onRate(game.id, r.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                selected
                  ? r.color
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              <span className="text-xl">{r.emoji}</span>
              <span className="font-medium">{r.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-4">
        {showBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            aria-label="Go back to previous step"
          >
            ← Back
          </button>
        )}
        <button
          onClick={onSkip}
          className="flex-1 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
