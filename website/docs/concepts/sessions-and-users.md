---
title: Sessions & Users
sidebar_position: 5
description: How GameScout identifies users without accounts, signups, or passwords.
---

# Sessions & Users

GameScout has no login screen, no email field, no third-party auth. Each visitor gets an **opaque session token** stored as an HTTP-only cookie, which maps to a row in the `users` table.

## The contract

```ts
// src/lib/session.ts
export async function getUserId(): Promise<number>;
```

Every API route calls `await getUserId()`. The function:

1. Reads the `gs_session` cookie.
2. If present and signed, looks up the matching row in `sessions` and returns the `user_id`.
3. If missing or invalid, inserts a new `users` row, mints a new opaque token, sets it as a secure cookie, and returns the new id.

## Why this design?

- **Zero friction.** A first-time visitor can take the quiz and get recommendations without any signup flow.
- **No PII.** GameScout never asks for email, name, or anything else. There's nothing to leak.
- **Deterministic in tests.** A test can set the cookie directly and behave as a specific persona.
- **Seeded personas coexist with real users.** The seeder inserts 12 personas with known user ids. A live visitor gets a new id starting after the persona range.

## The trade-offs

- **No cross-device sync.** Clearing your cookies starts you over.
- **No way to "log in as someone else"** without manually swapping the cookie. In production this is a feature; for development we expose a "switch persona" affordance.
- **You own the cookie secret.** If you redeploy with a different signing secret, every existing session becomes invalid.

## Adding real auth later

`getUserId()` is the only seam. To bolt on OAuth, GitHub login, or magic links, replace the implementation — every API route picks up the change automatically. The schema's `users` table already has an optional `username` column for that future.
