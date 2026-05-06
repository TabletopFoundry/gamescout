/**
 * Quiz answers API.
 *
 * GET  — Retrieve saved quiz answers for the current user.
 * POST — Bulk-save game ratings and preference answers.
 */

import { getDb } from "@/lib/db";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const userId = await getUserId();
    const answers = db
      .prepare(`SELECT id, user_id, game_id, rating, preference_key, preference_value, created_at FROM quiz_answers WHERE user_id = ?`)
      .all(userId);
    return Response.json({ answers });
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to load quiz answers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const userId = await getUserId();

    let body: {
      gameRatings?: { gameId: number; rating: string }[];
      preferences?: { key: string; value: string }[];
    };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { gameRatings, preferences } = body;

    const VALID_RATINGS = new Set(["loved", "liked", "neutral", "disliked", "havent_played"]);
    const VALID_PREF_KEYS = new Set(["player_count", "duration", "complexity", "themes"]);

    const upsertGameRating = db.prepare(`
      INSERT INTO quiz_answers (user_id, game_id, rating)
      VALUES (@userId, @gameId, @rating)
      ON CONFLICT(user_id, game_id) DO UPDATE SET rating = excluded.rating
    `);

    const upsertPref = db.prepare(`
      INSERT INTO quiz_answers (user_id, preference_key, preference_value)
      VALUES (@userId, @key, @value)
      ON CONFLICT(user_id, preference_key) DO UPDATE SET preference_value = excluded.preference_value
    `);

    const save = db.transaction(() => {
      if (gameRatings) {
        for (const gr of gameRatings) {
          if (!Number.isInteger(gr.gameId) || gr.gameId <= 0) continue;
          if (!VALID_RATINGS.has(gr.rating)) continue;
          upsertGameRating.run({ userId, gameId: gr.gameId, rating: gr.rating });
        }
      }
      if (preferences) {
        for (const pref of preferences) {
          if (!VALID_PREF_KEYS.has(pref.key)) continue;
          if (typeof pref.value !== "string" || pref.value.length > 200) continue;
          upsertPref.run({ userId, key: pref.key, value: pref.value });
        }
      }
    });

    save();

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to save quiz results" }, { status: 500 });
  }
}
