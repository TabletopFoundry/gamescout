---
title: Discovering Games
sidebar_position: 1
description: Use search, filters, moods, and recommendations to find your next game.
---

# Discovering Games

The Discover page (`/discover`) is the single entry point for finding what to play next. It combines four mechanisms.

## 1. Personalized recommendations

The top of the page renders up to 24 recommendations sorted by score. Each card shows a short reason. These come from `GET /api/recommendations` — see [Recommendation Engine](../concepts/recommendation-engine).

If your quiz is empty, the API returns games with the highest BGG rating instead, so the page is never blank.

## 2. Browse by mood

Below the recommendations, eight mood buttons let you filter the entire catalog by hard constraints (player count, complexity, playtime, category). Clicking a mood calls:

```http
GET /api/games?minPlayers=4&maxComplexity=2&maxPlaytime=45&limit=24
```

…with the parameters derived from the selected `MoodFilter`. See [Moods](../concepts/moods) for the full list and how to add your own.

## 3. Free-text search

The search input does a `LIKE` match against `games.name`. Combine it with filters by leaving the search empty and using only filters, or vice versa. SQL parameters are properly escaped (`%`, `_`, and `\` are neutralized).

```http
GET /api/games?q=brass&maxComplexity=4
```

## 4. Filters

The filter row supports:

- **Min players** — exact-or-greater
- **Max complexity** — caps `games.complexity`
- **Max playtime** — caps `games.max_playtime`

All filters are translated to SQL `WHERE` clauses on the server. Results are capped at 100 to keep page renders fast.

## Patterns

- **Quick pick for tonight:** click the mood that fits the room, then sort the result by the highest BGG rating.
- **Replacement for a beloved game:** open the detail page of that game and look at the *You may also like* row — similarity is computed from category + mechanic overlap.
- **Buying a gift:** use the price tracker on the detail page to find the current best retailer.
