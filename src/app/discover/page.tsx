"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GameCard from "@/components/GameCard";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { MOODS } from "@/lib/moods";
import type { Game, RecommendedGame, CollectionStatus } from "@/types";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const fromQuiz = searchParams.get("from") === "quiz";

  const [tab, setTab] = useState<"recommended" | "browse" | "search">(
    fromQuiz ? "recommended" : "recommended"
  );
  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  const [browseGames, setBrowseGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxComplexity, setMaxComplexity] = useState(5);
  const [maxPlaytime, setMaxPlaytime] = useState(0);

  const [profile, setProfile] = useState<{ summary: string } | null>(null);
  const [collectionStatuses, setCollectionStatuses] = useState<
    Record<number, CollectionStatus>
  >({});

  useEffect(() => {
    loadRecommendations();
    loadCollection();
  }, []);

  async function loadRecommendations() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setProfile(data.profile);
    } catch {
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCollection() {
    try {
      const res = await fetch("/api/collection");
      if (!res.ok) throw new Error("Failed to load collection");
      const data = await res.json();
      const statuses: Record<number, "owned" | "wishlist"> = {};
      for (const item of data.items || []) {
        statuses[item.game.id] = item.status;
      }
      setCollectionStatuses(statuses);
    } catch {
      console.error("Failed to load collection statuses");
    }
  }

  const loadBrowse = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ limit: "50" });
    if (minPlayers > 0) params.set("minPlayers", String(minPlayers));
    if (maxComplexity < 5) params.set("maxComplexity", String(maxComplexity));
    if (maxPlaytime > 0) params.set("maxPlaytime", String(maxPlaytime));

    try {
      const res = await fetch(`/api/games?${params}`);
      if (!res.ok) throw new Error("Failed to load games");
      const data = await res.json();
      let games: Game[] = data.games || [];

      if (selectedMood) {
        const mood = MOODS.find((m) => m.label === selectedMood);
        if (mood) {
          games = games.filter((g) => {
            if (mood.maxComplexity && g.complexity > mood.maxComplexity) return false;
            if (mood.minComplexity && g.complexity < mood.minComplexity) return false;
            if (mood.maxPlayers && g.min_players > mood.maxPlayers) return false;
            if (mood.minPlayers && g.max_players < mood.minPlayers) return false;
            if (mood.maxPlaytime && g.min_playtime > mood.maxPlaytime) return false;
            if (
              mood.categories &&
              !g.categories.some((c) =>
                mood.categories?.some((mc) =>
                  c.toLowerCase().includes(mc.toLowerCase())
                )
              )
            ) {
              return false;
            }
            return true;
          });
        }
      }

      setBrowseGames(games);
    } catch {
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [maxComplexity, maxPlaytime, minPlayers, selectedMood]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/games?q=${encodeURIComponent(searchQuery)}&limit=50`);
      if (!res.ok) throw new Error("Failed to search games");
      const data = await res.json();
      setSearchResults(data.games || []);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (tab !== "browse") return;

    const timer = setTimeout(() => {
      void loadBrowse();
    }, 0);

    return () => clearTimeout(timer);
  }, [tab, loadBrowse]);

  useEffect(() => {
    if (tab !== "search") return;
    const t = setTimeout(handleSearch, 400);
    return () => clearTimeout(t);
  }, [searchQuery, tab, handleSearch]);

  function handleCollectionChange(
    gameId: number,
    status: CollectionStatus
  ) {
    setCollectionStatuses((prev) => ({ ...prev, [gameId]: status }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Discover</h1>
        {profile?.summary && (
          <p className="text-zinc-400 text-sm max-w-2xl">
            💡 {profile.summary}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Discover navigation" className="flex gap-1 mb-6 bg-zinc-900 rounded-xl p-1 max-w-sm">
        {(["recommended", "browse", "search"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            aria-controls={`tabpanel-${t}`}
            id={`tab-${t}`}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              tab === t
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t === "recommended" ? "For You" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Browse Filters */}
      {tab === "browse" && (
        <div className="mb-6 space-y-4">
          {/* Mood Filters */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Browse by Mood
            </p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() =>
                    setSelectedMood(selectedMood === mood.label ? null : mood.label)
                  }
                  aria-pressed={selectedMood === mood.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedMood === mood.label
                      ? "bg-emerald-500 text-black border-emerald-500"
                      : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Numeric Filters */}
          <div className="flex flex-wrap gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Min Players
              </span>
              <select
                value={minPlayers}
                onChange={(e) => setMinPlayers(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value={0}>Any</option>
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Max Complexity
              </span>
              <select
                value={maxComplexity}
                onChange={(e) => setMaxComplexity(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value={5}>Any</option>
                <option value={2}>Light (≤2)</option>
                <option value={3}>Medium (≤3)</option>
                <option value={4}>Heavy (≤4)</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Max Playtime
              </span>
              <select
                value={maxPlaytime}
                onChange={(e) => setMaxPlaytime(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value={0}>Any</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Search Input */}
      {tab === "search" && (
        <div className="mb-6">
          <div className="relative max-w-lg">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games by name..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Content */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6 text-red-400" role="alert">
          {error}
          <button onClick={loadRecommendations} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <GridSkeleton count={12} />
      ) : tab === "recommended" ? (
        recommendations.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">
                {recommendations.length} personalized picks
              </p>
              <button
                onClick={loadRecommendations}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.map(({ game, reason }) => (
                <GameCard
                  key={game.id}
                  game={game}
                  reason={reason}
                  collectionStatus={collectionStatuses[game.id]}
                  onCollectionChange={handleCollectionChange}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon="🎯"
            title="Build your taste profile"
            description="Take the quick quiz to rate games and get personalized recommendations."
            action={{ label: "Take the Quiz", href: "/quiz" }}
          />
        )
      ) : tab === "browse" ? (
        browseGames.length > 0 ? (
          <>
            <p className="text-sm text-zinc-400 mb-4">
              {browseGames.length} games
              {selectedMood ? ` · ${selectedMood}` : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {browseGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  collectionStatus={collectionStatuses[game.id]}
                  onCollectionChange={handleCollectionChange}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon="🔎"
            title="No games match"
            description="Try adjusting your filters to find more games."
          />
        )
      ) : /* search */ searchLoading ? (
        <GridSkeleton count={6} />
      ) : searchQuery && searchResults.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No results found"
          description={`No games matching "${searchQuery}". Try a different search term.`}
        />
      ) : searchResults.length > 0 ? (
        <>
          <p className="text-sm text-zinc-400 mb-4">
            {searchResults.length} results for &quot;{searchQuery}&quot;
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                collectionStatus={collectionStatuses[game.id]}
                onCollectionChange={handleCollectionChange}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon="🔍"
          title="Search for games"
          description="Type a game name to search our catalog of 55+ board games."
        />
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><GridSkeleton /></div>}>
      <DiscoverContent />
    </Suspense>
  );
}
