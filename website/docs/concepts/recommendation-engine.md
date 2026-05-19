---
title: Recommendation Engine
sidebar_position: 3
description: The transparent content-based scoring formula that ranks every game.
---

# Recommendation Engine

The engine lives in `src/lib/recommendations.ts`. It's content-based filtering — no learned weights, no opaque model. Every score is reproducible from the input data.

## The score, one bullet per term

For each candidate game, GameScout adds up the following:

| Term | Weight | Notes |
| --- | --- | --- |
| **Complexity match** | `15 − |gameComplexity − preferred| × 15` | Capped at zero; same scale as BGG weight |
| **Loved category overlap** | `+15` per category in `lovedCategories` | Counts each category once per game |
| **Loved mechanic overlap** | `+10` per mechanic in `lovedMechanics` | Mechanics are usually narrower than categories |
| **BGG community rating** | `+min(20, bggRating × 2.5)` | Bounded so a popular game can't dominate |
| **Player count fit** | `+10` if user's preferred player count is in `[min_players, max_players]` | Hard constraint, simple bonus |
| **Playtime fit** | `+10` if `max_playtime ≤ preferredMaxPlaytime` | Generous — uses the upper bound |
| **Similarity to your highly-rated games** | `+5` per category overlap with a `loved` game | Encourages "more like *Brass: Birmingham*" |
| **Disliked category** | `−15` per overlap with `dislikedCategories` | Pulls bad fits down hard |
| **Disliked mechanic** | `−10` per overlap with `dislikedMechanics` | |

After scoring, GameScout drops games the user has already rated, sorts descending, and returns the top *N* (24 by default).

## Why this formula and not a model?

| | Content-based scoring | Learned model (collaborative filtering / embeddings) |
| --- | --- | --- |
| **Cold start** | Works from a single quiz | Needs many users or a pretrained encoder |
| **Explainability** | Reason is computed from the same arithmetic | Post-hoc; not faithful |
| **Operational cost** | Pure SQL + arithmetic | Training pipeline, model artifact, refresh job |
| **Drift** | None | Constant |

For a self-hosted catalog of ~85 curated games, the trade-off is overwhelming. The code that scores every game in your library is ~150 lines.

## Generating the "reason"

The reason string is produced by the **same loop** that computes the score. As each term is added, a short fragment is appended to a reason list. After scoring, the top two fragments by contributed points are concatenated. The result is a reason like:

> *"Worker Placement matches games you loved. Complexity is right in your sweet spot."*

This means the reason is always faithful — you'll never see "matches your love of strategy" when the actual score came from BGG popularity.

## Tuning

To bias recommendations toward newer or heavier games, edit the constants at the top of `src/lib/recommendations.ts`. The whole file fits on one screen.

```ts
const COMPLEXITY_WEIGHT = 15;
const CATEGORY_WEIGHT = 15;
const MECHANIC_WEIGHT = 10;
const BGG_MAX = 20;
```

There are no other knobs — that's by design.
