---
title: Reviews
sidebar_position: 5
description: Write, edit, and read reviews — and understand how they affect averages.
---

# Reviews

Every game detail page shows community reviews and an average rating. Reviews are upserted per `(user_id, game_id)` — one review per user per game.

## Writing a review

```http
POST /api/reviews
Content-Type: application/json

{
  "gameId": 42,
  "rating": 8,
  "body": "Tight, tense, fast — a permanent fixture on our shelf."
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `gameId` | integer > 0 | ✓ | Must exist in `games` |
| `rating` | integer 1–10 | ✓ | |
| `body` | string \| null | — | Sanitized via `sanitizeText`. HTML stripped. |

Posting again with the same `gameId` overwrites your previous review and bumps `updated_at`.

## Listing reviews

```http
GET /api/reviews?gameId=42
```

Returns an array of `Review` objects sorted newest first, each joined with the author's `username`. The endpoint does not paginate — review counts per game are bounded in practice, and the detail page lazy-renders any list beyond ten entries.

## Average rating

The detail page also returns an `avgReview` field — a simple arithmetic mean of all `rating` values for the game. The number is recomputed on each request; there's no denormalized average column to keep fresh.

## Why no separate "edit" endpoint?

POST is the upsert. There's no PATCH because there's nothing to partially update — a review is just `(rating, body)` and the right semantic for "I want to change my review" is "I want to replace it." Keeping the surface small means fewer edge cases.
