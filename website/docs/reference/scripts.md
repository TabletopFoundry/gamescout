---
title: Scripts
sidebar_position: 4
description: Every npm script in the GameScout repo, and when to use it.
---

# Scripts

| Command | When to run it |
| --- | --- |
| `npm run dev` | Day-to-day development. Hot reload, fast refresh, on-demand SQL seed on first request. |
| `npm run build` | Build the production bundle into `.next/`. Required before `npm run start`. |
| `npm run start` | Run the production server against the built bundle. **Does not seed** unless `GAMESCOUT_ALLOW_PRODUCTION_SEED=1`. |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`). Must pass with zero errors before commit. |
| `npm run lint:types` | `tsc --noEmit`. Strict mode, `noUncheckedIndexedAccess`. Must pass with zero errors. |
| `npm run check` | Convenience: runs both `lint` and `lint:types`. Run this before opening a PR. |

## Conventional workflow

```bash
# Start clean
rm gamescout.db gamescout.db-shm gamescout.db-wal 2>/dev/null

# Develop
npm run dev

# Before commit
npm run check
npm run build
```

## Production seed once

```bash
GAMESCOUT_ALLOW_PRODUCTION_SEED=1 npm run start
```

Hit `/api/health` once, then restart without the flag.
