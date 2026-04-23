"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { PlayLog } from "@/types";
import { getComplexityBucket } from "@/types";
import { SummaryCards } from "./_components/SummaryCards";
import { RecentPlaysTable } from "./_components/RecentPlaysTable";

const StatsCharts = dynamic(() => import("./_components/StatsCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-pulse h-64"
        />
      ))}
    </div>
  ),
});

interface Stats {
  totalPlays: number;
  uniqueGames: number;
  mostPlayed: { gameId: number; count: number; name: string }[];
  playsByMonth: Record<string, number>;
}

interface StatsCollectionItem {
  game: {
    id: number;
    complexity: number;
    categories: string[];
    bgg_rating: number;
  };
  status: "owned" | "wishlist";
}

export default function StatsPage() {
  const [logs, setLogs] = useState<PlayLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [collection, setCollection] = useState<StatsCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/play-logs").then((r) => {
        if (!r.ok) throw new Error("Failed to load play logs");
        return r.json();
      }),
      fetch("/api/collection").then((r) => {
        if (!r.ok) throw new Error("Failed to load collection");
        return r.json();
      }),
    ]).then(([playData, collData]) => {
      setLogs(playData.logs || []);
      setStats(playData.stats);
      setCollection(collData.items || []);
      setLoading(false);
    }).catch((e) => {
      setError(e instanceof Error ? e.message : "Failed to load stats data");
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Stats</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 animate-pulse h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Stats</h1>
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center" role="alert">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ownedGames = collection.filter((i) => i.status === "owned");
  const wishlistGames = collection.filter((i) => i.status === "wishlist");

  // Plays by month chart data
  const monthChartData = stats
    ? Object.entries(stats.playsByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, count]) => ({
          month: new Date(month + "-01").toLocaleString("default", {
            month: "short",
          }),
          plays: count,
        }))
    : [];

  // Complexity distribution using shared bucketing
  const complexityBuckets: Record<string, number> = {};
  for (const item of ownedGames) {
    const bucket = getComplexityBucket(item.game.complexity);
    complexityBuckets[bucket] = (complexityBuckets[bucket] || 0) + 1;
  }
  const complexityData = Object.entries(complexityBuckets)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  // Category distribution
  const catCounts: Record<string, number> = {};
  for (const item of ownedGames) {
    for (const cat of item.game.categories) {
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  const categoryData = Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Recent ratings
  const ratedLogs = logs
    .filter((l) => l.rating !== null)
    .slice(0, 10)
    .map((l) => ({ name: l.game_name.slice(0, 15), rating: l.rating! }));

  const avgRating =
    ratedLogs.length > 0
      ? (ratedLogs.reduce((s, l) => s + l.rating, 0) / ratedLogs.length).toFixed(1)
      : null;

  const hasData =
    ownedGames.length > 0 ||
    (stats && stats.totalPlays > 0) ||
    wishlistGames.length > 0;

  if (!hasData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Stats</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No data yet
          </h3>
          <p className="text-zinc-400 max-w-sm mb-6">
            Add games to your collection and log plays to see your stats here.
          </p>
          <div className="flex gap-3">
            <Link
              href="/discover"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
            >
              Discover Games
            </Link>
            <Link
              href="/collection"
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Your Stats</h1>

      <SummaryCards
        totalPlays={stats?.totalPlays || 0}
        uniqueGames={stats?.uniqueGames || 0}
        ownedCount={ownedGames.length}
        wishlistCount={wishlistGames.length}
        avgRating={avgRating}
      />

      <StatsCharts
        monthChartData={monthChartData}
        complexityData={complexityData}
        categoryData={categoryData}
        ratedLogs={ratedLogs}
      />

      {/* Most Played Games */}
      {stats && stats.mostPlayed.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Most Played Games
          </h2>
          <div className="space-y-3">
            {stats.mostPlayed.map((game, idx) => {
              const maxCount = stats.mostPlayed[0]?.count || 1;
              const pct = (game.count / maxCount) * 100;
              return (
                <div key={game.gameId} className="flex items-center gap-3">
                  <span className="text-zinc-500 text-sm w-5 shrink-0">
                    {idx + 1}
                  </span>
                  <Link
                    href={`/games/${game.gameId}`}
                    className="text-white text-sm font-medium hover:text-emerald-400 transition-colors min-w-0 flex-1"
                  >
                    {game.name}
                  </Link>
                  <div className="flex-1 max-w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-zinc-400 text-sm shrink-0">
                    {game.count} play{game.count !== 1 ? "s" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <RecentPlaysTable logs={logs} />
    </div>
  );
}
