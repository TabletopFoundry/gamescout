// Shared types used across the application

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

export type CollectionStatus = "owned" | "wishlist" | null;

export interface CollectionItem {
  collectionId: number;
  status: "owned" | "wishlist";
  addedAt: string;
  game: Game;
}

export interface PlayLog {
  id: number;
  game_id: number;
  game_name: string;
  thumbnail_url: string;
  played_at: string;
  players: number | null;
  winner: string | null;
  rating: number | null;
  notes: string | null;
}

export interface GamePlayLog {
  id: number;
  played_at: string;
  players: number | null;
  winner: string | null;
  rating: number | null;
  notes: string | null;
}

export interface PriceInfo {
  id: number;
  retailer: string;
  price: number;
  url: string;
  updated_at: string;
}

export interface Review {
  id: number;
  rating: number;
  body: string | null;
  created_at: string;
  username: string;
}

export type RatingValue =
  | "loved"
  | "liked"
  | "neutral"
  | "disliked"
  | "havent_played";

export interface RecommendedGame {
  game: Game;
  score: number;
  reason: string;
}

export interface GameDetailData {
  game: Game;
  prices: PriceInfo[];
  reviews: Review[];
  similar: Game[];
  collectionStatus: CollectionStatus;
  avgReview: number | null;
  playLogs: GamePlayLog[];
}

// Complexity color/label helpers (shared across components)
const COMPLEXITY_LABELS: Record<string, string> = {
  "1": "Light",
  "2": "Medium-Light",
  "3": "Medium",
  "4": "Medium-Heavy",
  "5": "Heavy",
};

export function getComplexityLabel(c: number): string {
  return COMPLEXITY_LABELS[String(Math.round(c))] || "Medium";
}

export function getComplexityColor(c: number): string {
  if (c < 2) return "text-emerald-400";
  if (c < 3) return "text-yellow-400";
  if (c < 4) return "text-orange-400";
  return "text-red-400";
}
