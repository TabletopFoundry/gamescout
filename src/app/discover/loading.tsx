import { GridSkeleton } from "@/components/LoadingSkeleton";

export default function DiscoverLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="status" aria-label="Loading games">
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-zinc-800 rounded w-1/4 mb-4" />
        <div className="h-10 bg-zinc-800 rounded w-full mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-zinc-800 rounded w-20" />
          ))}
        </div>
      </div>
      <GridSkeleton count={12} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
