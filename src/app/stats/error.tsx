"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function StatsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Stats error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">📊</div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Failed to load stats
      </h2>
      <p className="text-zinc-400 mb-6 text-sm">
        Something went wrong while loading your stats. Please try again.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => unstable_retry()}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-zinc-600">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
