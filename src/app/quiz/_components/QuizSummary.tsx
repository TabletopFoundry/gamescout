"use client";

import type { RatingValue } from "@/types";

interface QuizGame {
  id: number;
  name: string;
}

interface QuizState {
  gameRatings: Record<number, RatingValue>;
  playerCount: string;
  duration: string;
  complexity: string;
  themes: string[];
}

interface QuizSummaryProps {
  quizState: QuizState;
  quizGames: QuizGame[];
  playerCountLabel: string;
  durationLabel: string;
  complexityLabel: string;
  submitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

export function QuizSummary({
  quizState,
  quizGames,
  playerCountLabel,
  durationLabel,
  complexityLabel,
  submitting,
  submitError,
  onBack,
  onSubmit,
}: QuizSummaryProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Complete!</h1>
        <p className="text-zinc-400">
          We&apos;ve built your taste profile. Ready to see your recommendations?
        </p>
      </div>

      {/* Summary */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Your Taste Summary</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-zinc-500 mb-1">Games Rated</p>
            <p className="text-white font-medium">{Object.keys(quizState.gameRatings).length}</p>
          </div>
          <div>
            <p className="text-zinc-500 mb-1">Group Size</p>
            <p className="text-white font-medium">{quizState.playerCount ? playerCountLabel : "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500 mb-1">Session Length</p>
            <p className="text-white font-medium">{quizState.duration ? durationLabel : "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500 mb-1">Complexity</p>
            <p className="text-white font-medium">{quizState.complexity ? complexityLabel : "—"}</p>
          </div>
        </div>
        {quizState.themes.length > 0 && (
          <div className="mt-3">
            <p className="text-zinc-500 mb-1 text-sm">Favorite Themes</p>
            <div className="flex flex-wrap gap-1">
              {quizState.themes.map((t) => (
                <span key={t} className="text-xs bg-emerald-400/10 text-emerald-400 rounded-full px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Loved games */}
        {Object.entries(quizState.gameRatings).some(([, r]) => r === "loved") && (
          <div className="mt-3">
            <p className="text-zinc-500 mb-1 text-sm">Loved</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(quizState.gameRatings)
                .filter(([, r]) => r === "loved")
                .map(([id]) => {
                  const g = quizGames.find((g) => g.id === Number(id));
                  return g ? (
                    <span key={id} className="text-xs bg-red-400/10 text-red-400 rounded-full px-2 py-0.5">
                      ❤️ {g.name}
                    </span>
                  ) : null;
                })}
            </div>
          </div>
        )}
      </div>

      {submitError && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4 text-red-400 text-sm" role="alert">
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-lg rounded-xl transition-colors"
          aria-label="Go back to previous step"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-lg rounded-xl transition-colors"
        >
          {submitting ? "Saving..." : "See My Recommendations →"}
        </button>
      </div>
    </div>
  );
}
