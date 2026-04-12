"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/LoadingSkeleton";

interface Game {
  id: number;
  name: string;
  year: number;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  complexity: number;
  bgg_rating: number;
  categories: string[];
  thumbnail_url: string;
}

interface CollectionItem {
  collectionId: number;
  status: "owned" | "wishlist";
  addedAt: string;
  game: Game;
}

interface PlayLog {
  id: number;
  game_id: number;
  game_name: string;
  thumbnail_url: string;
  played_at: string;
  players: number | null;
  winner: string | null;
  rating: number | null;
  notes: string | null;
}

export default function CollectionPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"owned" | "wishlist">("owned");
  const [sortBy, setSortBy] = useState<"added" | "name" | "rating">("added");
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [removing, setRemoving] = useState<Record<number, boolean>>({});

  // Play log state
  const [playLogs, setPlayLogs] = useState<PlayLog[]>([]);
  const [playLogsLoading, setPlayLogsLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const loadCollection = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collection");
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCollection();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadCollection]);

  async function loadPlayLogs() {
    setPlayLogsLoading(true);
    try {
      const res = await fetch("/api/play-logs");
      const data = await res.json();
      setPlayLogs(data.logs || []);
    } finally {
      setPlayLogsLoading(false);
    }
  }

  async function removeItem(gameId: number) {
    setRemoving((prev) => ({ ...prev, [gameId]: true }));
    try {
      await fetch(`/api/collection?gameId=${gameId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.game.id !== gameId));
    } finally {
      setRemoving((prev) => ({ ...prev, [gameId]: false }));
    }
  }

  async function moveToOwned(gameId: number) {
    await fetch("/api/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, status: "owned" }),
    });
    setItems((prev) =>
      prev.map((i) =>
        i.game.id === gameId ? { ...i, status: "owned" } : i
      )
    );
  }

  async function deletePlayLog(id: number) {
    await fetch(`/api/play-logs?id=${id}`, { method: "DELETE" });
    setPlayLogs((prev) => prev.filter((l) => l.id !== id));
  }

  const filteredItems = items.filter((i) => i.status === tab);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name")
      return a.game.name.localeCompare(b.game.name);
    if (sortBy === "rating")
      return b.game.bgg_rating - a.game.bgg_rating;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const ownedCount = items.filter((i) => i.status === "owned").length;
  const wishlistCount = items.filter((i) => i.status === "wishlist").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Collection</h1>
          <p className="text-zinc-400 text-sm">
            {ownedCount} owned · {wishlistCount} wishlisted
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowLogs(!showLogs);
              if (!playLogs.length) loadPlayLogs();
            }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm rounded-lg transition-colors"
          >
            {showLogs ? "Hide Logs" : "📝 Play Logs"}
          </button>
          <Link
            href="/discover"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-lg transition-colors"
          >
            + Add Games
          </Link>
        </div>
      </div>

      {/* Play Logs Section */}
      {showLogs && (
        <div className="mb-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Recent Play History
          </h2>
          {playLogsLoading ? (
            <div className="text-zinc-400 text-sm animate-pulse">
              Loading...
            </div>
          ) : playLogs.length > 0 ? (
            <div className="space-y-3">
              {playLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-3 bg-zinc-800 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-700 shrink-0 relative">
                    <Image
                      src={log.thumbnail_url}
                      alt={log.game_name}
                      fill
                      className="object-cover"
                      sizes="40px"
                      onError={() =>
                        setImgErrors((prev) => ({
                          ...prev,
                          [log.id]: true,
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/games/${log.game_id}`}
                        className="text-white text-sm font-medium hover:text-emerald-400 transition-colors"
                      >
                        {log.game_name}
                      </Link>
                      <span className="text-xs text-zinc-500">
                        {new Date(log.played_at).toLocaleDateString()}
                      </span>
                      {log.players && (
                        <span className="text-xs text-zinc-400">
                          👥 {log.players}
                        </span>
                      )}
                      {log.winner && (
                        <span className="text-xs text-yellow-400">
                          🏆 {log.winner}
                        </span>
                      )}
                      {log.rating && (
                        <span className="text-xs text-emerald-400">
                          ★ {log.rating}/10
                        </span>
                      )}
                    </div>
                    {log.notes && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {log.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deletePlayLog(log.id)}
                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {playLogs.length > 10 && (
                <Link
                  href="/stats"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View all {playLogs.length} plays →
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400 text-sm">
                No plays logged yet. Visit a game page to log your first play!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
          <button
            onClick={() => setTab("owned")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "owned"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Owned ({ownedCount})
          </button>
          <button
            onClick={() => setTab("wishlist")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "wishlist"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Wishlist ({wishlistCount})
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="added">Recently Added</option>
          <option value="name">Name A-Z</option>
          <option value="rating">BGG Rating</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={8} />
      ) : sortedItems.length === 0 ? (
        <EmptyState
          icon={tab === "owned" ? "📚" : "♡"}
          title={
            tab === "owned"
              ? "Your collection is empty"
              : "Your wishlist is empty"
          }
          description={
            tab === "owned"
              ? "Start adding games you own to track your collection."
              : "Save games you want to play next."
          }
          action={{ label: "Discover Games", href: "/discover" }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedItems.map(({ game, status, addedAt }) => (
            <div key={game.id} className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-200 flex flex-col">
              <Link href={`/games/${game.id}`} className="block">
                <div className="relative h-48 overflow-hidden bg-zinc-800">
                  {!imgErrors[game.id] ? (
                    <Image
                      src={game.thumbnail_url}
                      alt={game.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [game.id]: true }))
                      }
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎲
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                  <div className="absolute top-2 right-2 text-xs font-bold">
                    {status === "owned" ? (
                      <span className="bg-emerald-500 text-black px-2 py-0.5 rounded-full">
                        Owned
                      </span>
                    ) : (
                      <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full">
                        Wishlist
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1">
                    {game.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Added {new Date(addedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-1 flex gap-2 text-xs text-zinc-400">
                    <span>★ {game.bgg_rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>
                      {game.min_players === game.max_players
                        ? game.min_players
                        : `${game.min_players}-${game.max_players}`}{" "}
                      players
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-3 pb-3 flex gap-2 mt-auto">
                {status === "wishlist" && (
                  <button
                    onClick={() => moveToOwned(game.id)}
                    className="flex-1 text-xs py-1.5 rounded-md bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
                  >
                    → Move to Owned
                  </button>
                )}
                <button
                  onClick={() => removeItem(game.id)}
                  disabled={removing[game.id]}
                  className="text-xs py-1.5 px-2 rounded-md bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                >
                  {removing[game.id] ? "..." : "✕"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
