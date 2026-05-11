/**
 * Content-based recommendation engine.
 *
 * Builds a taste profile from quiz answers and scores every game in the
 * catalog by complexity, theme, mechanics, player-count, and duration fit.
 *
 * @module
 */

import { getDb, parseGame, type GameRow, type QuizAnswerRow, GAME_COLUMNS } from "./db";
import type { RatingValue, RecommendedGame } from "@/types";

/** Maps quiz rating labels to numeric weights for scoring. */
const RATING_SCORES: Record<RatingValue, number> = {
  loved: 2,
  liked: 1,
  neutral: 0,
  disliked: -1,
  havent_played: 0,
};

function parsePreferenceRange(value: string | undefined): [number, number] | null {
  if (!value) return null;
  const [rawMin, rawMax] = value.split("-");
  const min = Number(rawMin);
  const max = Number(rawMax);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return [min, max];
}

function describePlayerCount(value: string): string {
  const range = parsePreferenceRange(value);
  if (!range) return value;
  const [min, max] = range;
  if (min === 1 && max === 1) return "solo play";
  if (min === max) return `${min} players`;
  if (max >= 99) return `${min}+ players`;
  return `${min}-${max} players`;
}

function describeDuration(value: string): string {
  const range = parsePreferenceRange(value);
  if (!range) return value;
  const [min, max] = range;
  if (min === 0) return `up to ${max} minutes`;
  if (max >= 999) return `${min}+ minutes`;
  return `${min}-${max} minutes`;
}

/** A user's derived taste preferences based on quiz answers. */
export interface TasteProfile {
  preferredComplexity: number; // 1-5
  preferredPlayerCount: string;
  preferredDuration: string;
  preferredThemes: string[];
  preferredMechanics: string[];
  summary: string;
}

/**
 * Build a taste profile from a user's quiz answers.
 *
 * Analyses game ratings to compute preferred complexity, top themes,
 * and top mechanics. Falls back to sensible defaults when no data exists.
 */
export function buildTasteProfile(userId: number): TasteProfile {
  const db = getDb();

  const answers = db
    .prepare(
      `SELECT id, user_id, game_id, rating, preference_key, preference_value, created_at FROM quiz_answers WHERE user_id = ? ORDER BY created_at DESC`
    )
    .all(userId) as QuizAnswerRow[];

  // Extract game ratings
  const gameRatings = answers.filter((a) => a.game_id !== null && a.rating);

  // Extract preferences
  const prefs: Record<string, string> = {};
  answers
    .filter((a) => a.preference_key)
    .forEach((a) => {
      prefs[a.preference_key!] = a.preference_value ?? "";
    });

  // Compute complexity preference from rated games
  let complexitySum = 0;
  let ratedCount = 0;
  const explicitThemes = (prefs["themes"] || "")
    .split(",")
    .map((theme) => theme.trim())
    .filter(Boolean);
  const likedThemes: Record<string, number> = {};
  const likedMechanics: Record<string, number> = {};

  // Batch-fetch all rated game IDs in a single query (fixes N+1)
  const ratedGameIds = gameRatings
    .filter((a) => a.game_id && a.rating)
    .map((a) => a.game_id!);
  const gameMap = new Map<number, ReturnType<typeof parseGame>>();
  if (ratedGameIds.length > 0) {
    const placeholders = ratedGameIds.map(() => "?").join(",");
    // Safety: ratedGameIds are from a trusted DB query (quiz_answers), not user input
    const gameRows = db
      .prepare(`SELECT ${GAME_COLUMNS} FROM games WHERE id IN (${placeholders})`)
      .all(...ratedGameIds) as GameRow[];
    for (const row of gameRows) {
      gameMap.set(row.id, parseGame(row));
    }
  }

  for (const ans of gameRatings) {
    if (!ans.game_id || !ans.rating) continue;
    const score = RATING_SCORES[ans.rating as RatingValue] ?? 0;
    if (score === 0) continue;

    const game = gameMap.get(ans.game_id);
    if (!game) continue;

    complexitySum += game.complexity * score;
    ratedCount += Math.abs(score);

    if (score > 0) {
      for (const c of game.categories) {
        likedThemes[c] = (likedThemes[c] || 0) + score;
      }
      for (const m of game.mechanics) {
        likedMechanics[m] = (likedMechanics[m] || 0) + score;
      }
    }
  }

  const preferredComplexityRange = parsePreferenceRange(prefs["complexity"]);
  const preferredComplexityFromPrefs = preferredComplexityRange
    ? (preferredComplexityRange[0] + preferredComplexityRange[1]) / 2
    : null;
  const preferredComplexity = Math.max(
    1,
    Math.min(
      5,
      ratedCount > 0
        ? preferredComplexityFromPrefs !== null
          ? (complexitySum / ratedCount + preferredComplexityFromPrefs) / 2
          : complexitySum / ratedCount
        : preferredComplexityFromPrefs ?? 2.5
    )
  );

  explicitThemes.forEach((theme) => {
    likedThemes[theme] = (likedThemes[theme] || 0) + 2;
  });

  const topThemes = Object.entries(likedThemes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const topMechanics = Object.entries(likedMechanics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const preferredPlayerCount = prefs["player_count"] || "3-4";
  const preferredDuration = prefs["duration"] || "30-90";

  // Build human summary
  const complexityLabel =
    preferredComplexity < 2
      ? "light"
      : preferredComplexity < 3
        ? "medium-light"
        : preferredComplexity < 4
          ? "medium-heavy"
          : "heavy";

  const themeText =
    topThemes.length > 0 ? topThemes.slice(0, 2).join(" and ") : "varied";
  const mechanicsText =
    topMechanics.length > 0
      ? topMechanics.slice(0, 2).join(" and ")
      : "varied";

  const summary = `You enjoy ${complexityLabel}-weight games with ${themeText} themes. You're drawn to ${mechanicsText} mechanics, and prefer ${describePlayerCount(preferredPlayerCount)} for ${describeDuration(preferredDuration)}.`;

  return {
    preferredComplexity,
    preferredPlayerCount,
    preferredDuration,
    preferredThemes: topThemes,
    preferredMechanics: topMechanics,
    summary,
  };
}

/**
 * Generate personalised game recommendations for a user.
 *
 * Scores all games in the catalog against the user's taste profile and
 * returns the top `limit` results, excluding already-owned and disliked games.
 *
 * When no quiz answers exist, falls back to a community-rated top list.
 */
export function getRecommendations(
  userId: number,
  limit = 20
): RecommendedGame[] {
  const db = getDb();

  // Get owned/wishlisted game IDs to exclude
  const collectionIds = new Set(
    (
      db
        .prepare(
          `SELECT game_id FROM collection WHERE user_id = ? AND status = 'owned'`
        )
        .all(userId) as { game_id: number }[]
    ).map((r) => r.game_id)
  );

  // Get quiz ratings
  const ratings: Record<number, RatingValue> = {};
  const answers = db
    .prepare(`SELECT id, user_id, game_id, rating, preference_key, preference_value, created_at FROM quiz_answers WHERE user_id = ?`)
    .all(userId) as QuizAnswerRow[];
  answers.forEach((a) => {
    if (a.game_id && a.rating)
      ratings[a.game_id] = a.rating as RatingValue;
  });

  const profile = buildTasteProfile(userId);

  // TODO: Move to SQL when game catalog exceeds ~500 entries
  const allGames = (
    db.prepare(`SELECT ${GAME_COLUMNS} FROM games ORDER BY bgg_rank ASC`).all() as GameRow[]
  ).map(parseGame);

  const scored: RecommendedGame[] = [];

  // Build Map for O(1) lookups of rated games
  const allGamesMap = new Map(allGames.map((g) => [g.id, g]));

  for (const game of allGames) {
    if (collectionIds.has(game.id)) continue;

    const existingRating = ratings[game.id];
    if (existingRating === "disliked") continue;
    if (existingRating === "loved" || existingRating === "liked") continue; // already rated high — skip

    let score = 0;
    const reasons: string[] = [];

    // Complexity match (max 30 pts)
    const complexityDiff = Math.abs(game.complexity - profile.preferredComplexity);
    const complexityScore = Math.max(0, 30 - complexityDiff * 15);
    score += complexityScore;
    if (complexityDiff < 0.5) reasons.push(`matches your preferred complexity`);

    // Theme match (max 30 pts)
    const themeMatches = game.categories.filter((c) =>
      profile.preferredThemes.includes(c)
    );
    if (themeMatches.length > 0) {
      score += themeMatches.length * 15;
      reasons.push(`has ${themeMatches[0]} theme you enjoy`);
    }

    // Mechanics match (max 30 pts)
    const mechanicsMatches = game.mechanics.filter((m) =>
      profile.preferredMechanics.includes(m)
    );
    if (mechanicsMatches.length > 0) {
      score += mechanicsMatches.length * 10;
      reasons.push(`uses ${mechanicsMatches[0]} mechanics`);
    }

    // BGG rating boost (max 20 pts)
    score += (game.bgg_rating / 10) * 20;

    // Player count preference
    const playerCountRange = parsePreferenceRange(profile.preferredPlayerCount || "3-4");
    if (
      playerCountRange &&
      game.min_players <= playerCountRange[1] &&
      game.max_players >= playerCountRange[0]
    ) {
      score += 10;
      reasons.push(`works well for ${describePlayerCount(profile.preferredPlayerCount)}`);
    }

    // Duration preference
    const durationRange = parsePreferenceRange(profile.preferredDuration || "30-90");
    if (
      durationRange &&
      game.min_playtime <= durationRange[1] &&
      game.max_playtime >= durationRange[0]
    ) {
      score += 10;
    }

    // Already rated loved games boost similar (use Map for O(1) lookup)
    for (const [ratedId, rating] of Object.entries(ratings)) {
      if (rating !== "loved" && rating !== "liked") continue;
      const ratedGame = allGamesMap.get(Number(ratedId));
      if (!ratedGame) continue;
      const catOverlap = game.categories.filter((c) =>
        ratedGame.categories.includes(c)
      ).length;
      if (catOverlap > 0) {
        score += catOverlap * 5;
        reasons.push(`similar to ${ratedGame.name} which you rated highly`);
        break;
      }
    }

    const reason =
      reasons.length > 0
        ? reasons.slice(0, 2).join("; ")
        : `highly rated by the community`;

    scored.push({ game, score, reason });
  }

  // If no profile, just return top-rated games
  if (answers.length === 0) {
    return allGames
      .filter((g) => !collectionIds.has(g.id))
      .sort((a, b) => b.bgg_rating - a.bgg_rating)
      .slice(0, limit)
      .map((game) => ({
        game,
        score: game.bgg_rating * 10,
        reason: "Top-rated game loved by the community",
      }));
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Re-export MOODS from the shared module
export { MOODS, type MoodFilter } from "./moods";
