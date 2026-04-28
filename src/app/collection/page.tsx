"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import GameCard from "@/components/GameCard";
import type { CollectionItem, PlayLog } from "@/types";

export default function CollectionPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"owned" | "wishlist">("owned");
  const [sortBy, setSortBy] = useState<"added" | "name" | "rating">("added");
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [removing, setRemoving] = useState<Record<number, boolean>>({});
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Play log state
  const [playLogs, setPlayLogs] = useState<PlayLog[]>([]);
  const [playLogsLoading, setPlayLogsLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // Confirmation dialog state
  const [confirmRemove, setConfirmRemove] = useState<{ gameId: number; gameName: string } | null>(null);
  const [confirmDeleteLog, setConfirmDeleteLog] = useState<{ id: number; gameName: string } | null>(null);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playLogsControllerRef = useRef<AbortController | null>(null);

  // Clear timers and abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      playLogsControllerRef.current?.abort();
    };
  }, []);

  function setTimedError(msg: string) {
    setMutationError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setMutationError(null), 3000);
  }

  const loadCollection = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch("/api/collection", { signal });
      if (!res.ok) throw new Error("Failed to load collection");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      console.error("Failed to load collection");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void loadCollection(controller.signal);
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [loadCollection]);

  async function loadPlayLogs() {
    playLogsControllerRef.current?.abort();
    const controller = new AbortController();
    playLogsControllerRef.current = controller;

    setPlayLogsLoading(true);
    try {
      const res = await fetch("/api/play-logs", { signal: controller.signal });
      if (!res.ok) throw new Error("Failed to load play logs");
      const data = await res.json();
      setPlayLogs(data.logs || []);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      console.error("Failed to load play logs");
    } finally {
      if (!controller.signal.aborted) setPlayLogsLoading(false);
    }
  }

  async function removeItem(gameId: number) {
    setRemoving((prev) => ({ ...prev, [gameId]: true }));
    try {
      const res = await fetch(`/api/collection?gameId=${gameId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      setItems((prev) => prev.filter((i) => i.game.id !== gameId));
    } catch {
      setTimedError("Failed to remove game. Please try again.");
    } finally {
      setRemoving((prev) => ({ ...prev, [gameId]: false }));
    }
  }

  async function moveToOwned(gameId: number) {
    try {
      const res = await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, status: "owned" }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setItems((prev) =>
        prev.map((i) =>
          i.game.id === gameId ? { ...i, status: "owned" } : i
        )
      );
    } catch {
      setTimedError("Failed to move game. Please try again.");
    }
  }

  async function deletePlayLog(id: number) {
    try {
      const res = await fetch(`/api/play-logs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPlayLogs((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setTimedError("Failed to delete play log. Please try again.");
    }
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

      {/* Mutation error toast */}
      {mutationError && (
        <div className="mb-4 bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm" role="alert">
          {mutationError}
        </div>
      )}

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
                    {!imgErrors[log.id] ? (
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
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🎲
                      </div>
                    )}
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
                    onClick={() => setConfirmDeleteLog({ id: log.id, gameName: log.game_name })}
                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                    aria-label={`Delete play log for ${log.game_name}`}
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
        <div role="tablist" aria-label="Collection filter" className="flex gap-1 bg-zinc-900 rounded-xl p-1">
          <button
            role="tab"
            aria-selected={tab === "owned"}
            aria-controls="tabpanel-collection"
            id="tab-owned"
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
            role="tab"
            aria-selected={tab === "wishlist"}
            aria-controls="tabpanel-collection"
            id="tab-wishlist"
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
      <div role="tabpanel" id="tabpanel-collection" aria-labelledby={`tab-${tab}`}>
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
            <GameCard
              key={game.id}
              game={game}
              size="sm"
              collectionStatus={status}
              addedAt={addedAt}
              onRemove={(id) => setConfirmRemove({ gameId: id, gameName: game.name })}
              onMoveToOwned={status === "wishlist" ? () => moveToOwned(game.id) : undefined}
              removing={removing[game.id]}
            />
          ))}
        </div>
      )}
      </div>

      <ConfirmDialog
        open={confirmRemove !== null}
        title="Remove from Collection"
        message={`Are you sure you want to remove "${confirmRemove?.gameName}" from your collection? This cannot be undone.`}
        confirmLabel="Remove"
        onConfirm={() => {
          if (confirmRemove) removeItem(confirmRemove.gameId);
          setConfirmRemove(null);
        }}
        onCancel={() => setConfirmRemove(null)}
      />

      <ConfirmDialog
        open={confirmDeleteLog !== null}
        title="Delete Play Log"
        message={`Are you sure you want to delete this play log for "${confirmDeleteLog?.gameName}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDeleteLog) deletePlayLog(confirmDeleteLog.id);
          setConfirmDeleteLog(null);
        }}
        onCancel={() => setConfirmDeleteLog(null)}
      />
    </div>
  );
}
