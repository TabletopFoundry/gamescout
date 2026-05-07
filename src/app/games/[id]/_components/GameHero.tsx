"use client";

import Image from "next/image";
import type { Game, CollectionStatus } from "@/types";
import { getComplexityColor } from "@/types";
import { StarRating } from "./StarRating";
import type { Review } from "@/types";

interface GameHeroProps {
  game: Game;
  imgError: boolean;
  onImgError: () => void;
  collectionStatus: CollectionStatus;
  collectionLoading: boolean;
  onCollection: (status: "owned" | "wishlist") => void;
  onLogPlay: () => void;
  avgReview: number | null;
  reviews: Review[];
}

export function GameHero({
  game,
  imgError,
  onImgError,
  collectionStatus,
  collectionLoading,
  onCollection,
  onLogPlay,
  avgReview,
  reviews,
}: GameHeroProps) {
  return (
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
              onError={onImgError}
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
        <CollectionActions
          collectionStatus={collectionStatus}
          collectionLoading={collectionLoading}
          onCollection={onCollection}
          onLogPlay={onLogPlay}
        />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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
            <p className={`font-bold text-lg ${getComplexityColor(game.complexity)}`}>
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
  );
}

function CollectionActions({
  collectionStatus,
  collectionLoading,
  onCollection,
  onLogPlay,
}: {
  collectionStatus: CollectionStatus;
  collectionLoading: boolean;
  onCollection: (status: "owned" | "wishlist") => void;
  onLogPlay: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        onClick={() => onCollection("owned")}
        disabled={collectionLoading}
        aria-pressed={collectionStatus === "owned"}
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
        onClick={() => onCollection("wishlist")}
        disabled={collectionLoading}
        aria-pressed={collectionStatus === "wishlist"}
        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
          collectionStatus === "wishlist"
            ? "bg-purple-500 text-white"
            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
        }`}
      >
        {collectionStatus === "wishlist" ? "♥ Wishlisted" : "♡ Add to Wishlist"}
      </button>
      <button
        onClick={onLogPlay}
        className="w-full py-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-semibold text-sm transition-colors"
      >
        📝 Log a Play
      </button>
    </div>
  );
}
