export default function QuizLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16" role="status" aria-label="Loading quiz">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-zinc-800 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-zinc-800 rounded w-1/2 mx-auto" />
        <div className="space-y-3 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-zinc-900 rounded-xl border border-zinc-800" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
