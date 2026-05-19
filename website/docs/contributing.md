---
title: Contributing
description: How to set up GameScout for development and ship a great pull request.
---

# Contributing

GameScout welcomes contributions. The codebase is small enough that you can read it end-to-end in an afternoon, and the bar for a useful PR is correspondingly accessible.

## Local setup

```bash
git clone https://github.com/TabletopFoundry/gamescout
cd gamescout
npm install
npm run dev
```

See [Installation](./getting-started/installation) for platform-specific tips and `better-sqlite3` build notes.

## Before you commit

Both lint passes must be green:

```bash
npm run check
```

And the production build must succeed:

```bash
npm run build
```

These are also the checks CI runs.

## Code style

The repo enforces conventions via ESLint and `tsconfig.json` strict mode. A few things the linter can't enforce that we care about:

- **TypeScript strict everywhere.** No `any`, no `as unknown as`. Use `unknown` and narrow.
- **Sanitize before DB.** Every string from a request body or query param must pass through `src/lib/sanitize.ts` before reaching SQL.
- **Explicit column lists.** Use the exported `GAME_COLUMNS` / `GAME_LIST_COLUMNS` constants instead of `SELECT *`.
- **Shared types live in one place.** Add new interfaces to `src/types/index.ts`, not adjacent to the code that uses them.
- **API routes get JSDoc module comments** documenting the HTTP methods.
- **Lib modules get a top-of-file `@module` JSDoc.**
- **Client pages use a sibling `layout.tsx`** for metadata (because pages are `"use client"`).

If you're touching React, remember the project is on **React 19**: do not call `setState` inside `useEffect`. Use initializers or derived state.

## Pull request checklist

1. Branch from `main`: `git checkout -b feat/<short-name>`
2. Make focused commits using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add play log filter by year`
   - `fix: correct quiz progress bar arithmetic`
   - `docs: clarify seed version bump`
   - `refactor: extract complexity bucket helper`
3. Run `npm run check && npm run build` locally
4. Open a PR with a description that covers:
   - **What** changed
   - **Why** it changed (link an issue if there is one)
   - **How** to verify it (steps, sample requests, screenshots)

PRs that touch the recommendation engine should include a before/after example or a short explanation of why the score changed.

## Adding a new API endpoint

1. Create `src/app/api/<feature>/route.ts`
2. Add a top-of-file JSDoc comment documenting `GET`/`POST`/`DELETE`
3. Use `getDb()` and `getUserId()` for DB and session
4. Sanitize every string before insertion
5. Return JSON for success and `{ error }` for errors
6. Add the endpoint to [the API reference page](./reference/api)
7. If it's user-facing, add a guide page in `website/docs/guides/`

## Reporting issues

When filing an issue, include:

- Steps to reproduce
- Expected vs actual behavior
- `node --version` and `npm --version`
- Browser & OS if it's a UI bug
- A screenshot or recording if visual

## Code of conduct

Be kind. Assume good intent. Disagree with ideas, not people. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) v2.1 — by participating you agree to uphold it.

## License

By contributing, you agree your code will ship under the project's [MIT license](https://github.com/TabletopFoundry/gamescout/blob/main/LICENSE).
