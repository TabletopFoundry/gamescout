"use client";

import type { Review } from "@/types";
import { StarRating } from "./StarRating";

interface ReviewSectionProps {
  reviews: Review[];
  showReviewForm: boolean;
  reviewRating: number;
  reviewBody: string;
  reviewSubmitting: boolean;
  onToggleForm: () => void;
  onRatingChange: (value: number) => void;
  onBodyChange: (value: string) => void;
  onSubmit: () => void;
}

export function ReviewSection({
  reviews,
  showReviewForm,
  reviewRating,
  reviewBody,
  reviewSubmitting,
  onToggleForm,
  onRatingChange,
  onBodyChange,
  onSubmit,
}: ReviewSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Reviews</h2>
        <button
          onClick={onToggleForm}
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          + Write a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <div className="mb-3">
            <label htmlFor="review-rating" className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
              Rating: {reviewRating}/10
            </label>
            <input
              id="review-rating"
              type="range"
              min={1}
              max={10}
              value={reviewRating}
              onChange={(e) => onRatingChange(Number(e.target.value))}
              className="w-full accent-emerald-500"
              aria-label={`Review rating: ${reviewRating} out of 10`}
            />
          </div>
          <label htmlFor="review-body" className="sr-only">Review text</label>
          <textarea
            id="review-body"
            value={reviewBody}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-3 py-2 text-sm resize-none mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={onSubmit}
              disabled={reviewSubmitting}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-sm rounded-lg transition-colors"
            >
              {reviewSubmitting ? "Saving..." : "Post Review"}
            </button>
            <button
              onClick={onToggleForm}
              className="px-3 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                  {r.username?.[0]?.toUpperCase() || "D"}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {r.username || "Demo User"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={r.rating} />
                </div>
              </div>
              {r.body && (
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {r.body}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}
