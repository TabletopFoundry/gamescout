"use client";

import { use, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import GameCard from "@/components/GameCard";

interface PriceRow {
  id: number;
  retailer: string;
  price: number;
  url: string;
  updated_at: string;
}

interface Review {
  id: number;
  rating: number;
  body: string | null;
  created_at: string;
  username: string;
}

interface PlayLog {
  id: number;
  played_at: string;
  players: number | null;
  winner: string | null;
  rating: number | null;
  notes: string | null;
}

interface Game {
  id: number;
  name: string;
  year: number;
  description: string;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  complexity: number;
  bgg_rating: number;
  bgg_rank: number;
  categories: string[];
  mechanics: string[];
  designer: string;
  publisher: string;
  image_url: string;
  thumbnail_url: string;
}

interface GameDetailData {
  game: Game;
  prices: PriceRow[];
  reviews: Review[];
  similar: Game[];
  collectionStatus: "owned" | "wishlist" | null;
  avgReview: number | null;
  playLogs: PlayLog[];
}

function StarRating({
  rating,
  max = 10,
}: {
  rating: number;
  max?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < Math.round(rating) ? "bg-yellow-400" : "bg-zinc-700"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-yellow-400 font-medium">
        {rating.toFixed(1)}/10
      </span>
    </div>
  );
}

function COMPLEXITY_COLOR(c: number) {
  if (c < 2) return "text-emerald-400";
  if (c < 3) return "text-yellow-400";
  if (c < 4) return "text-orange-400";
  return "text-red-400";
}

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<GameDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState<
    "owned" | "wishlist" | null
  >(null);
  const [collectionLoading, setCollectionLoading] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(7);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Play log form state
  const [showLogForm, setShowLogForm] = useState(false);
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [logPlayers, setLogPlayers] = useState("");
  const [logWinner, setLogWinner] = useState("");
  const [logRating, setLogRating] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [logSubmitting, setLogSubmitting] = useState(false);

  // Price alert state
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSubmitting, setAlertSubmitting] = useState(false);
  const [alertSet, setAlertSet] = useState(false);

  const loadGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/games/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Game not found");
        throw new Error("Failed to load game");
      }
      const d = await res.json();
      setData(d);
      setCollectionStatus(d.collectionStatus);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load game");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadGame();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadGame]);

  async function handleCollection(status: "owned" | "wishlist") {
    setCollectionLoading(true);
    try {
      if (collectionStatus === status) {
        await fetch(`/api/collection?gameId=${id}`, { method: "DELETE" });
        setCollectionStatus(null);
      } else {
        await fetch("/api/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: Number(id), status }),
        });
        setCollectionStatus(status);
      }
    } finally {
      setCollectionLoading(false);
    }
  }

  async function submitReview() {
    setReviewSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: Number(id),
          rating: reviewRating,
          body: reviewBody,
        }),
      });
      setShowReviewForm(false);
      loadGame();
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function submitLog() {
    setLogSubmitting(true);
    try {
      await fetch("/api/play-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: Number(id),
          playedAt: logDate,
          players: logPlayers ? Number(logPlayers) : undefined,
          winner: logWinner || undefined,
          rating: logRating ? Number(logRating) : undefined,
          notes: logNotes || undefined,
        }),
      });
      setShowLogForm(false);
      setLogDate(new Date().toISOString().split("T")[0]);
      setLogPlayers("");
      setLogWinner("");
      setLogRating("");
      setLogNotes("");
      loadGame();
    } finally {
      setLogSubmitting(false);
    }
  }

  async function submitAlert() {
    setAlertSubmitting(true);
    try {
      await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: Number(id),
          targetPrice: Number(alertPrice),
          email: alertEmail || undefined,
        }),
      });
      setShowAlertForm(false);
      setAlertSet(true);
    } finally {
      setAlertSubmitting(false);
    }
  }

  if (loading) return <DetailSkeleton />;

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {error || "Game not found"}
        </h1>
        <p className="text-zinc-400 mb-6">
          The game you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
        </p>
        <Link
          href="/discover"
          className="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg"
        >
          Back to Discovery
        </Link>
      </div>
    );
  }

  const { game, prices, reviews, similar, playLogs, avgReview } = data;
  const lowestPrice =
    prices.length > 0 ? prices.reduce((a, b) => (a.price < b.price ? a : b)) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/discover" className="hover:text-zinc-300">
          Discover
        </Link>
        <span>/</span>
        <span className="text-zinc-300 truncate">{game.name}</span>
      </div>

      {/* Main Detail */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Cover Art */}
        <div className="md:w-64 shrink-0">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800">
            {!imgError ? (
              <Image
                src={game.image_url || game.thumbnail_url}
                alt={game.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                sizes="256px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🎲
              </div>
            )}
          </div>

          {/* Collection Actions */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => handleCollection("owned")}
              disabled={collectionLoading}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                collectionStatus === "owned"
                  ? "bg-emerald-500 text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {collectionStatus === "owned"
                ? "✓ In Your Collection"
                : "+ Add to Collection"}
            </button>
            <button
              onClick={() => handleCollection("wishlist")}
              disabled={collectionLoading}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                collectionStatus === "wishlist"
                  ? "bg-purple-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {collectionStatus === "wishlist" ? "♥ Wishlisted" : "♡ Add to Wishlist"}
            </button>
            <button
              onClick={() => setShowLogForm(true)}
              className="w-full py-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-semibold text-sm transition-colors"
            >
              📝 Log a Play
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-4xl font-bold text-white leading-tight">
              {game.name}
            </h1>
            <div className="shrink-0 flex items-center gap-1 bg-yellow-400/10 rounded-lg px-3 py-1.5">
              <span className="text-yellow-400 font-bold text-lg">
                {game.bgg_rating.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-500">BGG</span>
            </div>
          </div>

          <p className="text-zinc-400 text-sm mb-4">
            {game.year} · {game.publisher} · Designed by {game.designer}
          </p>

          {avgReview !== null && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={avgReview} />
              <span className="text-xs text-zinc-500">
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Players</p>
              <p className="text-white font-bold text-lg">
                {game.min_players === game.max_players
                  ? game.min_players
                  : `${game.min_players}-${game.max_players}`}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Playtime</p>
              <p className="text-white font-bold text-lg">
                {game.min_playtime === game.max_playtime
                  ? `${game.min_playtime}m`
                  : `${game.min_playtime}-${game.max_playtime}m`}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Complexity</p>
              <p className={`font-bold text-lg ${COMPLEXITY_COLOR(game.complexity)}`}>
                {game.complexity.toFixed(1)}/5
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-300 leading-relaxed mb-6">
            {game.description}
          </p>

          {/* Categories & Mechanics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {game.categories.map((c) => (
              <span
                key={c}
                className="text-xs bg-emerald-400/10 text-emerald-400 rounded-full px-3 py-1"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {game.mechanics.map((m) => (
              <span
                key={m}
                className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-3 py-1"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Price Tracker */}
      <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Price Comparison</h2>
          <p className="text-xs text-zinc-500">
            * Prices are informational. We may earn affiliate commission.
          </p>
        </div>

        {prices.length > 0 ? (
          <>
            <div className="space-y-3 mb-4">
              {prices.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    lowestPrice?.id === p.id
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {lowestPrice?.id === p.id && (
                      <span className="text-xs bg-emerald-500 text-black font-bold px-2 py-0.5 rounded-full">
                        Best Price
                      </span>
                    )}
                    <span className="text-white font-medium">{p.retailer}</span>
                    <span className="text-xs text-zinc-500">
                      Updated {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">
                      ${p.price.toFixed(2)}
                    </span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-lg transition-colors"
                    >
                      Buy →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Deal Alert */}
            {!alertSet && !showAlertForm && (
              <button
                onClick={() => setShowAlertForm(true)}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                🔔 Set a deal alert
              </button>
            )}
            {alertSet && (
              <p className="text-sm text-emerald-400">
                ✓ Deal alert set! We&apos;ll notify you when the price drops.
              </p>
            )}
            {showAlertForm && (
              <div className="mt-4 bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Set Deal Alert
                </h3>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="number"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder="Target price ($)"
                    className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
                  />
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
                  />
                  <button
                    onClick={submitAlert}
                    disabled={!alertPrice || alertSubmitting}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-sm rounded-lg transition-colors"
                  >
                    {alertSubmitting ? "..." : "Set Alert"}
                  </button>
                  <button
                    onClick={() => setShowAlertForm(false)}
                    className="px-3 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-zinc-500 text-sm">
            No pricing data available for this title.
          </p>
        )}
      </section>

      {/* Play Logs Section */}
      {playLogs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Your Play History
          </h2>
          <div className="space-y-3">
            {playLogs.map((log) => (
              <div
                key={log.id}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-start gap-4"
              >
                <div className="shrink-0 text-center">
                  <p className="text-lg">🎮</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white font-medium text-sm">
                      {new Date(log.played_at).toLocaleDateString()}
                    </span>
                    {log.players && (
                      <span className="text-xs text-zinc-400">
                        👥 {log.players} players
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
                    <p className="text-xs text-zinc-500 mt-1 italic">
                      {log.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Log Play Modal */}
      {showLogForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Log a Play — {game.name}
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Date Played *
                </span>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Number of Players
                </span>
                <input
                  type="number"
                  value={logPlayers}
                  onChange={(e) => setLogPlayers(e.target.value)}
                  placeholder="e.g. 4"
                  min={1}
                  max={20}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Winner
                </span>
                <input
                  type="text"
                  value={logWinner}
                  onChange={(e) => setLogWinner(e.target.value)}
                  placeholder="Who won?"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Your Rating (1-10)
                </span>
                <input
                  type="number"
                  value={logRating}
                  onChange={(e) => setLogRating(e.target.value)}
                  placeholder="e.g. 8"
                  min={1}
                  max={10}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Notes
                </span>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="How did it go?"
                  rows={2}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none"
                />
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={submitLog}
                disabled={!logDate || logSubmitting}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-lg transition-colors"
              >
                {logSubmitting ? "Saving..." : "Save Play"}
              </button>
              <button
                onClick={() => setShowLogForm(false)}
                className="px-4 py-2.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            + Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
            <div className="mb-3">
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                Rating: {reviewRating}/10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-3 py-2 text-sm resize-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={submitReview}
                disabled={reviewSubmitting}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-sm rounded-lg transition-colors"
              >
                {reviewSubmitting ? "Saving..." : "Post Review"}
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-3 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-zinc-900 rounded-xl border border-zinc-800 p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                    {r.username?.[0]?.toUpperCase() || "D"}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {r.username || "Demo User"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                {r.body && (
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {r.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </section>

      {/* Similar Games */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Similar Games</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((g) => (
              <GameCard key={g.id} game={g} size="sm" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
