"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/types";

type TopGame = Pick<Game, "id" | "name" | "bgg_rating" | "thumbnail_url">;

function TopGameItem({ game }: { game: TopGame }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/games/${game.id}`}
      className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800 flex items-center justify-center">
        {!imgError ? (
          <Image
            src={game.thumbnail_url}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-4xl">🎲</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-xs font-semibold text-white leading-tight line-clamp-2">
            {game.name}
          </p>
          <p className="text-xs text-yellow-400">★ {game.bgg_rating.toFixed(1)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function TopGamesShowcase({ games }: { games: TopGame[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {games.map((game) => (
        <TopGameItem key={game.id} game={game} />
      ))}
    </div>
  );
}
