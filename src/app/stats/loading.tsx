export default function StatsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8" role="status" aria-label="Loading stats">
      <div className="animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 h-64" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
