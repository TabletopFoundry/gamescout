"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RatingValue } from "@/types";
import { GameRatingStep } from "./_components/GameRatingStep";
import { PreferenceStep } from "./_components/PreferenceStep";
import { QuizSummary } from "./_components/QuizSummary";

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

const STORAGE_KEY = "gamescout_quiz_state";

interface QuizState {
  gameRatings: Record<number, RatingValue>;
  playerCount: string;
  duration: string;
  complexity: string;
  themes: string[];
}

interface PersistedQuizState {
  step: number;
  quizState: QuizState;
}

function loadPersistedState(): PersistedQuizState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedQuizState;
  } catch {
    return null;
  }
}

function persistState(step: number, quizState: QuizState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, quizState }));
  } catch {
    // localStorage may be unavailable
  }
}

function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Restore persisted state on mount
  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) {
      setStep(saved.step);
      setQuizState(saved.quizState);
    }
    setHydrated(true);
  }, []);

  // Persist state on changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    persistState(step, quizState);
  }, [step, quizState, hydrated]);

  const totalSteps = QUIZ_GAMES.length + 4; // 10 games + 4 preference steps
  const progress = Math.round(((step) / totalSteps) * 100);

  const isGameStep = step < QUIZ_GAMES.length;
  const currentGame = isGameStep ? QUIZ_GAMES[step] : null;
  const prefStep = step - QUIZ_GAMES.length; // 0=players, 1=duration, 2=complexity, 3=themes

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

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
    setSubmitError(null);
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

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameRatings, preferences }),
      });

      if (!res.ok) throw new Error("Failed to save quiz results");

      clearPersistedState();
      router.push("/discover?from=quiz");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // Don't render until hydrated to avoid flicker with persisted state
  if (!hydrated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse text-zinc-400">Loading quiz...</div>
      </div>
    );
  }

  if (step >= totalSteps) {
    return (
      <QuizSummary
        quizState={quizState}
        quizGames={QUIZ_GAMES}
        submitting={submitting}
        submitError={submitError}
        onBack={goBack}
        onSubmit={handleSubmit}
      />
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
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Quiz progress: step ${step + 1} of ${totalSteps}`}
          />
        </div>
      </div>

      {isGameStep && currentGame ? (
        <GameRatingStep
          game={currentGame}
          selectedRating={quizState.gameRatings[currentGame.id]}
          imgError={imgErrors[currentGame.id] || false}
          onImgError={() =>
            setImgErrors((prev) => ({ ...prev, [currentGame.id]: true }))
          }
          onRate={rateGame}
          onSkip={() => setStep((s) => s + 1)}
          onBack={goBack}
          showBack={step > 0}
        />
      ) : prefStep === 0 ? (
        <PreferenceStep
          title="How many players do you usually play with?"
          options={PLAYER_COUNT_OPTIONS}
          selectedValue={quizState.playerCount}
          onSelect={(opt) => {
            setQuizState((prev) => ({ ...prev, playerCount: opt }));
            setTimeout(() => setStep((s) => s + 1), 200);
          }}
          onSkip={() => setStep((s) => s + 1)}
          onBack={goBack}
          ariaLabel="Player count preference"
          columns={3}
        />
      ) : prefStep === 1 ? (
        <PreferenceStep
          title="How long is your ideal gaming session?"
          options={DURATION_OPTIONS}
          selectedValue={quizState.duration}
          onSelect={(opt) => {
            setQuizState((prev) => ({ ...prev, duration: opt }));
            setTimeout(() => setStep((s) => s + 1), 200);
          }}
          onSkip={() => setStep((s) => s + 1)}
          onBack={goBack}
          ariaLabel="Session duration preference"
        />
      ) : prefStep === 2 ? (
        <PreferenceStep
          title="How complex do you like your games?"
          options={COMPLEXITY_OPTIONS}
          selectedValue={quizState.complexity}
          onSelect={(opt) => {
            setQuizState((prev) => ({ ...prev, complexity: opt }));
            setTimeout(() => setStep((s) => s + 1), 200);
          }}
          onSkip={() => setStep((s) => s + 1)}
          onBack={goBack}
          ariaLabel="Complexity preference"
        />
      ) : (
        <PreferenceStep
          title="What themes do you enjoy?"
          options={THEME_OPTIONS}
          selectedValue={quizState.themes}
          onSelect={(theme) => toggleTheme(theme)}
          onSkip={() => setStep((s) => s + 1)}
          onBack={goBack}
          ariaLabel="Select themes you enjoy"
          multiSelect
          columns={2}
        />
      )}
    </div>
  );
}
