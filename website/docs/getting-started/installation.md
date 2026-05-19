---
title: Installation
sidebar_position: 2
description: Detailed installation, environment, and troubleshooting steps for GameScout.
---

# Installation

The [Quick Start](./quick-start) is enough for most setups. This page covers the edge cases.

## Supported Node versions

GameScout targets the active Node.js LTS line. The repo pins a specific version through `.nvmrc`:

```bash
nvm use   # picks up the version from .nvmrc
node --version
```

If you're using `fnm`, `volta`, or `asdf`, they all honor `.nvmrc`.

## Native dependencies: `better-sqlite3`

`better-sqlite3` is a synchronous, native-compiled SQLite binding. It must be built against the Node version you intend to run.

| Situation | Fix |
| --- | --- |
| `Error: The module '…better_sqlite3.node' was compiled against a different Node.js version` | `npm rebuild better-sqlite3` |
| Build fails with missing `python` | Install Python 3 and run `npm install --build-from-source` |
| Apple Silicon: prebuilt binary missing | `npm install` already builds from source on arm64; ensure Xcode CLT is installed |

## Environment variables

Copy `.env.example` to `.env.local` and edit as needed.

```bash
cp .env.example .env.local
```

```ini title=".env.local"
# Base URL for sitemap generation and canonical URLs.
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Used for sitemap, robots.txt, and OpenGraph canonical URLs |
| `GAMESCOUT_ALLOW_PRODUCTION_SEED` | unset | When `1`, allows the idempotent seeder to run in production. Off by default. |

## Database location

The SQLite file is created at the repo root as `gamescout.db`. Two sidecar files (`gamescout.db-shm` and `gamescout.db-wal`) appear when WAL mode is active. All three are gitignored.

To reset to a clean seeded state during development:

```bash
rm gamescout.db gamescout.db-shm gamescout.db-wal
npm run dev
```

## Verifying the install

GameScout exposes a health endpoint that confirms the database is reachable and seeded:

```bash
curl http://localhost:3000/api/health
# {"status":"healthy","timestamp":"...","games":85}
```

A `200` with `games > 0` means you're good to go.

## Common issues

- **Port 3000 in use** → `PORT=3001 npm run dev`
- **Stale type errors after pulling** → `rm -rf .next && npm run dev`
- **Seed didn't run in production** → set `GAMESCOUT_ALLOW_PRODUCTION_SEED=1` once, then unset
