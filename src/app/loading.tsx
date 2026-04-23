export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8" role="status" aria-label="Loading page">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-zinc-800 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 h-24" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-zinc-800 rounded" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
