"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Game, CollectionStatus } from "@/types";
import { getComplexityLabel, getComplexityColor } from "@/types";

interface GameCardProps {
  game: Game;
  reason?: string;
  collectionStatus?: CollectionStatus;
  onCollectionChange?: (gameId: number, status: CollectionStatus) => void;
  size?: "sm" | "md" | "lg";
}

export default function GameCard({
  game,
  reason,
  collectionStatus,
  onCollectionChange,
  size = "md",
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const [status, setStatus] = useState<CollectionStatus>(
    collectionStatus ?? null
  );
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Sync status when prop changes (S1 fix)
  useEffect(() => {
    setStatus(collectionStatus ?? null);
  }, [collectionStatus]);

  async function handleCollection(s: "owned" | "wishlist") {
    setLoading(true);
    setActionError(null);
    try {
      if (status === s) {
        const res = await fetch(`/api/collection?gameId=${game.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to update");
        setStatus(null);
        onCollectionChange?.(game.id, null);
      } else {
        const res = await fetch("/api/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.id, status: s }),
        });
        if (!res.ok) throw new Error("Failed to update");
        setStatus(s);
        onCollectionChange?.(game.id, s);
      }
    } catch {
      setActionError("Failed to update");
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  const isSmall = size === "sm";

  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      {/* Card content as a link — no interactive children inside */}
      <Link href={`/games/${game.id}`} className="block">
        <div
          className={`relative overflow-hidden bg-zinc-800 ${isSmall ? "h-40" : "h-52"}`}
        >
          {!imgError ? (
            <Image
              src={game.thumbnail_url}
              alt={game.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl" aria-hidden="true">
              🎲
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />

          {/* BGG Rating badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur rounded-md px-2 py-0.5 text-xs font-bold text-yellow-400">
            ★ {game.bgg_rating.toFixed(1)}
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1">
            {game.name}
          </h3>
          <p className="text-xs text-zinc-500 mb-2">{game.year}</p>

          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs text-zinc-400 bg-zinc-800 rounded px-1.5 py-0.5">
              <span aria-hidden="true">👥</span> {game.min_players === game.max_players
                ? game.min_players
                : `${game.min_players}-${game.max_players}`}
            </span>
            <span className="text-xs text-zinc-400 bg-zinc-800 rounded px-1.5 py-0.5">
              <span aria-hidden="true">⏱</span> {game.min_playtime === game.max_playtime
                ? `${game.min_playtime}m`
                : `${game.min_playtime}-${game.max_playtime}m`}
            </span>
            <span className={`text-xs bg-zinc-800 rounded px-1.5 py-0.5 ${getComplexityColor(game.complexity)}`}>
              {getComplexityLabel(game.complexity)}
            </span>
          </div>

          {game.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {game.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="text-xs text-emerald-400/70 bg-emerald-400/10 rounded px-1.5 py-0.5"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {reason && (
            <p className="mt-2 text-xs text-zinc-500 italic line-clamp-2">
              <span aria-hidden="true">💡</span> {reason}
            </p>
          )}
        </div>
      </Link>

      {/* Collection buttons — outside the link to avoid nested interactives */}
      <div className="px-3 pb-3 mt-auto">
        {actionError && (
          <p className="text-xs text-red-400 mb-1" role="alert">{actionError}</p>
        )}
        <div className="flex gap-2">
        <button
          onClick={() => handleCollection("owned")}
          disabled={loading}
          aria-pressed={status === "owned"}
          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
            status === "owned"
              ? "bg-emerald-500 text-black"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {status === "owned" ? "✓ Owned" : "+ Owned"}
        </button>
        <button
          onClick={() => handleCollection("wishlist")}
          disabled={loading}
          aria-pressed={status === "wishlist"}
          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
            status === "wishlist"
              ? "bg-purple-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {status === "wishlist" ? "♥ Saved" : "♡ Save"}
        </button>
        </div>
      </div>
    </div>
  );
}
