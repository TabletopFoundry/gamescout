---
title: Deploying GameScout
sidebar_position: 6
description: Run GameScout in production with persistent SQLite storage.
---

# Deploying GameScout

GameScout is a single Next.js process plus a SQLite file. That makes it trivial to host on anything that gives you persistent disk.

## What you need

- Node.js 20+ on the server
- A writable path for `gamescout.db` (the working directory of the process by default)
- An HTTPS terminator in front of the Node server (your platform usually provides this)

## Build & run

```bash
npm ci
npm run build
NODE_ENV=production npm run start
```

The default port is 3000; set `PORT` to override.

## Seeding production once

Production builds **will not seed** by default. To populate a fresh production database the first time:

```bash
GAMESCOUT_ALLOW_PRODUCTION_SEED=1 npm run start
```

Hit any page (or `curl /api/health`) to trigger the seed, then restart without the env var. Subsequent restarts will leave the database untouched.

## Persistent storage gotchas

The single biggest deployment pitfall is **ephemeral disk**. Some platforms (Vercel serverless, AWS Lambda, Cloud Run) discard local files between invocations, which means SQLite loses every write.

- ✅ **Works as-is:** A VPS, Fly.io machine with a volume, Railway, Render, a Raspberry Pi at home, a docker host.
- ⚠️ **Needs a mounted volume:** Docker / Kubernetes / Nomad — mount a directory and point the process there.
- ❌ **Will lose data:** Any "edge" or "serverless" platform that does not persist local disk.

## Docker

A minimal Dockerfile:

```dockerfile
FROM node:20-bookworm AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-bookworm AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
VOLUME /app/data
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Run with:

```bash
docker run -p 3000:3000 -v gamescout-data:/app/data gamescout
```

## Backups

Just copy the three files when the server is idle (or use `sqlite3 gamescout.db ".backup /backups/gamescout-$(date +%F).db"`). WAL is enabled, so live copies are also safe.

## Reverse proxy

Caddy is the easiest:

```caddy
gamescout.example.com {
  reverse_proxy localhost:3000
}
```

Set `NEXT_PUBLIC_BASE_URL=https://gamescout.example.com` so the sitemap and OG tags use the right canonical host.
