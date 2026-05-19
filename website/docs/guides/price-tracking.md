---
title: Price Tracking
sidebar_position: 4
description: Compare retailer prices, surface active deals, and set price alerts.
---

# Price Tracking

GameScout ships with seeded retailer price history and a curated set of active deals. Every game detail page surfaces the most recent price per retailer and any deal currently in window.

## Where prices come from

The seed dataset includes snapshots in `price_history` for every game/retailer pair, plus a `game_deals` table for promotions with start/end dates, discount percentages, and optional coupon codes. In a self-hosted setup, you can update these tables on a schedule with a script that scrapes (or politely uses) public retailer APIs — GameScout itself doesn't scrape anything.

The detail page query is one window function in SQL — it picks the latest snapshot per retailer:

```sql
SELECT ph.* FROM price_history ph
JOIN (
  SELECT retailer, MAX(updated_at) AS updated_at
  FROM price_history
  WHERE game_id = ?
  GROUP BY retailer
) latest USING (retailer, updated_at);
```

## Active deals

A deal is "active" when `now()` is between `starts_at` and `ends_at` and `discount_pct > 0`. The detail page highlights the best-discount active deal with a badge.

## Setting a price alert

```http
POST /api/price-alerts
Content-Type: application/json

{
  "gameId": 42,
  "targetPrice": 39.99,
  "email": "you@example.com"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `gameId` | ✓ | Must exist |
| `targetPrice` | ✓ | Decimal in your local currency |
| `email` | optional | If absent, alerts are silent (just visible in your dashboard) |

## Listing your alerts

```http
GET /api/price-alerts
```

Returns active alerts with the game's name and thumbnail joined in.

## Removing an alert

Soft-delete only — the row stays in the database with `active = 0`:

```http
DELETE /api/price-alerts?gameId=42
```

## A note on delivery

GameScout does not include an email sender in the open-source repo — sending email out of a hobby/self-hosted app is opinionated enough that we leave it to you. The shape is in place: write a cron that runs `SELECT * FROM price_alerts pa JOIN latest_prices lp ON …` and pipes results into the transport of your choice (Resend, SES, SMTP). The `price_alerts.active` flag makes it easy to mark an alert as fulfilled.
