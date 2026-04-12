export function GameCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex flex-col animate-pulse">
      <div className="h-52 bg-zinc-800" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/4" />
        <div className="flex gap-1">
          <div className="h-5 bg-zinc-800 rounded w-12" />
          <div className="h-5 bg-zinc-800 rounded w-16" />
          <div className="h-5 bg-zinc-800 rounded w-14" />
        </div>
      </div>
      <div className="px-3 pb-3 flex gap-2">
        <div className="flex-1 h-7 bg-zinc-800 rounded-md" />
        <div className="flex-1 h-7 bg-zinc-800 rounded-md" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <div className="aspect-[3/4] bg-zinc-800 rounded-xl" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-8 bg-zinc-800 rounded w-2/3" />
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-zinc-800 rounded w-20" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
