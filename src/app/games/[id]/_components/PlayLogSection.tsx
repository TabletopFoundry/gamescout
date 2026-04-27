"use client";

import { useEffect, useRef } from "react";
import type { GamePlayLog } from "@/types";

interface PlayLogSectionProps {
  playLogs: GamePlayLog[];
  gameName: string;
  showLogForm: boolean;
  logDate: string;
  logPlayers: string;
  logWinner: string;
  logRating: string;
  logNotes: string;
  logSubmitting: boolean;
  onShowLogForm: (show: boolean) => void;
  onLogDateChange: (value: string) => void;
  onLogPlayersChange: (value: string) => void;
  onLogWinnerChange: (value: string) => void;
  onLogRatingChange: (value: string) => void;
  onLogNotesChange: (value: string) => void;
  onSubmitLog: () => void;
}

export function PlayLogSection({
  playLogs,
  gameName,
  showLogForm,
  logDate,
  logPlayers,
  logWinner,
  logRating,
  logNotes,
  logSubmitting,
  onShowLogForm,
  onLogDateChange,
  onLogPlayersChange,
  onLogWinnerChange,
  onLogRatingChange,
  onLogNotesChange,
  onSubmitLog,
}: PlayLogSectionProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus trap and restore for modal
  useEffect(() => {
    if (!showLogForm) return;

    // Remember the element that triggered the modal
    triggerRef.current = document.activeElement as HTMLElement;

    // Move focus into the modal on open
    const firstInput = modalRef.current?.querySelector<HTMLElement>("input, button, textarea");
    firstInput?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onShowLogForm(false);
        return;
      }

      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to trigger element on close
      triggerRef.current?.focus();
    };
  }, [showLogForm, onShowLogForm]);

  return (
    <>
      {/* Play Logs List */}
      {playLogs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Your Play History
          </h2>
          <div className="space-y-3">
            {playLogs.map((log) => (
              <div
                key={log.id}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-start gap-4"
              >
                <div className="shrink-0 text-center">
                  <p className="text-lg">🎮</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white font-medium text-sm">
                      {new Date(log.played_at).toLocaleDateString()}
                    </span>
                    {log.players && (
                      <span className="text-xs text-zinc-400">
                        👥 {log.players} players
                      </span>
                    )}
                    {log.winner && (
                      <span className="text-xs text-yellow-400">
                        🏆 {log.winner}
                      </span>
                    )}
                    {log.rating && (
                      <span className="text-xs text-emerald-400">
                        ★ {log.rating}/10
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-xs text-zinc-500 mt-1 italic">
                      {log.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Log Play Modal */}
      {showLogForm && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Log a play for ${gameName}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) onShowLogForm(false);
          }}
        >
          <div ref={modalRef} className="bg-zinc-900 rounded-2xl border border-zinc-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Log a Play — {gameName}
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Date Played *
                </span>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => onLogDateChange(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Number of Players
                </span>
                <input
                  type="number"
                  value={logPlayers}
                  onChange={(e) => onLogPlayersChange(e.target.value)}
                  placeholder="e.g. 4"
                  min={1}
                  max={20}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Winner
                </span>
                <input
                  type="text"
                  value={logWinner}
                  onChange={(e) => onLogWinnerChange(e.target.value)}
                  placeholder="Who won?"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Your Rating (1-10)
                </span>
                <input
                  type="number"
                  value={logRating}
                  onChange={(e) => onLogRatingChange(e.target.value)}
                  placeholder="e.g. 8"
                  min={1}
                  max={10}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                  Notes
                </span>
                <textarea
                  value={logNotes}
                  onChange={(e) => onLogNotesChange(e.target.value)}
                  placeholder="How did it go?"
                  rows={2}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none"
                />
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={onSubmitLog}
                disabled={!logDate || logSubmitting}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-lg transition-colors"
              >
                {logSubmitting ? "Saving..." : "Save Play"}
              </button>
              <button
                onClick={() => onShowLogForm(false)}
                className="px-4 py-2.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
