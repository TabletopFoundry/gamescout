import { GridSkeleton } from "@/components/LoadingSkeleton";

export default function CollectionLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="status" aria-label="Loading collection">
      <div className="animate-pulse mb-6">
        <div className="h-8 bg-zinc-800 rounded w-1/3 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-1/5" />
      </div>
      <GridSkeleton count={8} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
