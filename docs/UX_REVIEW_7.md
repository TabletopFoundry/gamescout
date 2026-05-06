# GameScout — Seventh-Pass UX & DX Audit

**Reviewer:** Senior engineer, fresh codebase encounter  
**Date:** 2025-07-25  
**Scope:** New P0/P1 issues only — not previously flagged in Reviews 1–6 or Code Reviews 1–3  
**Baseline:** All nine prior review documents read in full; only genuinely new findings included

---

## 1. Executive Summary

GameScout has addressed all seven issues from Review 6: CSP now uses `'strict-dynamic'` correctly, imperative fetch calls use `AbortController` refs, the sitemap includes dynamic game pages, `robots.txt` advertises the sitemap, the home page DB call has a try/catch fallback, and `loadPlayLogs()` is properly abortable. The codebase continues to mature.

This seventh pass identifies **1 P0** and **2 P1** issues in the **session lifecycle and API error handling layer** — an area that was partially addressed by prior reviews (session creation rate limiting, cleanup suggestion) but whose *implementation* introduced new bugs not caught by any previous review. The headline finding is: `cleanupExpiredSessions()` in `session.ts` attempts to DELETE orphaned users but will always crash on the FK constraint when those users have any data (quiz answers, collection, reviews, play logs, or price alerts). The function has no try/catch, and it's called from `getUserId()`, which is itself called **outside** the try/catch in 12 of 14 API handler functions. This creates a guaranteed crash cycle once any user's session expires after 37 days.

---

## 2. New Issues

### 2.1 Session Cleanup — FK Constraint Crash + Silent Data Orphaning

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| CL1 | **`cleanupExpiredSessions()` crashes on FK constraint when deleting orphaned users** | `session.ts:52-60` | Code Review 3 (P1-3-2) *recommended* adding periodic cleanup of expired sessions and orphaned users. The cleanup was subsequently implemented — but the implementation has a critical bug. Line 58 deletes expired sessions. Line 59 then attempts `DELETE FROM users WHERE id NOT IN (SELECT DISTINCT user_id FROM sessions)`. However, `foreign_keys = ON` is set at `db.ts:29`, and every child table (`quiz_answers`, `collection`, `play_logs`, `reviews`, `price_alerts`) references `users(id)` with **no `ON DELETE CASCADE`**. Any user who has interacted with the app (taken the quiz, added a game, written a review, logged a play) cannot be deleted — SQLite throws `SQLITE_CONSTRAINT_FOREIGNKEY`. The function has **no try/catch**, so the error propagates up through `getUserId()` into the API handler. |

**Impact chain:**

1. User visits the app, takes the quiz, adds games — data created in `quiz_answers`, `collection`, etc.
2. User doesn't return for 37+ days (30-day session expiry + 7-day cleanup grace period).
3. Next hourly cleanup cycle: sessions are deleted (line 58 succeeds), then user DELETE throws (line 59 fails).
4. The throw propagates: `cleanupExpiredSessions()` → `getUserId()` → API handler top-level → unhandled rejection → Next.js returns generic 500.
5. `lastCleanup` is set to `Date.now()` *before* the DB calls (line 55), so the crash doesn't retry within the hour — but it recurs every hour boundary thereafter.
6. The orphaned user's data (collection, play logs, reviews) persists forever in the database but is permanently inaccessible — no session or user account can reach it.
7. If the same browser returns, a brand new user is created — all previous data is silently lost.

**Fix:** Wrap the cleanup in a try/catch. Either add `ON DELETE CASCADE` to all child table FK references, or delete child rows before the user row, or (simplest) just catch and log the error:

```typescript
function cleanupExpiredSessions(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  try {
    const db = getDb();
    db.prepare(`DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days')`).run();
    // Delete orphaned users' data first, then the user rows
    const orphanedUsers = db.prepare(
      `SELECT id FROM users WHERE id NOT IN (SELECT DISTINCT user_id FROM sessions)`
    ).all() as { id: number }[];

    if (orphanedUsers.length > 0) {
      const ids = orphanedUsers.map((u) => u.id);
      const placeholders = ids.map(() => '?').join(',');
      db.prepare(`DELETE FROM quiz_answers WHERE user_id IN (${placeholders})`).run(...ids);
      db.prepare(`DELETE FROM collection WHERE user_id IN (${placeholders})`).run(...ids);
      db.prepare(`DELETE FROM play_logs WHERE user_id IN (${placeholders})`).run(...ids);
      db.prepare(`DELETE FROM reviews WHERE user_id IN (${placeholders})`).run(...ids);
      db.prepare(`DELETE FROM price_alerts WHERE user_id IN (${placeholders})`).run(...ids);
      db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).run(...ids);
    }
  } catch (e) {
    console.error("Session cleanup failed:", e);
  }
}
```

Or, more elegantly, add `ON DELETE CASCADE` to all FK references in the schema (requires schema migration).

---

### 2.2 API Error Handling — `getUserId()` Unguarded in 12 of 14 Handlers

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| AE1 | **`getUserId()` called outside try/catch in 12 of 14 API handler functions** | `collection/route.ts:16,65,95`, `reviews/route.ts:16`, `play-logs/route.ts:17,72,119`, `price-alerts/route.ts:16,35,69`, `games/[id]/route.ts:19`, `quiz/route.ts:28` | Only `recommendations/route.ts:14` and `quiz/route.ts:16` (GET) wrap `getUserId()` inside their try/catch. All other handlers call it at the top level before any error handling. This means *any* throw from `getUserId()` — the FK cleanup crash (CL1), the `RateLimitError` from `session.ts:94-97`, or a DB connection failure — propagates as an unhandled exception. The consequences are: (a) CL1 crashes surface as unstructured 500s instead of being caught; (b) rate-limited users receive a generic 500 error instead of a structured 429 response with the message "Too many sessions created. Please try again later."; (c) DB connection failures produce different error formats depending on whether they hit `getUserId()` (unstructured 500) or the route's own try/catch (structured JSON error). |

**Fix:** Move `getUserId()` inside each handler's try/catch, and add specific handling for the `RateLimitError`:

```typescript
export async function GET() {
  try {
    const userId = await getUserId();
    const db = getDb();
    // ... existing logic
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to load collection" }, { status: 500 });
  }
}
```

Alternatively, extract a shared wrapper: `withAuth(handler)` that catches `getUserId()` errors uniformly.

---

### 2.3 Session Cleanup — Non-Atomic Dual DELETE Causes Silent Data Loss

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| CL2 | **Session and user DELETEs are not wrapped in a transaction — sessions deleted even when user deletion fails** | `session.ts:58-59` | The two DELETE statements execute independently. Line 58 (`DELETE FROM sessions WHERE expires_at < ...`) succeeds. Line 59 (`DELETE FROM users WHERE id NOT IN ...`) then crashes on FK (see CL1). The net result: the user's sessions are permanently deleted, but the user row and all their data remain. When the user returns with a new browser/cleared cookies, `getUserId()` creates a fresh user — they permanently lose access to their collection, play logs, reviews, and quiz history with no warning or error message shown to the user. This is a silent, irreversible data loss bug. Even if CL1 is fixed (try/catch added), the non-atomic execution means partially-completed cleanup is possible under other failure modes. |

**Fix:** Wrap both operations in a `db.transaction()`:

```typescript
const cleanup = db.transaction(() => {
  db.prepare(`DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days')`).run();
  // ... delete child rows, then users (see CL1 fix)
});
cleanup();
```

This ensures either all cleanup succeeds or none of it does — the user's session is preserved if their data can't be cleaned up.

---

## 3. Prioritized Action Plan

### P0 — Fix Immediately (< 30 minutes)

1. **CL1 — Add try/catch to `cleanupExpiredSessions()` and handle FK-constrained users** (`session.ts:52-60`): At minimum, wrap the entire function body in try/catch to prevent the crash from propagating. Then either delete child rows before parent, or add `ON DELETE CASCADE` to the schema. ~20 minutes.

### P1 — Important (< 2 hours)

2. **AE1 — Move `getUserId()` inside try/catch in all API handlers** (12 handler functions across 6 route files): Move the `await getUserId()` call inside the existing try/catch block, and add a `RateLimitError` check that returns 429 with a structured JSON response. ~30 minutes (mechanical change across 12 call sites, same pattern each time).

3. **CL2 — Wrap cleanup in a transaction** (`session.ts:52-60`): Wrap both DELETE operations (plus any child-row deletions) in `db.transaction()`. ~10 minutes.

---

## 4. Issues Not Re-Flagged (Confirmed Still Open from Prior Reviews)

The following issues from Reviews 1–6 and Code Reviews 1–3 remain open but are already documented:

- **T1–T2**: Zero tests, no CI pipeline (Review 3)
- **S1 (R3)**: `fromQuiz` dead code — `discover/page.tsx:17` still has `fromQuiz ? "recommended" : "recommended"`
- **D1–D2 (R3)**: No formatter, no pre-commit hooks
- **D4 (R3)**: `console.error` in production code (also present in all 4 `error.tsx` files)
- **D5 (R3)**: `allowJs: true` in `tsconfig.json`
- **DS1 (R3)**: Seed data uses runtime timestamps
- **DS2 (R3)**: No migration strategy
- **S4 (R3)**: `setTimeout(..., 0)` for initial data loads remains in `discover/page.tsx:171`, `games/[id]/page.tsx:114`, `collection/page.tsx:64`
- **N3 (R3)**: `unstable_retry` used in all 4 `error.tsx` files
- **D2 (R4)**: Reviews rely on `user_<timestamp>_<suffix>` usernames
- **C1 (R5)**: Game detail page remains a monolith with 16+ useState
- **C2 (R5)**: Discover page remains 440+ lines managing 3 independent tabs
- **A1 (R5)**: No `<meta name="color-scheme" content="dark">` despite dark theme
- **A2 (R5)**: `text-zinc-600` footer fails WCAG AA contrast
- **TS1 (R6)**: `exactOptionalPropertyTypes: false` in `tsconfig.json:19`
- **P2-10 (CR1)**: No rate limiting on API mutation endpoints (session creation is rate-limited, but write endpoints like POST reviews/play-logs/collection are not)

---

## 5. What's Improved Since Review 6

| Area | Status |
|------|--------|
| CSP `'unsafe-eval'` removed (CSP1, R6) | ✅ Now uses `'strict-dynamic'` with `'unsafe-inline'` as CSP2 fallback only — correct nonce-propagation pattern (`next.config.ts:27-30`) |
| Imperative refresh AbortController (RF1, R6) | ✅ `refreshControllerRef` wired in `discover/page.tsx:37,83-85`; `mutationReloadRef` wired in `games/[id]/page.tsx:55,66-69` |
| Dynamic sitemap entries (SEO1, R6) | ✅ `sitemap.ts:18-28` queries `SELECT id FROM games` and generates entries per game |
| Robots.txt sitemap directive (SEO2, R6) | ✅ `robots.ts:14` includes `sitemap: \`${BASE_URL}/sitemap.xml\`` |
| Home page DB try/catch (HP1, R6) | ✅ `page.tsx:35-43` wraps `getDb()` call with try/catch, falls back to empty array |
| Play logs AbortController (PL1, R6) | ✅ `collection/page.tsx:31,75-77` uses `playLogsControllerRef` with abort-before-refetch pattern |

---

## 6. Bottom Line

This review found a **tightly coupled cluster of bugs** in the session lifecycle cleanup mechanism — an area where Code Review 3 suggested the *concept* of cleanup but no prior review examined the *implementation*. The cleanup code as written will inevitably crash once real users' sessions expire, and it will silently orphan their data in the process. The good news: all three issues trace to a single 8-line function (`cleanupExpiredSessions`), and the fixes are straightforward and well-scoped. Total estimated effort: ~1 hour. The remaining structural gaps from prior reviews (tests, CI, formatter, component decomposition) continue to be the largest outstanding items.
