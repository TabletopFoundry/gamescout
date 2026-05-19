---
title: Taste Profile
sidebar_position: 2
description: How quiz answers and play history become a weighted recommendation profile.
---

# Taste Profile

A taste profile is the compact representation of "what this user likes" that the [recommendation engine](./recommendation-engine) reads. It's derived on every request — there's no precomputed embedding to keep fresh.

## Inputs

The profile is built from three sources, in priority order:

1. **Quiz game ratings** — `loved` / `liked` / `neutral` / `disliked` per game. `loved` and `liked` games contribute their categories and mechanics with positive weight; `disliked` games contribute negative weight.
2. **Quiz preference answers** — explicit signals like preferred complexity, player count, and playtime.
3. **Collection state** — owned games are treated like `liked`; wishlisted games like `loved`.

## Output shape

The profile is a plain object you can inspect on `/api/recommendations`:

```ts
interface TasteProfile {
  preferredComplexity: number;        // 1.0 – 5.0
  preferredMinPlayers: number;
  preferredMaxPlayers: number;
  preferredMaxPlaytime: number;
  lovedCategories: Set<string>;       // e.g. {"Strategy", "Economic"}
  lovedMechanics: Set<string>;        // e.g. {"Worker Placement", "Engine Building"}
  dislikedCategories: Set<string>;
  dislikedMechanics: Set<string>;
  ratedGameIds: Set<number>;          // excluded from recommendations
}
```

You can see your own profile in the JSON returned by `GET /api/recommendations`:

```bash
curl -b cookies.txt http://localhost:3000/api/recommendations | jq .profile
```

## Why a Set, not a vector?

Two reasons:

- **Inspectability.** A user can read "you loved 3 Economic games with Worker Placement" and verify that the system understood them. A 64-dim embedding cannot.
- **Cold start.** With only 10 quiz answers per user, a vector model is underfit. Set membership and counts work surprisingly well at this scale.

If you want to plug in a learned model later, replace `buildTasteProfile()` in `src/lib/recommendations.ts` — the contract is just the interface above.

## Refresh frequency

There's no cache. Every call to `GET /api/recommendations` rebuilds the profile from the database. That's intentional: with ~85 games and a single user's history, the work is sub-millisecond, and you never have to think about invalidation.
