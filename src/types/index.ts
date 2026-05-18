/**
 * Shared TypeScript interfaces and helpers used across the application.
 *
 * @module
 */

// ─── Domain types ────────────────────────────────────────────────────────────

/** A board game from the catalog. */
export interface Game {
  id: number;
  name: string;
  year: number;
  description: string;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  complexity: number;
  bgg_rating: number;
  bgg_rank: number;
  categories: string[];
  mechanics: string[];
  designer: string;
  publisher: string;
  image_url: string;
  thumbnail_url: string;
}

/** Whether a game is in the user's collection, and in what capacity. */
export type CollectionStatus = "owned" | "wishlist" | null;

/** A game in the user's collection (owned or wishlist) with full game data. */
export interface CollectionItem {
  collectionId: number;
  status: "owned" | "wishlist";
  addedAt: string;
  game: Game;
}

/** A logged play session with game metadata. */
export interface PlayLog {
  id: number;
  game_id: number;
  game_name: string;
  thumbnail_url: string;
  played_at: string;
  players: number | null;
  winner: string | null;
  rating: number | null;
  score: number | null;
  notes: string | null;
}

/** A play log entry scoped to a single game (no game metadata). */
export interface GamePlayLog {
  id: number;
  played_at: string;
  players: number | null;
  winner: string | null;
  rating: number | null;
  score: number | null;
  notes: string | null;
}

/** A retailer price entry for a game. */
export interface PriceInfo {
  id: number;
  retailer: string;
  price: number;
  url: string;
  updated_at: string;
}

/** A retailer deal surfaced from the seeded promotions dataset. */
export interface DealInfo {
  id: number;
  retailer: string;
  title: string;
  sale_price: number;
  msrp: number;
  discount_pct: number;
  url: string | null;
  starts_at: string;
  ends_at: string;
  coupon_code: string | null;
  featured: number;
}

/** A user review for a game. */
export interface Review {
  id: number;
  rating: number;
  body: string | null;
  created_at: string;
  username: string;
}

/** Possible quiz rating values for a game. */
export type RatingValue =
  | "loved"
  | "liked"
  | "neutral"
  | "disliked"
  | "havent_played";

/** A game with its recommendation score and human-readable reason. */
export interface RecommendedGame {
  game: Game;
  score: number;
  reason: string;
}

/** Full data payload returned by the game detail API. */
export interface GameDetailData {
  game: Game;
  prices: PriceInfo[];
  deals: DealInfo[];
  reviews: Review[];
  similar: Game[];
  collectionStatus: CollectionStatus;
  avgReview: number | null;
  playLogs: GamePlayLog[];
}

// ─── Complexity helpers (shared across components) ───────────────────────────

/** Human-readable labels for integer complexity levels (1-5). */
const COMPLEXITY_LABELS: Record<string, string> = {
  "1": "Light",
  "2": "Medium-Light",
  "3": "Medium",
  "4": "Medium-Heavy",
  "5": "Heavy",
};

/** Map a numeric complexity (1-5) to a human label like "Medium-Heavy". */
export function getComplexityLabel(c: number): string {
  return COMPLEXITY_LABELS[String(Math.round(c))] || "Medium";
}

// Canonical complexity bucketing used for charts and stats
/** Bucket a numeric complexity value into one of five named tiers. */
export function getComplexityBucket(c: number): string {
  if (c < 1.5) return "Light";
  if (c < 2.5) return "Medium-Light";
  if (c < 3.5) return "Medium";
  if (c < 4.5) return "Medium-Heavy";
  return "Heavy";
}

/** Return a Tailwind color class appropriate for a complexity value. */
export function getComplexityColor(c: number): string {
  if (c < 2) return "text-emerald-400";
  if (c < 3) return "text-yellow-400";
  if (c < 4) return "text-orange-400";
  return "text-red-400";
}
