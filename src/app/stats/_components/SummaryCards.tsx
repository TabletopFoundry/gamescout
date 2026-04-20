"use client";

interface SummaryCardsProps {
  totalPlays: number;
  uniqueGames: number;
  ownedCount: number;
  wishlistCount: number;
  avgRating: string | null;
}

export function SummaryCards({
  totalPlays,
  uniqueGames,
  ownedCount,
  wishlistCount,
  avgRating,
}: SummaryCardsProps) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">
            Total Plays
          </p>
          <p className="text-4xl font-bold text-white">{totalPlays}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">
            Unique Games Played
          </p>
          <p className="text-4xl font-bold text-white">{uniqueGames}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">
            In Collection
          </p>
          <p className="text-4xl font-bold text-emerald-400">{ownedCount}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">
            Wishlisted
          </p>
          <p className="text-4xl font-bold text-purple-400">{wishlistCount}</p>
        </div>
      </div>

      {avgRating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">
              Avg Play Rating
            </p>
            <p className="text-4xl font-bold text-yellow-400">{avgRating}</p>
            <p className="text-xs text-zinc-500 mt-1">out of 10</p>
          </div>
        </div>
      )}
    </>
  );
}
