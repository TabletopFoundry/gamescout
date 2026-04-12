"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

interface GameCardProps {
  game: Game;
  reason?: string;
  collectionStatus?: "owned" | "wishlist" | null;
  onCollectionChange?: (gameId: number, status: "owned" | "wishlist" | null) => void;
  size?: "sm" | "md" | "lg";
}

const COMPLEXITY_LABELS: Record<string, string> = {
  "1": "Light",
  "2": "Medium-Light",
  "3": "Medium",
  "4": "Medium-Heavy",
  "5": "Heavy",
};

function getComplexityLabel(c: number) {
  return COMPLEXITY_LABELS[String(Math.round(c))] || "Medium";
}

function getComplexityColor(c: number) {
  if (c < 2) return "text-emerald-400";
  if (c < 3) return "text-yellow-400";
  if (c < 4) return "text-orange-400";
  return "text-red-400";
}

export default function GameCard({
  game,
  reason,
  collectionStatus,
  onCollectionChange,
  size = "md",
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const [status, setStatus] = useState<"owned" | "wishlist" | null>(
    collectionStatus ?? null
  );
  const [loading, setLoading] = useState(false);

  async function handleCollection(s: "owned" | "wishlist") {
    setLoading(true);
    try {
      if (status === s) {
        // Remove
        await fetch(`/api/collection?gameId=${game.id}`, { method: "DELETE" });
        setStatus(null);
        onCollectionChange?.(game.id, null);
      } else {
        await fetch("/api/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.id, status: s }),
        });
        setStatus(s);
        onCollectionChange?.(game.id, s);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const isSmall = size === "sm";

  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
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
            <div className="w-full h-full flex items-center justify-center text-4xl">
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
              👥 {game.min_players === game.max_players
                ? game.min_players
                : `${game.min_players}-${game.max_players}`}
            </span>
            <span className="text-xs text-zinc-400 bg-zinc-800 rounded px-1.5 py-0.5">
              ⏱ {game.min_playtime === game.max_playtime
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
              💡 {reason}
            </p>
          )}
        </div>
      </Link>

      {/* Collection buttons */}
      <div className="px-3 pb-3 flex gap-2 mt-auto">
        <button
          onClick={() => handleCollection("owned")}
          disabled={loading}
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
  );
}
