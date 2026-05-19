---
title: Database Schema
sidebar_position: 3
description: Every SQLite table GameScout creates, with columns and relationships.
---

# Database Schema

GameScout uses a single SQLite file (`gamescout.db`). All schema lives in `src/lib/db.ts` and is created via `CREATE TABLE IF NOT EXISTS` on first boot.

## Tables

### `games`
The catalog. Seeded with 85 entries.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INTEGER PK | |
| `name` | TEXT | |
| `year` | INTEGER | |
| `description` | TEXT | |
| `min_players` / `max_players` | INTEGER | |
| `min_playtime` / `max_playtime` | INTEGER | minutes |
| `complexity` | REAL | 1.0–5.0 |
| `bgg_rating` | REAL | community rating |
| `bgg_rank` | INTEGER | |
| `categories` | TEXT | JSON-encoded array |
| `mechanics` | TEXT | JSON-encoded array |
| `designer`, `publisher` | TEXT | |
| `image_url`, `thumbnail_url` | TEXT | |

`parseGame()` in `db.ts` deserializes the JSON columns into the `Game` interface.

### `price_history`
Snapshots of retailer prices. The detail API picks the most-recent row per retailer using `MAX(updated_at) GROUP BY retailer`.

### `game_deals`
Active promotions with `sale_price`, `msrp`, `discount_pct`, `starts_at`, `ends_at`, optional `coupon_code`, and a `featured` flag.

### `users`
Seeded personas + runtime-created users. `username` is nullable.

### `sessions`
Opaque session tokens. `token` is unique and indexed; rows reference `users.id`.

### `quiz_answers`
Both game ratings and preference key/value pairs share this table — `game_id` is nullable for preference rows, and `preference_key` is nullable for rating rows.

### `collection`
`(user_id, game_id)` unique, with `status` of `"owned"` or `"wishlist"`.

### `play_logs`
| Column | Notes |
| --- | --- |
| `id` | PK |
| `user_id`, `game_id` | FK |
| `played_at` | ISO date |
| `players` | nullable |
| `winner` | nullable, sanitized |
| `rating` | 1–10, nullable |
| `score` | integer, nullable |
| `notes` | sanitized text |
| `created_at` | |

### `reviews`
Upserted per `(user_id, game_id)`. `body` is sanitized; `rating` is 1–10.

### `price_alerts`
| Column | Notes |
| --- | --- |
| `id`, `user_id`, `game_id` | |
| `target_price` | REAL |
| `email` | nullable |
| `active` | 0/1; deletes are soft |
| `created_at` | |

### `seed_metadata`
Single-row table tracking the last applied `SEED_VERSION`. The seeder reads this and skips work if the version matches.

## Indexes

The schema relies on SQLite's automatic primary-key indexes plus a unique index on `sessions.token`. Query plans on an 85-row catalog and a few hundred play logs are fast enough that additional indexes are not warranted.

## Migrations

There is no migration framework. Schema changes are made by:

1. Adding an `ALTER TABLE` or new `CREATE TABLE IF NOT EXISTS` in `getDb()`.
2. Bumping `SEED_VERSION` if seed data should be reloaded.

For a self-hosted app, this is dramatically simpler than maintaining a migrations directory and an embedded migration runner.
