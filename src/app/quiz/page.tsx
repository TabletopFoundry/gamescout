"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const QUIZ_GAMES = [
  {
    id: 1,
    name: "Catan",
    year: 1995,
    complexity: 2.3,
    description: "Trade resources to build settlements on a modular island",
    thumbnail_url:
      "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__thumb/img/8a9HeqFydO7UnHUVQaTCjMBh850=/fit-in/200x150/filters:strip_icc()/pic2419375.jpg",
  },
  {
    id: 2,
    name: "Ticket to Ride",
    year: 2004,
    complexity: 1.9,
    description: "Claim railway routes across North America",
    thumbnail_url:
      "https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__thumb/img/g0aac5bSHNDzRlNOEU7RHRrXi8E=/fit-in/200x150/filters:strip_icc()/pic38668.jpg",
  },
  {
    id: 3,
    name: "Pandemic",
    year: 2008,
    complexity: 2.4,
    description: "Cooperatively stop global disease outbreaks",
    thumbnail_url:
      "https://cf.geekdo-images.com/S3ybV1LAp-8sFQ2hm_jZHw__thumb/img/nFtHjInmgXEfO59GDjkxOsYfUZw=/fit-in/200x150/filters:strip_icc()/pic1534148.jpg",
  },
  {
    id: 4,
    name: "Wingspan",
    year: 2019,
    complexity: 2.4,
    description: "Build a bird sanctuary and attract stunning birds",
    thumbnail_url:
      "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__thumb/img/oA5_hRJRvMvTHOYijpAZFLNETgY=/fit-in/200x150/filters:strip_icc()/pic4458123.jpg",
  },
  {
    id: 5,
    name: "Codenames",
    year: 2015,
    complexity: 1.3,
    description: "Give clever one-word clues to guide your team",
    thumbnail_url:
      "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__thumb/img/s1p3R19cKLcpEiWQSJdIXThN2Z8=/fit-in/200x150/filters:strip_icc()/pic2582929.jpg",
  },
  {
    id: 6,
    name: "Gloomhaven",
    year: 2017,
    complexity: 3.9,
    description: "Epic tactical dungeon-crawling RPG campaign",
    thumbnail_url:
      "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__thumb/img/pItGRMRhqNWI4pYKOqXXGTXU7Ms=/fit-in/200x150/filters:strip_icc()/pic2437871.jpg",
  },
  {
    id: 7,
    name: "7 Wonders",
    year: 2010,
    complexity: 2.3,
    description: "Lead an ancient civilization to glory through card drafting",
    thumbnail_url:
      "https://cf.geekdo-images.com/FS1RE8mSBAbmSxkdb0VtGg__thumb/img/mGxbGa8FBzrKBcqMjCjk2TmCMYs=/fit-in/200x150/filters:strip_icc()/pic860217.jpg",
  },
  {
    id: 8,
    name: "Terraforming Mars",
    year: 2016,
    complexity: 3.2,
    description: "Compete to terraform the Red Planet",
    thumbnail_url:
      "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__thumb/img/LMgQWWwHBqcLWbj-bw2rJMNRqRo=/fit-in/200x150/filters:strip_icc()/pic3536616.jpg",
  },
  {
    id: 9,
    name: "Azul",
    year: 2017,
    complexity: 1.8,
    description: "Draft colorful tiles to create beautiful patterns",
    thumbnail_url:
      "https://cf.geekdo-images.com/aPSHiTBC_4xMv_Bv-e79rA__thumb/img/XAQy-3jWHnMlGjhq3DSmzfE1vGE=/fit-in/200x150/filters:strip_icc()/pic3718275.jpg",
  },
  {
    id: 10,
    name: "Scythe",
    year: 2016,
    complexity: 3.4,
    description: "Alternate-history 1920s resource management and combat",
    thumbnail_url:
      "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BvynA__thumb/img/lEkDjKYT3a2VuFmCqkRcv6HuZN8=/fit-in/200x150/filters:strip_icc()/pic3163924.jpg",
  },
];

type RatingValue = "loved" | "liked" | "neutral" | "disliked" | "havent_played";

const RATINGS: { value: RatingValue; label: string; emoji: string; color: string }[] = [
  { value: "loved", label: "Loved it", emoji: "❤️", color: "bg-red-500 text-white border-red-500" },
  { value: "liked", label: "Liked it", emoji: "👍", color: "bg-emerald-500 text-black border-emerald-500" },
  { value: "neutral", label: "It's ok", emoji: "😐", color: "bg-yellow-500 text-black border-yellow-500" },
  { value: "disliked", label: "Disliked", emoji: "👎", color: "bg-zinc-600 text-white border-zinc-600" },
  { value: "havent_played", label: "Haven't played", emoji: "🤷", color: "bg-zinc-800 text-zinc-300 border-zinc-700" },
];

const PLAYER_COUNT_OPTIONS = ["1", "2", "2-3", "3-4", "4-6", "6+"];
const DURATION_OPTIONS = ["< 30 min", "30-60 min", "1-2 hours", "2-3 hours", "3+ hours"];
const COMPLEXITY_OPTIONS = [
  { label: "Light", desc: "Easy to learn, quick rules", value: "1-2" },
  { label: "Medium", desc: "Some strategy required", value: "2-3" },
  { label: "Heavy", desc: "Complex rules, deep strategy", value: "3-5" },
];
const THEME_OPTIONS = [
  "Fantasy", "Science Fiction", "Historical", "Horror", "Economic",
  "Nature", "Abstract", "Adventure", "Cooperative", "Party",
];

interface QuizState {
  gameRatings: Record<number, RatingValue>;
  playerCount: string;
  duration: string;
  complexity: string;
  themes: string[];
}

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>({
    gameRatings: {},
    playerCount: "",
    duration: "",
    complexity: "",
    themes: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const totalSteps = QUIZ_GAMES.length + 4; // 10 games + 4 preference steps
  const progress = Math.round(((step) / totalSteps) * 100);

  const isGameStep = step < QUIZ_GAMES.length;
  const currentGame = isGameStep ? QUIZ_GAMES[step] : null;
  const prefStep = step - QUIZ_GAMES.length; // 0=players, 1=duration, 2=complexity, 3=themes

  function rateGame(gameId: number, rating: RatingValue) {
    setQuizState((prev) => ({
      ...prev,
      gameRatings: { ...prev.gameRatings, [gameId]: rating },
    }));
    // Auto-advance
    setTimeout(() => setStep((s) => s + 1), 200);
  }

  function toggleTheme(theme: string) {
    setQuizState((prev) => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter((t) => t !== theme)
        : [...prev.themes, theme],
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const gameRatings = Object.entries(quizState.gameRatings).map(
        ([gameId, rating]) => ({ gameId: Number(gameId), rating })
      );

      const preferences = [
        { key: "player_count", value: quizState.playerCount || "3-4" },
        { key: "duration", value: quizState.duration || "30-90" },
        { key: "complexity", value: quizState.complexity || "2-3" },
        { key: "themes", value: quizState.themes.join(",") },
      ];

      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameRatings, preferences }),
      });

      router.push("/discover?from=quiz");
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  }

  if (step >= totalSteps) {
    // Summary / submit step
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
              <p className="text-white font-medium">{quizState.playerCount || "—"}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Session Length</p>
              <p className="text-white font-medium">{quizState.duration || "—"}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Complexity</p>
              <p className="text-white font-medium">{quizState.complexity || "—"}</p>
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
                    const g = QUIZ_GAMES.find((g) => g.id === Number(id));
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

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-lg rounded-xl transition-colors"
        >
          {submitting ? "Saving..." : "See My Recommendations →"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isGameStep && currentGame ? (
        /* Game rating step */
        <div>
          <p className="text-zinc-400 text-sm mb-1">
            Have you played this game?
          </p>
          <h1 className="text-3xl font-bold text-white mb-6">
            {currentGame.name}
          </h1>

          <div className="relative mb-6">
            <div className="w-full aspect-[16/9] max-h-64 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
              {!imgErrors[currentGame.id] ? (
                <Image
                  src={currentGame.thumbnail_url}
                  alt={currentGame.name}
                  fill
                  className="object-cover"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [currentGame.id]: true }))
                  }
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              ) : (
                <div className="text-8xl">🎲</div>
              )}
            </div>
          </div>

          <p className="text-zinc-400 text-sm mb-1 italic">{currentGame.description}</p>
          <p className="text-zinc-500 text-xs mb-6">
            {currentGame.year} · Complexity:{" "}
            <span className="text-yellow-400">{currentGame.complexity}/5</span>
          </p>

          <div className="grid grid-cols-1 gap-3">
            {RATINGS.map((r) => {
              const selected = quizState.gameRatings[currentGame.id] === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => rateGame(currentGame.id, r.value)}
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

          <button
            onClick={() => setStep((s) => s + 1)}
            className="mt-4 w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Skip →
          </button>
        </div>
      ) : prefStep === 0 ? (
        /* Player count preference */
        <div>
          <p className="text-zinc-400 text-sm mb-1">Preferences</p>
          <h1 className="text-3xl font-bold text-white mb-6">
            How many players do you usually play with?
          </h1>
          <div className="grid grid-cols-3 gap-3">
            {PLAYER_COUNT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setQuizState((prev) => ({ ...prev, playerCount: opt }));
                  setTimeout(() => setStep((s) => s + 1), 200);
                }}
                className={`p-4 rounded-xl border-2 font-medium transition-all ${
                  quizState.playerCount === opt
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep((s) => s + 1)}
            className="mt-4 w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Skip →
          </button>
        </div>
      ) : prefStep === 1 ? (
        /* Duration preference */
        <div>
          <p className="text-zinc-400 text-sm mb-1">Preferences</p>
          <h1 className="text-3xl font-bold text-white mb-6">
            How long is your ideal gaming session?
          </h1>
          <div className="grid grid-cols-1 gap-3">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setQuizState((prev) => ({ ...prev, duration: opt }));
                  setTimeout(() => setStep((s) => s + 1), 200);
                }}
                className={`p-4 rounded-xl border-2 font-medium transition-all text-left ${
                  quizState.duration === opt
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep((s) => s + 1)}
            className="mt-4 w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Skip →
          </button>
        </div>
      ) : prefStep === 2 ? (
        /* Complexity preference */
        <div>
          <p className="text-zinc-400 text-sm mb-1">Preferences</p>
          <h1 className="text-3xl font-bold text-white mb-6">
            How complex do you like your games?
          </h1>
          <div className="grid grid-cols-1 gap-3">
            {COMPLEXITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setQuizState((prev) => ({ ...prev, complexity: opt.label }));
                  setTimeout(() => setStep((s) => s + 1), 200);
                }}
                className={`p-4 rounded-xl border-2 font-medium transition-all text-left ${
                  quizState.complexity === opt.label
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-sm text-zinc-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep((s) => s + 1)}
            className="mt-4 w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Skip →
          </button>
        </div>
      ) : (
        /* Theme preferences */
        <div>
          <p className="text-zinc-400 text-sm mb-1">Preferences</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            What themes do you enjoy?
          </h1>
          <p className="text-zinc-400 text-sm mb-6">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {THEME_OPTIONS.map((theme) => {
              const selected = quizState.themes.includes(theme);
              return (
                <button
                  key={theme}
                  onClick={() => toggleTheme(theme)}
                  className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    selected
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {selected ? "✓ " : ""}{theme}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
