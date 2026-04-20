"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import GameCard from "@/components/GameCard";
import type { GameDetailData, CollectionStatus } from "@/types";
import { GameHero } from "./_components/GameHero";
import { PriceComparison } from "./_components/PriceComparison";
import { PlayLogSection } from "./_components/PlayLogSection";
import { ReviewSection } from "./_components/ReviewSection";

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
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>(null);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [similarStatuses, setSimilarStatuses] = useState<Record<number, CollectionStatus>>({});

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
  const [mutationError, setMutationError] = useState<string | null>(null);

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
      void loadCollectionStatuses();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadGame]);

  async function loadCollectionStatuses() {
    try {
      const res = await fetch("/api/collection");
      const data = await res.json();
      const statuses: Record<number, CollectionStatus> = {};
      for (const item of data.items || []) {
        statuses[item.game.id] = item.status;
      }
      setSimilarStatuses(statuses);
    } catch {
      // non-critical
    }
  }

  function handleSimilarCollectionChange(gameId: number, status: CollectionStatus) {
    setSimilarStatuses((prev) => ({ ...prev, [gameId]: status }));
  }

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
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: Number(id),
          rating: reviewRating,
          body: reviewBody,
        }),
      });
      if (!res.ok) throw new Error("Failed to post review");
      setShowReviewForm(false);
      loadGame();
    } catch {
      setMutationError("Failed to save review. Please try again.");
      setTimeout(() => setMutationError(null), 3000);
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function submitLog() {
    setLogSubmitting(true);
    try {
      const res = await fetch("/api/play-logs", {
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
      if (!res.ok) throw new Error("Failed to log play");
      setShowLogForm(false);
      setLogDate(new Date().toISOString().split("T")[0]);
      setLogPlayers("");
      setLogWinner("");
      setLogRating("");
      setLogNotes("");
      loadGame();
    } catch {
      setMutationError("Failed to save play log. Please try again.");
      setTimeout(() => setMutationError(null), 3000);
    } finally {
      setLogSubmitting(false);
    }
  }

  async function submitAlert() {
    setAlertSubmitting(true);
    try {
      const res = await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: Number(id),
          targetPrice: Number(alertPrice),
          email: alertEmail || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to set alert");
      setShowAlertForm(false);
      setAlertSet(true);
    } catch {
      setMutationError("Failed to set price alert. Please try again.");
      setTimeout(() => setMutationError(null), 3000);
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

      {/* Mutation error toast */}
      {mutationError && (
        <div className="mb-4 bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm" role="alert">
          {mutationError}
        </div>
      )}

      <GameHero
        game={game}
        imgError={imgError}
        onImgError={() => setImgError(true)}
        collectionStatus={collectionStatus}
        collectionLoading={collectionLoading}
        onCollection={handleCollection}
        onLogPlay={() => setShowLogForm(true)}
        avgReview={avgReview}
        reviews={reviews}
      />

      <PriceComparison
        prices={prices}
        showAlertForm={showAlertForm}
        alertSet={alertSet}
        alertPrice={alertPrice}
        alertEmail={alertEmail}
        alertSubmitting={alertSubmitting}
        onAlertPriceChange={setAlertPrice}
        onAlertEmailChange={setAlertEmail}
        onSubmitAlert={submitAlert}
        onShowAlertForm={() => setShowAlertForm(true)}
        onCancelAlert={() => setShowAlertForm(false)}
      />

      <PlayLogSection
        playLogs={playLogs}
        gameName={game.name}
        showLogForm={showLogForm}
        logDate={logDate}
        logPlayers={logPlayers}
        logWinner={logWinner}
        logRating={logRating}
        logNotes={logNotes}
        logSubmitting={logSubmitting}
        onShowLogForm={setShowLogForm}
        onLogDateChange={setLogDate}
        onLogPlayersChange={setLogPlayers}
        onLogWinnerChange={setLogWinner}
        onLogRatingChange={setLogRating}
        onLogNotesChange={setLogNotes}
        onSubmitLog={submitLog}
      />

      <ReviewSection
        reviews={reviews}
        showReviewForm={showReviewForm}
        reviewRating={reviewRating}
        reviewBody={reviewBody}
        reviewSubmitting={reviewSubmitting}
        onToggleForm={() => setShowReviewForm(!showReviewForm)}
        onRatingChange={setReviewRating}
        onBodyChange={setReviewBody}
        onSubmit={submitReview}
      />

      {/* Similar Games */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Similar Games</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                size="sm"
                collectionStatus={similarStatuses[g.id]}
                onCollectionChange={handleSimilarCollectionChange}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
