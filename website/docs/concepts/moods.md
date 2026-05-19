---
title: Moods
sidebar_position: 4
description: Curated mood filters that complement personalized recommendations.
---

# Moods

A **mood** is a small, hand-curated filter applied server-side in SQL. Moods are independent of your taste profile — they're for when you know what you're in the mood for and want to slice the catalog directly.

## The built-in moods

Defined in `src/lib/moods.ts`:

| Mood | Constraint |
| --- | --- |
| 🎉 **Quick Party Game** | 4+ players, complexity ≤ 2, ≤ 45 min |
| 🧠 **Deep Strategy** | complexity ≥ 3.5, ≥ 90 min |
| ❤️ **Cozy Two-Player** | max 2 players, complexity ≤ 2.5 |
| 👨‍👩‍👧 **Family Game Night** | 3+ players, complexity ≤ 2.5, ≤ 90 min |
| ⚔️ **Epic Adventure** | categories include Adventure / Fantasy / Dungeon Crawler, ≥ 90 min |
| 🌙 **Solo Evening** | supports 1 player |
| 🤝 **Cooperative** | Cooperative category |
| 🚀 **Gateway Game** | complexity ≤ 2, ≤ 60 min |

## How they're applied

The Discover page reads `MOODS` and renders a button per mood. Clicking a mood sends its filter object to `GET /api/games`, which translates the optional fields into SQL `WHERE` clauses. Filtering happens *in the database*, not after a `LIMIT` — so results are correct even for filters that match a small slice.

## Adding your own mood

Open `src/lib/moods.ts` and append to the `MOODS` array:

```ts
{
  label: "Train Game Night",
  description: "Routes, deliveries, networks",
  emoji: "🚂",
  categories: ["Trains"],
  minPlaytime: 60,
  maxPlaytime: 180,
}
```

`MoodFilter` fields are all optional. The Discover UI renders new moods automatically — no other wiring needed.

## When to use moods vs. recommendations

- **Moods**: "I have 45 minutes and 5 people in the room." Hard constraints.
- **Recommendations**: "Surprise me with something I'll probably love." Soft scoring.

The two work together: a mood filter narrows the candidate set, and the recommendation score (when shown) re-ranks within it.
