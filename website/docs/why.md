---
title: Why GameScout
description: How GameScout compares to BoardGameGeek, Board Game Atlas, and spreadsheet-based collection trackers.
---

# Why GameScout

There are three things people use today to do the jobs GameScout does. Here's how it stacks up against each.

## vs. BoardGameGeek

BGG is the canonical source of truth for board game metadata and the largest community. It's also a 20-year-old PHP site with a dated UX, intrusive ads, and no real recommendation engine — its "GeekBuddy" recommendations are based on the games your friends own, which is great if you have many BGG-active friends and useless otherwise.

| | BGG | GameScout |
| --- | --- | --- |
| Recommendations | Friend-based; cold-start fails | Content-based; works from a 10-question quiz |
| Mood-based browsing | ❌ | ✅ Eight built-in moods, easy to add more |
| Stats dashboard | Spread across many pages | Single `/stats` page with Recharts |
| Privacy | Tracks everything | No accounts, no email, no third-party calls |
| Self-host | ❌ | ✅ One Node process, one SQLite file |
| Price tracker | ❌ | ✅ Seeded snapshots + alerts |

GameScout is not a BGG replacement — it doesn't have BGG's catalog depth or community. It's a clean, fast, local-first companion for the one thing BGG is bad at: *helping you decide what to play next*.

## vs. Spreadsheets

Lots of hobbyists track their collection in a Google Sheet. It's free and infinitely customizable, but:

- No recommendations
- No price tracking
- No stats charts without manual pivots
- No mobile-friendly view

GameScout gives you all of that without giving up control of your data — the database is one file on your disk.

## vs. Board Game Atlas / Quintessential Games

These are commercial offerings with paid tiers and uncertain longevity. GameScout is MIT-licensed and entirely self-hosted, so there's no "the company shut down and took my data" risk.

## What GameScout deliberately doesn't do

- **Social feed.** No comments, no follows, no notifications. The product is for *you*, not your audience.
- **External scrapers.** GameScout doesn't scrape BGG or retailer sites in the open-source repo. You bring your own data refresh strategy if you want one.
- **Account systems.** No login screen by design. If you want auth, [add it in one place](./concepts/sessions-and-users#adding-real-auth-later).

## When you should pick something else

- You want a global ranking site with millions of users → BGG.
- You want to publish reviews to a public audience → BGG or a blog.
- You don't want to run a server → use a hosted BGG account and a spreadsheet.
- You want a polished native mobile app → not what GameScout is today.

For everything else — "I have a shelf, I want to play more, I want to spend less, and I want the app to know me" — GameScout is the most focused tool we know of.
