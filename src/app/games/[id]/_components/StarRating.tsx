"use client";

export function StarRating({
  rating,
  max = 10,
}: {
  rating: number;
  max?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < Math.round(rating) ? "bg-yellow-400" : "bg-zinc-700"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-yellow-400 font-medium">
        {rating.toFixed(1)}/10
      </span>
    </div>
  );
}
