---
title: Seed Data
sidebar_position: 6
description: The idempotent, transactional demo dataset that ships with GameScout.
---

# Seed Data

A great demo is a feature, not an afterthought. GameScout's seed makes the app feel populated and trustworthy the first time you open it.

## What gets seeded

| Dataset | Count | Source |
| --- | --- | --- |
| Games | **85** real titles with accurate metadata | `src/data/seed/games.ts` |
| User personas | **12** with distinct tastes | `src/data/seed/personas.ts` |
| Play logs | **216** with dates, winners, scores | derived per persona |
| Reviews | **60** (short, medium, long-form) | per persona |
| Price history | Snapshots for every retailer listing | per game |
| Active deals | Curated subset with discount % | `src/data/seed/deals.ts` |
| Price alerts | A handful per persona | derived |

Complexity spread: from **1.0** (`No Thanks!`) to **5.0** (`Advanced Squad Leader`). Unicode-heavy names like `Café`, `Jórvík`, `zoë_meeples`, and `señor_carton` are included on purpose — they catch encoding bugs before real users do.

## Behaviour

- **Guarded in production.** The seeder is skipped when `NODE_ENV=production` unless `GAMESCOUT_ALLOW_PRODUCTION_SEED=1`. This prevents an accidental redeploy from wiping a real database.
- **Idempotent.** The seeder truncates seed-managed tables and re-inserts a known-good dataset version tracked in `seed_metadata`. Running it ten times produces the same database as running it once.
- **Transactional.** Catalog, personas, play logs, reviews, and pricing data are inserted in a single `better-sqlite3` transaction. Either every table is updated or none of them are.
- **Conventional layout.** Catalog and persona definitions live in `src/data/seed/`; orchestration lives in `src/lib/seed.ts`.

## Resetting

```bash
rm gamescout.db gamescout.db-shm gamescout.db-wal
npm run dev   # next request triggers a fresh seed
```

## Bumping the seed version

If you change a seed file, increment `SEED_VERSION` in `src/lib/seed.ts`. The next boot will notice the version mismatch and re-run the seeder, replacing the demo content while leaving runtime-created rows (real user accounts, real play logs) untouched.

## Disabling the seed entirely

For a production deployment that should never auto-seed, **do not set** `GAMESCOUT_ALLOW_PRODUCTION_SEED`. The seeder is a no-op in that mode.
