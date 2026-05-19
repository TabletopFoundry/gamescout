---
title: Logging Plays
sidebar_position: 3
description: Record sessions, build a history, and power the stats dashboard.
---

# Logging Plays

Every game detail page has a **Log a Play** form. Submissions feed the play history used by `/stats` and by the recommendation engine (recently-played games are weighted slightly higher).

## Recording a play

```http
POST /api/play-logs
Content-Type: application/json

{
  "gameId": 42,
  "playedAt": "2025-05-17",
  "players": 4,
  "winner": "Alice",
  "rating": 8,
  "score": 142,
  "notes": "First time playing — Alice rushed the bonus card."
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `gameId` | integer > 0 | ✓ | Must exist in `games` |
| `playedAt` | ISO date string | ✓ | Day-resolution; time component ignored |
| `players` | integer | — | Defaults to the game's `min_players` |
| `winner` | string | — | Sanitized with `sanitizeText` |
| `rating` | integer 1–10 | — | Personal rating for *this session* |
| `score` | integer | — | Final score, if applicable |
| `notes` | string | — | Sanitized; HTML stripped |

The route validates and sanitizes every field before insertion. Invalid payloads return `400` with a short error.

## Listing plays

```http
GET /api/play-logs
```

Returns an object with:

```ts
{
  logs: PlayLog[];               // newest first
  totalPlays: number;
  uniqueGames: number;
  mostPlayed: { gameId, name, count } | null;
  monthly: { month: string; count: number }[];
}
```

The `/stats` page consumes this directly to render the Recharts dashboard.

## Deleting a play

```http
DELETE /api/play-logs?id=123
```

You can only delete your own play logs — the route filters by `user_id` from `getUserId()`.

## What the stats page shows

- **Plays per month** — line chart from `monthly`
- **Complexity distribution** — bar chart bucketed by `getComplexityBucket`
- **Top categories** — horizontal bar chart of categories from your played games
- **Rating distribution** — histogram of `rating` values
- **Recent scores** — small table of the most recent logs that have a `score`

All five charts are pure functions of the `/api/play-logs` response — no extra round-trips.
