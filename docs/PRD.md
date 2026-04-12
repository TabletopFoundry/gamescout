## Gap Analysis

| Dimension | Gap in existing PRD | Why it matters | Resolution in enhanced PRD |
|---|---|---|---|
| Vague requirements | "Smart discovery engine" and "modern UX" are not defined in user-visible terms or measurable outcomes. | Engineering cannot estimate or verify delivery. | Broke v1 into discrete features with IDs, user stories, acceptance criteria, and measurable success targets. |
| Missing scope boundary | The document mixes MVP, later phases, revenue ideas, and long-term vision into one feature set. | Teams may overbuild and miss launch dates. | Explicitly defined v1 in-scope, out-of-scope, and v2+ follow-ons. |
| Missing user stories | Features are listed, but not tied to user goals or trigger moments. | Hard to design flows and prioritize trade-offs. | Added user stories for every functional requirement and persona-based needs. |
| Missing acceptance criteria | No feature has pass/fail delivery criteria. | QA and engineering cannot validate completion. | Added Given/When/Then acceptance criteria for each functional requirement. |
| Missing edge cases | Import failures, sparse preference data, duplicate titles, and stale pricing are not addressed. | Core flows will fail in production without clear fallback behavior. | Added explicit edge cases and fallback handling per feature and flow. |
| Implicit assumption | The PRD assumes users will trust BGG import and retailer price data without consent, freshness, or accuracy controls. | Creates privacy, trust, and support risk. | Added consent, import transparency, price freshness rules, and open questions where source policy is unclear. |
| Contradiction | The product is described as mobile-first with React Native apps, but Phase 1 says responsive web MVP. | Delivery approach and staffing are ambiguous. | Resolved v1 as responsive web first; native apps moved to future consideration. |
| Contradiction | The recommendation section proposes a hybrid ML system, while Phase 1 only mentions a basic content-based MVP. | Engineering may overdesign v1. | Defined content-based recommendations for v1 and deferred collaborative filtering until data scale exists. |
| Missing prioritization | Every feature reads as equally important. | Roadmap and staffing decisions become subjective. | Added MoSCoW priority for every requirement and a phased rollout plan. |
| Missing NFRs | No targets for performance, uptime, security, accessibility, retention, or browser support. | Launch quality and compliance risk are undefined. | Added measurable NFR targets across all required dimensions. |
| Missing privacy/compliance detail | User accounts, import data, affiliate links, and future location/social features lack privacy boundaries. | Potential legal, trust, and safety issues. | Added data model access rules, PII identification, retention policy, and open compliance questions. |
| Missing integration constraints | BGG APIs, retailer feeds, and scraping are referenced without operational assumptions or fallback plans. | External dependency risk is underestimated. | Added integration point requirements, failure modes, and decisions needing input. |
| Missing release gates | Phases are high level but lack go/no-go criteria. | Teams cannot know when to promote alpha to beta to GA. | Added release stages, feature flags, and launch exit criteria. |
| Missing product metrics | Year-1 topline goals exist, but no activation, engagement, or recommendation quality metrics are defined. | Teams cannot manage funnel health early. | Added launch KPIs and instrumentation requirements [INFERRED]. |
| Missing state definitions | Social and collection behaviors do not define ownership/privacy states. | Causes inconsistent UX and data rules. | Added conceptual entities, access rules, and key state transitions. |
| Missing explicit exclusions | Reviews, groups, matchmaking, community, and premium monetization are described without saying whether they ship in v1. | Scope creep is likely. | Marked each as out of scope for v1 with rationale tied to the original phased plan. |

# Enhanced PRD: GameScout — Board Game Discovery & Social Platform

> Note: Unless directly stated in the original PRD, v1 scoping decisions, measurable targets, implementation details, and rollout mechanics below are marked as [INFERRED]. Missing business or policy decisions are marked [NEEDS INPUT].

### 1. Overview
- **Product name:** GameScout
- **One-line description:** Modern board game discovery and collection tracking for growing hobbyists.
- **Problem statement with evidence:** BoardGameGeek is the category leader with 150K+ games, 300K+ active users, and 15M+ ratings, but the existing experience is overwhelming for newcomers, weak on mobile, and poor at taste-based discovery. At the same time, the hobby is expanding among casual players, Gen Z, and adjacent entertainment audiences, while player-finding remains fragmented across Discord, Meetup, Facebook groups, and forums. The original PRD also notes that Board Game Atlas, a notable alternative, is offline, leaving a market gap for a simpler discovery-first product.
- **Proposed solution:** Launch a mobile-first responsive web product that helps users import or build a collection, complete a short taste quiz, receive personalized recommendations, browse by mood/use case, and track wishlist pricing for popular titles. This preserves the original Phase 1 intent while creating the data foundation for later social and matchmaking features.
- **Success metrics:**
  1. 30,000 monthly active users within 12 months of GA.
  2. 15,000 successful BGG collection imports within 12 months of GA.
  3. 25% Day-30 retention for users who complete onboarding [INFERRED].
  4. 12% recommendation-card click-through rate to game detail pages [INFERRED].

### 2. Users & Personas

| User type | Name / Role | Goals | Pain points | Tech comfort |
|---|---|---|---|---|
| Primary | **Gateway Graduate** - casual-to-mid hobbyist | Find the next game for their group, understand complexity quickly, avoid buying bad fits | BGG feels intimidating, too many choices, no clear onboarding, cannot translate vague preferences into game picks | Medium; comfortable with mainstream consumer apps |
| Secondary | **Committed Hobbyist** - frequent player and collector | Import existing collection fast, get better recommendations, evaluate gaps in collection | Existing tools are functional but ugly, collection management is time-consuming, recommendation lists feel generic | High; willing to use advanced filters if value is obvious |
| Tertiary | **Curious Newcomer** - hobby explorer | Learn what kinds of games exist, get simple starter recommendations, save games for later | Does not know hobby terminology, cannot compare player counts/weight/duration easily, gets lost in expert-first communities | Low to medium; expects TikTok/Netflix-level simplicity |

### 3. Scope

#### In scope (v1)
1. Responsive web application optimized for mobile browsers [INFERRED].
2. User account creation, sign-in, password reset, and persistent profile [INFERRED].
3. Taste profile onboarding quiz using ratings and preference prompts.
4. Searchable game catalog and game detail pages sourced from board game metadata.
5. Manual collection management for owned and wishlist states [INFERRED].
6. BGG import for collection and ratings where source data is available [INFERRED].
7. Personalized recommendation feed using content-based ranking for v1 [INFERRED].
8. Mood/use-case browsing using predefined filters such as player count, duration, complexity, and social context [INFERRED].
9. Price tracking display for the top 500 games and supported retailers, including affiliate click-out links [INFERRED].
10. Product analytics instrumentation for activation, import, recommendation, and conversion funnels [INFERRED].

#### Out of scope (v1)
1. Native iOS and Android apps - deferred because the original phased plan already supports a responsive MVP first.
2. Friend graph, activity feed, reviews, and community lists - aligned to the original Phase 2 social layer.
3. GPS-based player discovery, taste compatibility, game night scheduler, local groups, and calendar sync - aligned to the original Phase 3 matchmaking scope.
4. Discussion forums and creator-content embedding - valuable, but not required to validate core discovery and collection value.
5. Deal alerts, crowdfunding feed, and new-release calendar - require additional external-data reliability and notification infrastructure.
6. Premium subscriptions, promoted placements, and publisher insights tooling - monetization should not block v1 product adoption.
7. Cross-hobby imports from BGA, Steam, books, or movies - explicitly deferred until core recommendation quality is proven.
8. Photo-based play logging and advanced stats dashboard - useful, but not necessary for the first discovery-led release.

#### Future considerations (v2+)
1. Social graph, reviews, feed, and community-created lists.
2. Native mobile apps with offline collection access.
3. Collaborative-filtering layer once sufficient interaction volume exists.
4. Matchmaking, scheduling, local groups, and calendar integrations.
5. Deal alerts, crowdfunding feed, and publisher partnerships.
6. Cross-hobby recommendation inputs and richer taste graphing.

### 4. Functional Requirements

#### FR-001 - User Account & Authentication [INFERRED]
- **Title:** Account creation and sign-in
- **User story:** As a user, I want a persistent account so that my collection, quiz answers, and recommendations are saved across sessions.
- **Description:** Users must be able to register with email and password, sign in, sign out, reset a forgotten password, and maintain a profile containing display name and linked BGG username. Social login is out of scope unless explicitly approved later.
- **Acceptance criteria:**
  - Given a new visitor, when they submit a unique email, valid password, and display name, then an account is created and they are signed in.
  - Given an existing user, when they enter valid credentials, then they are signed in and returned to their last intended destination.
  - Given a user who forgot their password, when they request reset and use a valid reset link, then they can set a new password and sign in.
  - Given an unauthenticated user attempting to edit a collection, when prompted to authenticate, then they are returned to the interrupted action after successful sign-in.
- **Edge cases:** Duplicate email, weak password, expired reset token, email delivery delay, locked account after repeated failed attempts [INFERRED].
- **Priority:** Must
- **Dependencies:** Transactional email provider [INFERRED], user service [INFERRED].

#### FR-002 - Taste Profile Onboarding
- **Title:** Guided taste quiz
- **User story:** As a new or uncertain user, I want a short onboarding flow so that GameScout can recommend games without me knowing hobby jargon.
- **Description:** The quiz must gather enough initial signal to power first-session recommendations through a combination of rating known games and selecting preference prompts (e.g., player count, competitiveness, duration, complexity). The flow should be completable in five minutes or less for most users [INFERRED].
- **Acceptance criteria:**
  - Given a first-time signed-in user, when they start onboarding, then they see progress and can complete the flow in 10 steps or fewer [INFERRED].
  - Given a user who rates at least 5 presented games or completes equivalent preference prompts, when onboarding ends, then a recommendation feed is generated.
  - Given a user who skips unfamiliar games, when they reach the end with sparse input, then GameScout still generates fallback recommendations using explicit preference prompts and popular gateway titles [INFERRED].
  - Given a user who abandons onboarding mid-flow, when they return later, then progress is restored.
- **Edge cases:** User recognizes none of the suggested games, user quits mid-flow, user provides contradictory preferences, user imports BGG before finishing quiz.
- **Priority:** Must
- **Dependencies:** Game catalog, recommendation service.

#### FR-003 - Game Catalog Search & Detail Pages
- **Title:** Search and evaluate games
- **User story:** As a user, I want to search and inspect games quickly so that I can decide whether to own, wishlist, or try them.
- **Description:** Users can search the catalog by title and browse structured game details including cover art, player count, duration, weight/complexity, year, categories/mechanics, publisher, and community rating where available. Duplicate-title handling must be explicit through year/publisher disambiguation [INFERRED].
- **Acceptance criteria:**
  - Given a user enters a partial title, when matching games exist, then autocomplete or search results show likely matches with image, year, and player count.
  - Given a user opens a game detail page, when metadata is available, then the page shows the minimum required decision fields: player count, duration, weight, description, and why it was recommended if applicable [INFERRED].
  - Given missing art or incomplete metadata, when the detail page renders, then the page still loads with fallback placeholders and no broken layout.
  - Given duplicate game titles, when search results display, then year and publisher/designer context are shown to differentiate entries [INFERRED].
- **Edge cases:** Duplicate names, missing images, incomplete BGG metadata, adult or unavailable titles requiring moderation review [INFERRED].
- **Priority:** Must
- **Dependencies:** Metadata ingestion pipeline, search index [INFERRED].

#### FR-004 - Collection Management / Digital Shelf [INFERRED]
- **Title:** Own and wishlist management
- **User story:** As a user, I want to maintain my collection digitally so that recommendations reflect what I already own and what I want next.
- **Description:** Users can add games to Owned or Wishlist states from search and detail pages, remove them later, and browse their collection in a cover-art grid. The digital shelf is part utility, part emotional reward, and should visibly update recommendation logic.
- **Acceptance criteria:**
  - Given a signed-in user on a game detail page, when they choose Owned or Wishlist, then the state is saved immediately and reflected across the product.
  - Given a user viewing their collection, when games exist, then they can filter between Owned and Wishlist and sort by title or recently added [INFERRED].
  - Given a user removes a game from Owned, when the action completes, then the collection count updates and the recommendation engine excludes the removed ownership signal on the next refresh [INFERRED].
  - Given the user has no games saved, when they open the collection page, then an empty state encourages import or search.
- **Edge cases:** Duplicate add attempts, conflicting state changes across tabs, deleted catalog item, collection larger than 1,000 games [INFERRED].
- **Priority:** Must
- **Dependencies:** Auth, game catalog, recommendation service.

#### FR-005 - BGG Import
- **Title:** Import existing BGG profile data
- **User story:** As a hobbyist with a BGG account, I want to import my collection so that I do not need to start from scratch.
- **Description:** Users can connect a BGG username and import available collection data, wishlist data, and ratings if accessible. Import must be asynchronous, transparent, and idempotent so repeated runs do not create duplicates [INFERRED].
- **Acceptance criteria:**
  - Given a user submits a valid BGG username, when import starts, then a background import job is created and visible with status updates.
  - Given the source profile contains owned games, wishlist entries, or ratings, when import completes, then supported records are mapped into the user account without duplication.
  - Given the same user reruns import, when unchanged records already exist, then duplicates are not created and changed values are updated.
  - Given the BGG username is invalid or unavailable, when import fails, then the user sees a clear error message and retry option.
- **Edge cases:** Private or rate-limited BGG profiles, partial import failure, import interrupted by source outage, ambiguous title matches, unsupported fields such as plays or comments.
- **Priority:** Must
- **Dependencies:** BGG XML API, job queue [INFERRED], mapping rules [INFERRED].

#### FR-006 - Personalized Recommendation Feed [INFERRED]
- **Title:** Taste-based recommendations
- **User story:** As a user, I want GameScout to recommend games that fit my taste so that discovery feels easier than browsing generic top lists.
- **Description:** V1 recommendations will be content-based and use onboarding answers, collection state, and imported ratings to rank candidate games. The feed should explain at least one reason for each recommendation (e.g., similar weight, theme, player count, or because the user liked a related title) [INFERRED]. Collaborative filtering is intentionally out of scope for v1.
- **Acceptance criteria:**
  - Given a user has completed onboarding or imported enough data, when they open the home feed, then they see at least 20 ranked recommendations excluding owned titles by default [INFERRED].
  - Given a recommendation is shown, when the user opens the card, then at least one recommendation rationale is displayed.
  - Given user taste data changes through quiz completion, import, or collection edits, when the next feed refresh occurs, then recommendations are recalculated within 15 minutes [INFERRED].
  - Given insufficient user data, when the system cannot personalize strongly, then the user receives fallback recommendations from popular gateway titles with clear labeling [INFERRED].
- **Edge cases:** Cold-start user, sparse metadata, stale recommendation cache, overfitting to one game, recommendation list exhaustion after heavy ownership.
- **Priority:** Must
- **Dependencies:** FR-002, FR-004, FR-005, metadata taxonomy.

#### FR-007 - Mood / Use-Case Browsing [INFERRED]
- **Title:** Browse by occasion, not jargon
- **User story:** As a user, I want to browse games by the situation I am in so that I do not need to understand mechanics vocabulary.
- **Description:** Users can browse curated filter combinations such as Quick Party Game, Deep Strategy for 2, Cozy Solo Evening, and Family Game Night. Each mood maps to predefined ranges of player count, complexity, duration, and theme tags.
- **Acceptance criteria:**
  - Given a user selects a mood entry point, when results load, then the system applies a transparent filter set and returns matching games.
  - Given a mood returns results, when a user changes player count or duration filters, then the result set updates without losing the original mood context [INFERRED].
  - Given a mood has too few exact matches, when results are under threshold, then the system relaxes secondary filters and labels the result set as broadened [INFERRED].
- **Edge cases:** Contradictory filters, no exact matches, catalog items missing complexity or duration, overly broad moods producing low-quality results.
- **Priority:** Should
- **Dependencies:** Catalog metadata normalization, search/filter service [INFERRED].

#### FR-008 - Wishlist [INFERRED]
- **Title:** Save games for later consideration
- **User story:** As a user, I want to save interesting games without marking them as owned so that I can revisit them later.
- **Description:** Users can add games to a wishlist from recommendations, search, or detail pages. Wishlist exists separately from Owned to support future deal alerts and purchasing flows.
- **Acceptance criteria:**
  - Given a signed-in user, when they click Save or Wishlist, then the game is added to their wishlist and the UI confirms the action.
  - Given a user visits their wishlist, when items exist, then they can sort by recently added or lowest current price where available [INFERRED].
  - Given a user moves a game from Wishlist to Owned, when the change is saved, then the item is removed from Wishlist and added to Owned.
- **Edge cases:** Duplicate wishlist adds, price unavailable, out-of-stock retailer offers, state conflicts with imported ownership.
- **Priority:** Should
- **Dependencies:** Auth, catalog, FR-009.

#### FR-009 - Price Tracker [INFERRED]
- **Title:** Show current market pricing for popular titles
- **User story:** As a user, I want to see current prices for popular games so that I can decide when and where to buy.
- **Description:** For a curated top-500 catalog subset, GameScout displays the latest known prices across approved retailers, the timestamp of the latest refresh, and a click-out link. v1 is read-only; notifications and target-price alerts are out of scope.
- **Acceptance criteria:**
  - Given a supported game detail page, when retailer pricing exists, then the page shows the lowest current price, retailer name, and price timestamp.
  - Given multiple retailer prices are available, when the detail page renders, then offers are ranked by lowest total price according to configured rules [INFERRED].
  - Given pricing data is older than 24 hours, when displayed, then the UI labels it as stale and suppresses affiliate ranking claims [INFERRED].
  - Given a user clicks a retailer link, when navigation occurs, then the click is tracked for attribution and the user leaves via an affiliate-safe URL [INFERRED].
- **Edge cases:** Missing retailer feed, stale or conflicting prices, unsupported region/currency, scraped source blocked, SKU mismatch between editions.
- **Priority:** Should
- **Dependencies:** Retailer integrations, affiliate configuration [NEEDS INPUT], analytics.

#### FR-010 - Product Analytics Instrumentation [INFERRED]
- **Title:** Track activation and recommendation quality
- **User story:** As the product team, we want reliable event data so that we can assess whether discovery and import flows are working.
- **Description:** The system must emit structured analytics events for account creation, onboarding step completion, import start/success/failure, recommendation impressions, recommendation clicks, wishlist adds, and affiliate click-outs. No third-party analytics event may contain raw password, reset token, or other secrets.
- **Acceptance criteria:**
  - Given a supported user action occurs, when it completes, then the corresponding event is emitted with user ID, timestamp, and action metadata.
  - Given an import fails, when the failure is recorded, then the event includes failure reason category and import source.
  - Given analytics delivery fails client-side, when the product remains usable, then user actions still succeed and events are retried or logged server-side where appropriate [INFERRED].
- **Edge cases:** Ad blockers, duplicate events on refresh, anonymous-to-authenticated session merge, event schema versioning.
- **Priority:** Must
- **Dependencies:** Analytics provider [INFERRED], data warehouse/event pipeline [INFERRED].

### 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Authenticated home, catalog search results, and game detail pages must load in ≤3.0s at p95 on a simulated 4G connection for cached assets and ≤4.5s uncached [INFERRED]. |
| Performance | Search responses must return first 20 results in ≤500ms p95 server time; recommendation feed API must return in ≤800ms p95 excluding CDN asset load [INFERRED]. |
| Performance | BGG import must begin processing within 60 seconds of submission and complete 90% of imports of ≤500 games within 10 minutes [INFERRED]. |
| Availability | Core authenticated flows (sign-in, search, collection edit, recommendations) must meet 99.5% monthly uptime [INFERRED]. |
| Scalability | The platform must support 30K MAU, 5K DAU, 500 concurrent authenticated users, 200K catalog records, and 10M user-game relationship rows without architecture changes [INFERRED]. |
| Security | All traffic must use TLS 1.2+; passwords must be salted and hashed using Argon2id or bcrypt; secrets must be stored outside source control; rate limiting and basic bot protection must exist on auth and import endpoints [INFERRED]. |
| Security | PII access must be restricted by least privilege; audit logs must record admin access to user data; affiliate and analytics integrations must not receive plaintext passwords or reset tokens [INFERRED]. |
| Accessibility | v1 must meet WCAG 2.2 AA for color contrast, keyboard navigation, form labels, focus order, visible focus states, and screen-reader names on primary flows [INFERRED]. |
| i18n | v1 launch language is English only [INFERRED], but all user-facing strings must be externalized so future localization is possible without refactoring [INFERRED]. |
| Data retention | Raw BGG import payloads must be deleted within 24 hours of successful normalization [INFERRED]. User account deletion must remove or anonymize account-linked PII within 30 days [INFERRED]. Product analytics tied to user behavior may be retained for up to 25 months unless legal guidance requires less [INFERRED][NEEDS INPUT]. |
| Browser / device support | Support latest 2 stable versions of Chrome, Safari, Firefox, and Edge on desktop, plus Safari on iOS 16+ and Chrome on Android 12+ [INFERRED]. |
| Compliance | Affiliate disclosures must appear anywhere commercial links are shown [INFERRED]. Privacy policy and terms must explicitly cover import behavior, analytics, and retailer click tracking [NEEDS INPUT]. |

### 6. User Flows

#### Flow 1 - New user onboarding to first recommendations
- **Happy path:** Landing page -> Sign up -> Email verified or session created -> Start taste quiz -> Rate/skip games -> Choose preference prompts -> Recommendations generated -> User opens a game detail page -> Adds Owned or Wishlist.
- **Error paths:** Duplicate email -> inline validation; onboarding abandoned -> resume later; too little taste signal -> fallback gateway recommendations; recommendation service timeout -> show curated popular titles and retry banner [INFERRED].
- **State transitions:** `visitor -> registered -> onboarding_in_progress -> onboarding_complete -> recommendations_ready -> collection_seeded`.

#### Flow 2 - BGG import to populated collection
- **Happy path:** Signed-in user -> Opens import -> Enters BGG username -> Confirms consent -> Import job queued -> Status updates -> Import completes -> Collection grid populated -> Recommendations refreshed.
- **Error paths:** Username not found; BGG rate limit; partial mapping failure; duplicate records merged; import timeout with retry option.
- **State transitions:** `import_not_started -> queued -> fetching -> mapping -> completed` or `queued -> failed_retryable`.

#### Flow 3 - Search and manual collection building
- **Happy path:** Signed-in user -> Searches by title -> Opens result -> Reviews metadata -> Marks Owned or Wishlist -> Collection count updates -> Recommendation feed refreshes.
- **Error paths:** No results -> suggest broader search; duplicate title confusion -> disambiguate by year/publisher; missing metadata -> fallback detail template.
- **State transitions:** `search_idle -> results_loaded -> detail_viewed -> state_saved`.

#### Flow 4 - Mood-based discovery to wishlist
- **Happy path:** User opens Discover -> Selects mood such as "Quick party game for 6" -> Sees filtered results -> Adjusts duration/player count -> Opens detail page -> Saves to Wishlist.
- **Error paths:** Zero exact matches -> broadened results; incomplete metadata -> reduced confidence label [INFERRED]; anonymous user attempts save -> auth gate then resume.
- **State transitions:** `discover_idle -> mood_selected -> filtered_results -> detail_viewed -> wishlisted`.

#### Flow 5 - Price check to retailer click-out
- **Happy path:** User opens a supported game detail page or wishlist item -> Sees current retailer offers -> Clicks preferred offer -> Event tracked -> Retailer page opens.
- **Error paths:** No current price -> show unavailable state; stale price -> label outdated; unsupported currency/region -> suppress offer ordering [INFERRED].
- **State transitions:** `price_unavailable | price_fresh | price_stale -> clickout_tracked`.

### 7. Data Model (Conceptual)

| Entity | Purpose | Key relationships | Access rules | PII fields |
|---|---|---|---|---|
| User | Core account and identity record | 1:N with CollectionItem, WishlistItem, TasteProfile, ImportJob, RecommendationSnapshot | User can read/update own record; admin access must be audited [INFERRED] | Email, display name, BGG username [optional], hashed password |
| TasteProfile | Stores onboarding answers and normalized preference vectors | N:1 to User | User-readable; service-readable for recommendation generation | None directly, but linked to User ID |
| Game | Canonical catalog record | 1:N with CollectionItem, WishlistItem, PriceSnapshot, RecommendationSnapshot | Readable by all users | None |
| CollectionItem | Owned relationship between User and Game | N:1 to User and Game | Only owner can create/update/delete | User ID |
| WishlistItem | Saved-for-later relationship between User and Game | N:1 to User and Game | Only owner can create/update/delete | User ID |
| UserGameRating [INFERRED] | Stores explicit ratings from onboarding/import | N:1 to User and Game | Only owner editable; system can ingest via import | User ID |
| ImportJob | Tracks import requests and status | N:1 to User | User can view only own jobs; ops can view aggregate status [INFERRED] | User ID, BGG username |
| RecommendationSnapshot [INFERRED] | Materialized recommendation results and rationale | N:1 to User, N:1 to Game | User can read own results; service regenerates | User ID |
| PriceSnapshot | Stores retailer price observations | N:1 to Game | Readable by all users; write access restricted to ingestion services | None |
| RetailerOffer [INFERRED] | Configures retailer metadata and affiliate templates | 1:N with PriceSnapshot | Internal/admin only | None |

**Access and privacy rules**
- Collections and wishlists are private by default in v1 [INFERRED][NEEDS INPUT].
- No user-generated reviews, comments, photos, or precise location data are stored in v1.
- Imported BGG data is limited to fields necessary for collection, ratings, and recommendation seeding; unsupported raw fields should not be retained beyond temporary processing.

### 8. Integration Points

| Integration | Purpose | v1 usage | Failure handling / notes |
|---|---|---|---|
| BGG XML API | Import user collection/ratings and enrich catalog metadata | Required | Queue imports, retry on transient errors, surface clear user-facing failure states, respect source rate limits [INFERRED]. |
| Retailer price feeds / APIs / approved scraping | Populate top-500 price tracker | Required for FR-009 | Mark stale data after 24 hours; suppress unsupported or untrusted offers; confirm legal/commercial approval for scraping [NEEDS INPUT]. |
| Transactional email provider [INFERRED] | Password reset and account messages | Required | Fallback logging and resend flow for temporary email failure. |
| Analytics provider / event pipeline [INFERRED] | Activation and conversion measurement | Required | Events must be non-blocking; failures must not break user flows. |
| CDN / image cache [INFERRED] | Serve game box art efficiently | Required | Use placeholders if origin images fail; cache bust on catalog updates. |

### 9. UX/UI Requirements
1. The product must feel materially simpler than BGG: low-density layouts, progressive disclosure, and clear primary actions on every screen.
2. Mobile-first responsive design is required; primary launch breakpoints should optimize for ~390px mobile width first, then tablet, then desktop [INFERRED].
3. Onboarding must show progress, allow skipping unfamiliar titles, and avoid jargon unless paired with plain-language explanations.
4. Recommendation cards must show cover art, player count, duration, weight, and a short "why this fits you" explanation [INFERRED].
5. Collection and wishlist views must use a visual shelf/grid layout first, with optional list sorting for heavier users [INFERRED].
6. Empty states must always offer a next action: start quiz, import BGG, search catalog, or browse gateway recommendations.
7. Price displays must show retailer name, price timestamp, and affiliate disclosure copy [INFERRED].
8. Loading states must use skeletons or placeholders rather than blank pages for search, recommendations, and collection views [INFERRED].
9. Error states must explain what happened in plain language and provide retry or fallback actions.
10. Accessibility requirements from Section 5 apply to all primary screens before GA.

### 10. Release & Rollout

#### Delivery plan [INFERRED]
- **Milestone A - Internal alpha:** Auth, catalog ingestion, search, game detail pages, manual collection management.
- **Milestone B - Closed beta:** Onboarding quiz, BGG import, first recommendation feed, analytics instrumentation.
- **Milestone C - Public beta:** Mood browsing, wishlist, top-500 price tracker, affiliate disclosures, operational monitoring.
- **Milestone D - GA:** Performance hardening, accessibility fixes, uptime readiness, launch content, support process.

#### Rollout controls [INFERRED]
- Feature-flag BGG import and price tracker independently.
- Start with invite-only beta users from board-game communities, then expand to public sign-up after import success rate and recommendation engagement thresholds are met.
- Use progressive rollout for recommendation model changes; keep the previous ranking model available for rollback.

#### Exit criteria [INFERRED]
- **Closed beta -> Public beta:** ≥85% successful BGG imports, p95 feed API latency ≤800ms, no Severity-1 auth defects open.
- **Public beta -> GA:** 99.5% uptime over 30 consecutive days, WCAG 2.2 AA audit passed on primary flows, recommendation CTR ≥10%, critical funnel instrumentation validated.
- **Post-GA monitoring:** Weekly review of onboarding completion, import failures, recommendation CTR, wishlist adds, and retailer click-outs.

### 11. Open Questions
1. **[NEEDS INPUT]** Which launch geographies and currencies are supported in v1 for retailer pricing and affiliate links?
2. **[NEEDS INPUT]** Is BGG import limited to public collection and ratings data, or is any authenticated/import-partner workflow expected?
3. **[NEEDS INPUT]** Are retailer prices sourced only from approved APIs/feeds, or is scraping an accepted business and legal strategy?
4. **[NEEDS INPUT]** Should collections and wishlists be private by default, or user-selectable public/private at launch?
5. **[NEEDS INPUT]** Is email/password sufficient for v1, or is OAuth/social login required for launch?
6. **[NEEDS INPUT]** What legal retention limit should apply to analytics and affiliate click tracking data?
7. **[NEEDS INPUT]** What exact catalog coverage target is required for v1 beyond the top-500 priced games (e.g., full BGG catalog import vs curated subset)?
