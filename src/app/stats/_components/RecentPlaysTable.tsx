"use client";

import Link from "next/link";
import type { PlayLog } from "@/types";

interface RecentPlaysTableProps {
  logs: PlayLog[];
}

export function RecentPlaysTable({ logs }: RecentPlaysTableProps) {
  if (logs.length === 0) return null;

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Recent Plays</h2>
        <Link
          href="/collection"
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View Collection →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
              <th className="pb-3 pr-4">Game</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Players</th>
              <th className="pb-3 pr-4">Winner</th>
              <th className="pb-3 pr-4">Rating</th>
              <th className="pb-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {logs.slice(0, 15).map((log) => (
              <tr key={log.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="py-3 pr-4">
                  <Link
                    href={`/games/${log.game_id}`}
                    className="text-white hover:text-emerald-400 font-medium transition-colors"
                  >
                    {log.game_name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-zinc-400">
                  {new Date(log.played_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4 text-zinc-400">
                  {log.players || "—"}
                </td>
                <td className="py-3 pr-4 text-yellow-400">
                  {log.winner || "—"}
                </td>
                <td className="py-3 pr-4">
                  {log.rating ? (
                    <span className="text-emerald-400 font-medium">
                      {log.rating}/10
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="py-3 text-sky-400">
                  {log.score ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
