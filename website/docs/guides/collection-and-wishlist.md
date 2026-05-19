---
title: Collection & Wishlist
sidebar_position: 2
description: Track owned games, manage your wishlist, and let collection state feed recommendations.
---

# Collection & Wishlist

GameScout's collection is a single table with a `status` column — every entry is either `"owned"` or `"wishlist"`. The `/collection` page shows both, with a shelf view, sort options, and toggles.

## Adding to your collection

From any game detail page, click **Add to Collection**. Behind the scenes:

```http
POST /api/collection
Content-Type: application/json

{ "gameId": 42, "status": "owned" }
```

The route upserts on `(user_id, game_id)` — moving a game from wishlist to owned is the same call with a different `status`.

## Removing

```http
DELETE /api/collection?gameId=42
```

## Listing

```http
GET /api/collection
```

Returns an array of `CollectionItem`, each containing the full `Game` object plus `collectionId`, `status`, and `addedAt`. The `/collection` page sorts client-side by `addedAt`, `name`, `bgg_rating`, or `complexity`.

## How collection state feeds recommendations

`buildTasteProfile()` treats:

- **Owned games** as `liked` for category/mechanic weighting.
- **Wishlist games** as `loved` (a strong positive signal — these are games you actively want).

This means adding a game to your wishlist immediately shifts what `/discover` surfaces. There's no batch job or refresh — the profile is rebuilt on every recommendations request.

## Bulk import

There's no built-in bulk import UI, but the API is open. To import a CSV of BGG-style "Owned" rows, write a small script that POSTs to `/api/collection`:

```bash
while IFS=, read -r game_id status; do
  curl -b cookies.txt -X POST http://localhost:3000/api/collection \
    -H 'Content-Type: application/json' \
    -d "{\"gameId\": $game_id, \"status\": \"$status\"}"
done < collection.csv
```

You'll need a valid session cookie — the easiest way is to copy yours out of your browser's devtools.
