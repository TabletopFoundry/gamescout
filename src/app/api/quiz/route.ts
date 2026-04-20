import { getDb } from "@/lib/db";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const userId = await getUserId();
  const answers = db
    .prepare(`SELECT id, user_id, game_id, rating, preference_key, preference_value, created_at FROM quiz_answers WHERE user_id = ?`)
    .all(userId);
  return Response.json({ answers });
}

export async function POST(request: Request) {
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
        upsertGameRating.run({ userId, gameId: gr.gameId, rating: gr.rating });
      }
    }
    if (preferences) {
      for (const pref of preferences) {
        upsertPref.run({ userId, key: pref.key, value: pref.value });
      }
    }
  });

  save();

  return Response.json({ ok: true });
}
