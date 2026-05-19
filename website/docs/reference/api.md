---
title: REST API
sidebar_position: 1
description: Every HTTP endpoint exposed by GameScout, with payloads and examples.
---

# REST API Reference

All endpoints live under `/api`. Every route reads or writes JSON, requires a valid session cookie (minted automatically on first request), and runs `force-dynamic` — there is no edge caching.

## Conventions

- **Auth:** an opaque session cookie (`gs_session`) is set by the server on first request. All endpoints scope queries by `getUserId()`.
- **Errors:** non-2xx responses always have a JSON body: `{ "error": "<message>" }`.
- **Rate limiting:** internal `RateLimitError` is mapped to `429` on a handful of write routes.
- **Sanitization:** all user-supplied strings are passed through `src/lib/sanitize.ts` before insertion.

## `GET /api/health`

Liveness + smoke test. Returns `200` with `{ status, timestamp, games }` if the database is reachable and the catalog has rows; `503` otherwise.

```bash
curl http://localhost:3000/api/health
# {"status":"healthy","timestamp":"2025-05-18T08:56:12.044Z","games":85}
```

---

## Games

### `GET /api/games`

Search and filter the catalog. All filters run in SQL.

| Query param | Type | Default | Effect |
| --- | --- | --- | --- |
| `q` | string | — | `name LIKE %q%` (escaped) |
| `category` | string | — | `categories LIKE %category%` |
| `mechanic` | string | — | `mechanics LIKE %mechanic%` |
| `minPlayers` | int | 0 | `max_players >= minPlayers` |
| `maxComplexity` | float | 5 | `complexity <= maxComplexity` |
| `maxPlaytime` | int | 9999 | `max_playtime <= maxPlaytime` |
| `limit` | int | 50 (max 100) | row limit |

Response: `{ games: Game[] }`.

### `GET /api/games/[id]`

Full detail for one game.

```ts
{
  game: Game;
  prices: PriceInfo[];          // latest snapshot per retailer
  deals: DealInfo[];            // active only
  reviews: Review[];            // newest first
  similar: Game[];              // top 5 by category/mechanic overlap
  collectionStatus: "owned" | "wishlist" | null;
  avgReview: number | null;
  playLogs: GamePlayLog[];      // current user's plays of this game
}
```

`404` when `id` doesn't exist.

---

## Quiz

### `GET /api/quiz`

Return all of the current user's quiz answers (game ratings and preference key/value pairs).

### `POST /api/quiz`

Bulk upsert. Body:

```json
{
  "gameRatings": [
    { "gameId": 1, "rating": "loved" },
    { "gameId": 7, "rating": "neutral" }
  ],
  "preferences": [
    { "key": "preferred_complexity", "value": "3" },
    { "key": "preferred_max_playtime", "value": "120" }
  ]
}
```

Both arrays are optional but at least one must be present. Existing answers for the same `(user_id, game_id)` or `(user_id, key)` are replaced.

---

## Recommendations

### `GET /api/recommendations`

```ts
{
  recommendations: RecommendedGame[];   // top 24, sorted descending
  profile: TasteProfile;                // your derived profile
}
```

Each `RecommendedGame` contains the full `game`, a numeric `score`, and a human-readable `reason`.

---

## Collection

### `GET /api/collection`
List the current user's owned games and wishlist as `CollectionItem[]`.

### `POST /api/collection`
Upsert. Body: `{ "gameId": number, "status": "owned" | "wishlist" }`.

### `DELETE /api/collection?gameId=<id>`
Remove from collection.

---

## Play Logs

### `GET /api/play-logs`
Returns `{ logs, totalPlays, uniqueGames, mostPlayed, monthly }`.

### `POST /api/play-logs`
Body:

```json
{
  "gameId": 42,
  "playedAt": "2025-05-17",
  "players": 4,
  "winner": "Alice",
  "rating": 8,
  "score": 142,
  "notes": "Quick learn, great closer."
}
```

`winner` and `notes` are sanitized. `rating` (if present) must be an integer 1–10.

### `DELETE /api/play-logs?id=<id>`
Remove a play log you own.

---

## Reviews

### `GET /api/reviews?gameId=<id>`
List reviews for a game (newest first, joined with author username).

### `POST /api/reviews`
Upsert per `(user_id, game_id)`.

```json
{ "gameId": 42, "rating": 8, "body": "Tight, tense, fast." }
```

`rating` is an integer 1–10. `body` is sanitized and may be `null`.

---

## Price Alerts

### `GET /api/price-alerts`
List the current user's active alerts.

### `POST /api/price-alerts`
Create or update.

```json
{ "gameId": 42, "targetPrice": 39.99, "email": "you@example.com" }
```

`email` is optional. Posting again upserts.

### `DELETE /api/price-alerts?gameId=<id>`
Soft-delete: sets `active = 0`. The row is preserved for history.
