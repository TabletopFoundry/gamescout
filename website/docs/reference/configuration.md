---
title: Configuration
sidebar_position: 2
description: Every environment variable and tunable in GameScout.
---

# Configuration

GameScout has a deliberately tiny configuration surface. If you find yourself wanting more knobs, the answer is almost always to edit a file — most of the relevant code is a few hundred lines.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Canonical base URL used by sitemap, robots.txt, and OpenGraph metadata. Set this in production. |
| `GAMESCOUT_ALLOW_PRODUCTION_SEED` | unset | When `1`, the idempotent seeder is allowed to run while `NODE_ENV=production`. Off by default to prevent accidental data loss. |
| `PORT` | `3000` | Standard Next.js port override. |
| `NODE_ENV` | `development` (dev) / `production` (built) | Controls Next.js behavior and the seed guard above. |

Variables prefixed with `NEXT_PUBLIC_` are inlined into the client bundle at build time — restart `npm run dev` after changing them.

## Where to put them

Copy `.env.example` to `.env.local` in the repo root. Next.js loads `.env.local` automatically in both `dev` and `start`.

```ini title=".env.local"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Code-level tunables

Some values are intentionally not environment variables — they're constants in source so that the code, types, and behavior stay in sync.

| Value | File | Notes |
| --- | --- | --- |
| Default recommendations limit | `src/lib/recommendations.ts` | `getRecommendations(userId, 24)` |
| Scoring weights | `src/lib/recommendations.ts` | Top-of-file constants |
| Mood definitions | `src/lib/moods.ts` | `MOODS` array |
| Seed version | `src/lib/seed.ts` | `SEED_VERSION` — bump to force re-seed |
| Seed catalog | `src/data/seed/games.ts` | Edit to change demo content |
| Personas | `src/data/seed/personas.ts` | Edit to change seeded users |
| Deals | `src/data/seed/deals.ts` | Edit to change seeded promotions |

## ESLint and TypeScript

The repo enforces a strict TypeScript configuration:

```jsonc
// tsconfig.json (excerpt)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Both lint checks must pass before commit:

```bash
npm run check   # lint + type-check
```

There is no Prettier config — the project trusts its ESLint setup.
