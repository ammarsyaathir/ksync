# K-Sync Malaysia — FULL FOLDER PERFORMANCE AUDIT

**Target:** `C:\Users\ammar\.gemini\antigravity\scratch\ksync_malaysia` — **everything in the folder**
**Date:** 18 Oct 2026 · **Chrome:** 155.0.8059.80 · **Node:** v22.16.0 · **PHP:** 8.x (legacy, not runnable as shipped)

> This is the **full sweep** (option 2). The running Node app was measured live; everything else —
> the retired PHP app, all six database schemas, the scripts, CI, docs and dependencies — was read
> line by line. Where a claim could be tested, it was tested rather than assumed (see §6).
>
> The measurement detail for the running app lives in **`perf/AUDIT.md`**; this document summarises
> it and adds the ~250 files that were not in scope there.

---

## 0. What "everything" covers

| Path | Files | Size | In this audit |
|---|---|---|---|
| `server.js`, `config/`, `src/`, `views/`, `public/` | 43 | 0.45 MB | ✅ measured live + line by line |
| `REMOVED/php/` (retired PHP app) | 60 | 0.92 MB | ✅ line by line (§3) |
| `REMOVED/php/php_backup/` (older PHP copy) | 39 | 0.82 MB | ✅ differential audit (§3.9) |
| `REMOVED/database_versions/` (6 schemas + 4 scripts) | 12 | 0.20 MB | ✅ §4 |
| `REMOVED/scripts_and_scratch/` | 24 | 0.05 MB | ✅ §4.4 |
| `REMOVED/cloudflare/`, `REMOVED/auth_and_unused_js/` | 3 | 0.01 MB | ✅ §5.2 |
| `docs/` | 115 | 5.80 MB | ✅ §5.1 |
| `.github/workflows/` | 1 | 0.01 MB | ✅ §5.3 |
| `database/` (live DB + MySQL schema) | 4 | 0.76 MB | ✅ §4.1, §6 |
| `node_modules/` | 12 726 | 233.7 MB | ✅ footprint only (§5.4) |
| `.env`, `.env.example`, `.gitignore`, `package*.json` | 5 | 0.15 MB | ✅ §5.5 |
| `perf/` | ~10 | 0.09 MB | ⚪ audit harness + reports (keep) |
| ~~`design/`~~ | — | — | 🗑️ **deleted** (rejected redesign, 40 files / 9.28 MB) |

**Total excluding `node_modules`/`.git`: 8.68 MB** (was 17.96 MB before `design/` was removed).

---

## 1. Verdict

| Layer | Verdict |
|---|---|
| **Node app — server** | 🟢 **Fast.** TTFB 14–20 ms. Not the problem. |
| **Node app — front end** | 🔴 **Very slow.** LCP 4.1–5.0 s, TBT 1.6–3.5 s. Third-party dominated. |
| **Node app — database** | 🔴 **Broken as well as slow.** Zero custom indexes on 11 tables; a dangling FK makes every notification fail twice; the live schema **rejects the app's own registration INSERT** (§6.5). |
| **Legacy PHP app** | 🔴 **Pathological**, but **retired** — it runs the entire schema init + seed on *every request*. Not deployed; no runtime impact today. |
| **MySQL schemas** | 🔴 **All six versions declare zero indexes**, and the shipped one is **inconsistent with the app and the live DB** (missing `reports`/`event_chat_messages` columns, wrong `activity_logs` names). Pointing the app at MySQL with it breaks logging, reports and chat. |
| **Repo hygiene** | 🟠 233.7 MB deps, 19.11 MB of it unused (`docx`), retired code + docs committed, CI uploads the whole 239 MB workspace. |

**The one-line version:** the Node app's *server* is excellent, its *front end* is the user-facing
emergency, and its *database* is both unindexed and — on the live SQLite file — actively rejecting the
app's own writes; the retired PHP tree is far worse architecturally but harmless because it is not
running.

---

## 2. Part A — The running app (Node / Express / EJS)

Full working is in `perf/AUDIT.md`. Headline numbers, cold cache, Slow 4G, 4× CPU:

| Page | TTFB | FCP | **LCP** | CLS | **TBT** | Transferred |
|---|---|---|---|---|---|---|
| `/` | 15 ms | 3 848 ms | **4 552 ms** 🔴 | 0.019 🟢 | **1 571 ms** 🔴 | 870.7 KB |
| `/events` | 20 ms | 3 688 ms | **4 084 ms** 🔴 | 0.002 🟢 | **1 603 ms** 🔴 | 994.3 KB |
| `/submit-event` | 15 ms | 3 952 ms | **5 012 ms** 🔴 | 0.000 🟢 | **3 454 ms** 🔴 | 465.9 KB |
| `/login` | 14 ms | 3 744 ms | **4 372 ms** 🔴 | 0.047 🟢 | **2 790 ms** 🔴 | 501.3 KB |

Your server serves **138 KB across 4 pages**; third parties serve **2 694 KB** (~19:1).

**Ranked causes**

1. **Tailwind Play CDN** — `views/partials/header.ejs:15`. Synchronous, render-blocking, and a
   *runtime CSS compiler*: 124 KB JS + **~1.4 s main-thread work per page**, re-running on every
   DOM class toggle.
2. **Full Font Awesome bundle** — `header.ejs:50`. **297 KB/page** for ~40 icons.
3. **Hotlinked, duplicated, un-sized images** — 373 KB on `/`, **508 KB on `/events`**. Zero
   `width`/`height`/`loading`/`fetchpriority` anywhere in `views/`. The same photo downloads
   **twice** on one page (`?w=600` vs `?w=600&auto=format&fit=crop`) ≈ **148 KB wasted**.
4. **No compression + no caching** — confirmed: `Accept-Encoding: gzip, br` still returns
   `content-encoding: ''`, `Content-Length: 44981`; `/favicon.svg` → `Cache-Control: public, max-age=0`.
5. **`location.reload()` after every interaction** — `event-details.ejs:574,593,715`, `saved-events.ejs:87`.
6. **No pagination anywhere**; `api.js:120` returns every chat message ever.
7. **Per-request waste** — 2 queries per request for logged-in users (`middleware/auth.js:21-36`,
   `SELECT u.*` returning **22 columns incl. `password_hash`** — verified, §6), N+1 notification
   loops (`helpers.js:271-288,313-347`), `bcryptjs` blocking the event loop 50–150 ms per auth call.
8. **Zero database indexes** (§4.1) — every hot `WHERE`/`JOIN`/`ORDER BY` is a full scan. Worse,
   the login/registration and tracking-code lookups wrap indexed columns in `LOWER()`/`UPPER()`
   (`auth.js:68,178,356`, `submissions.js:218`, `admin.js:65`), which **defeats the only indexes that
   do exist** → a full scan of `users` on every login.
9. **The live schema rejects two of the app's own writes** — registration (§6.5) and notifications
   (§6.1). Both are schema defects, not application bugs.

---

## 3. Part B — The retired PHP application (`REMOVED/php/`)

**Stack:** PDO + SQLite, server-rendered PHP, Tailwind/FontAwesome/Google Fonts CDN, Firebase +
Supabase JS SDKs. No `mysqli` anywhere.

**Two facts that govern everything below**

1. **This tree cannot execute as shipped.** There is no `REMOVED/php/config/` directory, but every
   page bootstraps through `includes/header.php` and `includes/functions.php`, which
   `require_once` `../config/auth.php` / `../config/database.php`. Those files exist **only** in
   `php_backup/config/`. The root `auth.php` + `database.php` are the working equivalents.
2. **There is no caching layer of any kind** — no OPcache config, no APCu, no Memcached, no file/data
   cache. The single exception is a 1-hour Google-cert file cache in `verify_token.php:24-39`.

### 🔴 HIGH

**3.1 — `database.php:597` runs the full schema init + seeding on EVERY request**
```php
// Automatically initialize tables and seed data
init_database($pdo);
```
This file is required by `includes/functions.php:4`, which every page and AJAX endpoint includes.
So **every HTTP request** executes `init_database()` (lines 24–594):
- 23 × `CREATE TABLE IF NOT EXISTS`, 39 `exec` calls total
- **~14 × `ALTER TABLE … ADD COLUMN`** — the `$event_cols` loop (**354–358**) tries 11 columns plus
  **360–362**; once the columns exist **each one throws and is silently swallowed** (`catch (PDOException $e) {}`) → 11+ thrown exceptions per request for zero benefit
- **7 × `SELECT COUNT(*)`** full counts (375, 381, 406, 425, 444, 468, 570)
- unconditional `UPDATE`s (402, 461–464)
- **364–372** — a per-request `SELECT … WHERE tracking_code IS NULL` + a per-row `UPDATE` backfill loop

**3.2 — `ajax/ai_extract_poster.php:80-89` synchronous external LLM call** — blocking cURL to
Gemini with `CURLOPT_TIMEOUT, 15`, on a request triggered by the organizer submit form
(`organizer/submit-event.php:331`). Holds a PHP worker for up to 15 s; also three unbounded table
loads first (21–23).

**3.3 — `ajax/get_chat_messages.php:15-44` returns the ENTIRE chat history every 5 s** — no
`LIMIT`, no `since_id` cursor; client polls at `event-details.php:754` (`setInterval(fetchChatMessages, 5000)`).
Re-joins `users` + `roles` for every message, every 5 s, per client. `event_chat_messages.event_id` unindexed.

**3.4 — `ajax/buddy_actions.php:199-214` + `buddy-chat.php:142,217` — a second unbounded poll loop
at 4 s** (`setInterval(fetchBuddyMessages, 4000)`). Two chat pollers can run on one page.

**3.5 — N+1 `is_event_saved()` inside render loops** — `index.php:163`, `events.php:229`, with the
query at `includes/functions.php:139-145`. On `events.php` that is **60 queries per page load**.

**3.6 — `includes/functions.php:102-123` notification fan-out** — one `INSERT` per saved user in a
`foreach`; 10 000 savers = 10 000 statements in one request.

### 🟠 MEDIUM

| # | Location | Issue |
|---|---|---|
| 3.7 | `events.php:19-74`, `:76-78` | Unbounded listing + 3 more full-table loads, incl. `SELECT DISTINCT city` re-scan |
| 3.8 | `admin/dashboard.php:9-16` | **8 separate `COUNT(*)`** scans per dashboard view |
| 3.9 | `organizer/dashboard.php:11-25` | **4 `COUNT(*)` on the same table** — should be one `GROUP BY` |
| 3.10 | `admin/verifications.php:68-107` | 4 unbounded loads + **correlated subquery per row** (`:92`) |
| 3.11 | `includes/functions.php:128-134, 182-209, 214-242` | Aggregate helpers that full-scan on each call; `get_unread_notification_count()` runs on **every page** via `header.php:9` |
| 3.12 | `event-details.php` (22, 57-64, 69, 73, 79, 89 + header helpers) | **~11–12 sequential queries** per single event view |
| 3.13 | `admin/{users,events,user-reports,updates,artists,categories,venues}.php` | No `LIMIT`/pagination on any admin listing; `LEFT JOIN … GROUP BY` aggregates force full `events` scans |
| 3.14 | `buddies.php:19`, `notifications.php:13-20` | Unbounded lists (the AJAX variant correctly caps at 30) |
| 3.15 | `check-submission.php:68-85` | Full event scan by email; `tracking_code` unindexed |
| 3.16 | `submit-event.php:12-14`, `organizer/submit-event.php:9-11`, `organizer/edit-event.php:33-34` | 3 × `SELECT *` dropdown loads; venue rows `json_encode`d into every `<option>` |

### 🟡 LOW
- `verify_token.php:31-39` — cURL to Google certs, **correctly file-cached for 1 hour** (the app's only cache).
- Hotlinked Unsplash images (`database.php:409-416,480,492,504,516,528,540`; fallbacks in `admin/artists.php:18`, `submit-event.php:35`), Tailwind CDN (`includes/header.php:19`), Maps iframe (`event-details.php:505`), and `organizer/dashboard.php:182` which builds the check-in QR by hotlinking **`api.qrserver.com`** (leaks the check-in URL to a third party).
- Client timers: `event-details.php:626` (1 Hz), `saved-events.php:130` (30 s).

### 🟢 Genuinely well-optimised — do not "fix"
`admin/logs.php:15` (`LIMIT 100`), `ajax/get_notifications.php:24` (`LIMIT 30`),
`admin/dashboard.php:25,34` (`LIMIT 5/6`), `organizer/dashboard.php:34` (`LIMIT 5`),
`event-details.php:89` (`LIMIT 3`), **local HMAC/JWT verification** in `verify_token.php` (no
network call on the request path), and consistent prepared statements throughout (only a cosmetic
int-cast at `ajax/buddy_actions.php:168`).

### 3.9 Differential audit — `php_backup/` vs `php/`

**Direction of history:** the on-disk `php/` files are the **newer, security-hardened** revision;
`php_backup/` is the **older** one. Determined from every diff (current verifies tokens server-side
and restricts roles; the backup trusts client-supplied `email`/`uid`/`role`).

Meaningful differences: `database.php` (current adds the `tracking_code` backfill block +
`submitter_*` columns), `auth.php` (current adds an `ob_start()` guard), `login.php`, `admin/verifications.php`,
`includes/navbar.php` (current adds "Track Status" links), `includes/firebase_init.php`,
`includes/supabase_auth_init.php`, `ajax/firebase_google_auth.php`, `ajax/supabase_auth_sync.php`,
`submit-event.php`, `register.php`.

**Does `php_backup` contain anything worth porting?** Only the **`config/` directory** that the live
tree is missing. Its only performance difference is that it is *slightly faster* because it **skips
token verification** — i.e. its speed comes from being less secure. **Nothing in `php_backup` is a
performance optimisation worth adopting.** ~0.82 MB of it is recoverable dead weight.

---

## 4. Part C — Databases

### 4.1 Live SQLite database (`database/ksync.db`) — measured

```
table                      rows  indexes
roles                         3  sqlite_autoindex_roles_1(u)
users                         5  sqlite_autoindex_users_2(u), sqlite_autoindex_users_1(u)
artists                       9  NONE
event_categories              8  sqlite_autoindex_event_categories_2(u), …
events                        3  NONE
saved_events                  0  sqlite_autoindex_saved_events_1(u)
notifications                 0  NONE
activity_logs               120  NONE
event_chat_messages           1  NONE
reports                       5  NONE
venues                        7  NONE

Custom CREATE INDEX statements found: 0 (only 6 UNIQUE autoindexes exist)
```

**Zero user-created indexes on 11 tables.** Every `WHERE`, `JOIN` and `ORDER BY` on a non-key column
is a full table scan. Columns that need indexes:

`events.verification_status`, `events.event_date`, `events.start_time`, `events.created_at`,
`events.organizer_id`, `events.artist_id`, `events.category_id`, `events.venue_id`, `events.city`,
`events.state`, `events.tracking_code`, `event_chat_messages.event_id`, `event_chat_messages.created_at`,
`notifications.user_id`, `notifications.is_read`, `notifications.created_at`,
`saved_events.event_id`, `reports.status`, `reports.user_id`, `reports.event_id`,
`activity_logs.created_at`, `activity_logs.action`, `users.role`.

**Two things make this worse than "just add indexes":**

1. **SQLite does not auto-index foreign keys** (unlike InnoDB). So `events.organizer_id/artist_id/
   category_id/venue_id`, `event_chat_messages.event_id/user_id`, `activity_logs.user_id`,
   `notifications.user_id/event_id` and `reports.user_id/event_id` are unindexed — every join and
   every `ON DELETE CASCADE` is a full scan.
2. **`LOWER()`/`UPPER()` on indexed columns defeats the indexes that do exist.** `auth.js:68` and
   `:178` (`WHERE LOWER(username)=LOWER(?) OR LOWER(email)=LOWER(?)`), `auth.js:356` and
   `submissions.js:218` (`LOWER(tracking_code)` over the `tracking_code` UNIQUE) and `admin.js:65`
   (`UPPER(role)`) all force a full scan — **including on every single login** — and an `OR` across
   two indexes means neither is used.

**Pragmas (measured, `perf/db-pragmas.mjs`)**

| Pragma | Value | Note |
|---|---|---|
| `journal_mode` | `wal` | WAL files are correctly **gitignored** (`.gitignore:13-14`) — not a defect |
| `foreign_keys` | **1** | better-sqlite3 default — **this is what breaks notifications** (§6.1) |
| `auto_vacuum` | `0` | file never shrinks |
| `freelist_count` | 22 of 51 pages | **90 KB (43%) of the 208 KB file is free pages** after past cleanups |
| `mmap_size` | `0` | memory-mapped reads disabled (could speed reads) |
| `cache_size` | −16000 | 16 MB page cache — fine |

No pragma is set anywhere in application code (verified by grep across `server.js`, `config/`,
`src/**`) — the DB's mode is inherited from the file, not managed by the app.

### 4.2 MySQL schema the app ships — `database/hostinger_mysql_schema.sql` (24 KB)

9 tables (its own header at `:3` claims "10 Essential Tables"), InnoDB / utf8mb4_unicode_ci. Declares
only PKs, FKs and UNIQUE constraints; **`CREATE INDEX` count = 0** (12 `KEY` tokens, all
`PRIMARY`/`FOREIGN`/`UNIQUE`). `:14` does `DROP TABLE IF EXISTS roles` but **never recreates
`roles`** — a dangling drop.

It is **not consistent with the app or with the live SQLite DB**:

| Concern | This MySQL schema | App / live SQLite | Result if deployed on MySQL |
|---|---|---|---|
| `activity_logs` columns | `target_type`, `target_id`, `details` | `entity_type`, `entity_id`, `description` (`helpers.js:146`) | **`logActivity` fails** — "Unknown column 'entity_type'" |
| `reports` columns | missing `evidence_url`, `admin_action`, `admin_notes`, `resolved_by`, `resolved_at` | all present | **report submit + admin report actions fail** (`api.js:101`, `admin.js:435-466`) |
| `event_chat_messages` | no `is_organizer` | has `is_organizer` | **chat post fails** (`api.js:167`) |
| admin lookup | only `role` | both `role` and `role_id` | `helpers.js:285` `WHERE … role_id = 1` → **"Unknown column 'role_id'"** |
| `notifications` | has `title`, `link` | **no `title`/`link`** | MySQL OK; SQLite relies on the broken fallback (§6.1) |
| `users` identity | only `role` | `role_id **NOT NULL**` + `role` | **registration fails on SQLite** (§6.5) |

Plus the dangling FK noted in the earlier audit: `notifications.update_id → event_updates(id)`, where
`event_updates` was dropped by `migrate_to_ch1_schema.js:15` and no longer exists.

### 4.3 The other five schema versions (`REMOVED/database_versions/`)

`ksync_mysql.sql` (10 KB), `azure_mysql_schema.sql` (14 KB), `azure_sql_schema.sql` (14 KB),
`postgres_schema.sql` (17 KB), `backups/hostinger_mysql_schema_23_tables.sql` (58 KB) — plus
`backups/ksync_23_tables_backup.db` (188 KB) and four JS generators/migrations
(`add_members_to_artists.js`, `generate_clean_mysql_schema.js`, `migrate_to_ch1_schema.js`,
`update_artists_members.sql`).

**Every schema version in the repo was checked for index declarations** (literal token counts, not
grep guesses):

| Schema file | Tables | `CREATE INDEX` statements |
|---|---|---|
| `database/hostinger_mysql_schema.sql` | 9 | **0** |
| `REMOVED/database_versions/ksync_mysql.sql` | 12 | **0** |
| `REMOVED/database_versions/azure_mysql_schema.sql` | 10 | **0** |
| `REMOVED/database_versions/azure_sql_schema.sql` | 10 | **0** |
| `REMOVED/database_versions/postgres_schema.sql` | 22 | **0** |
| `backups/hostinger_mysql_schema_23_tables.sql` | 23 | **0** |

**Every one of the six schema versions defines zero indexes.** Whatever engine you deploy on —
SQLite, MySQL, Azure SQL or Postgres — the application runs unindexed (and the Postgres/Postgres-ish
files have no FKs at all, only inline `REFERENCES`). Adding indexes is the single most portable,
highest-value server-side fix available, and it needs no application code change.

**Schema drift (root cause).** The versions disagree on columns *and* table counts, and the generator
that produces the shipped file — `generate_clean_mysql_schema.js:27-36,214` — **emits no
`CREATE INDEX` statements at all**, so every regeneration is index-free by construction. Examples:
`artists.members` is `LONGTEXT` in the shipped/live schema but **absent** from `ksync_mysql.sql:51-59`
and `postgres:36-44`; `events` differs three ways (shipped/live have `slug`, `gallery_images`,
`trust_level`; `ksync_mysql.sql:106-134` has `venue_id` + `fan_chant_url` but not those; `postgres`
has yet another set); reports are `reports` in the app/live but `event_reports` in
`ksync_mysql.sql:200` and **both** `event_reports` *and* `user_reports` in `postgres`; `activity_logs`
uses `target_*`/`details` only in the shipped file. There is **no single source of truth for the
schema** in this repo — a maintenance hazard that will silently break whichever engine you deploy on.

**`SELECT *` over LONGTEXT** compounds it: `artists.members` and `events.gallery_images` are
`LONGTEXT`, yet `submissions.js:15`, `events.js:67/101` and `admin.js:23/363` pull `SELECT *` for list
and dropdown queries that never render those fields. `events.js:171` and `:278` also read
`SELECT id, event_name FROM events` unbounded and then `Array.find()` in JS instead of using the
`slug` index.

### 4.4 `REMOVED/scripts_and_scratch/` (24 files) and the DB scripts

**24** one-off scratch scripts — 5 testing the mailer (`test_live_gmail.js`, `test_hostinger_smtp.js`,
`test_email_service.js`, …), 4 HTTP smoke tests, 4 DB inspectors — plus `scripts/update_artists.js`.
Several have **live side effects** (`test_submission.js` and `test_submission_email.js` write a real
event; `verify_clean_system.js` posts a real report; 3 send real email) and two handle credentials
(`fix_passwords.js`, `update_passwords.js`). None are in any build or runtime path:
**recommend deleting the folder.**

Performance patterns inside them, for completeness:

- **Per-row writes with no transaction** — `add_members_to_artists.js:378-382` (8 `UPDATE`s),
  `migrate_to_ch1_schema.js:24-31` (14 `DROP`s), `cleanup_to_one_event.js:35-41` (5 `DELETE`s then an
  `INSERT`, **non-atomic** — a crash leaves an empty `events` table), `fix_passwords.js:10-16`,
  `update_passwords.js:11-15`.
- **N+1 inside a script** — `check_tables.js:8-11` issues one `COUNT(*)` per table.
- **Full-file read/write rewrites** — `generate_clean_mysql_schema.js:214` (the whole schema as one
  string), `sync_artists_mysql.js:7,26`, `sync_mysql_dump.js:7,52-53`.
- **`update_passwords.js:22-24` calls `bcrypt.compare` 3× per user (15 verifications)** and never
  closes its handle; `inspect_schema.js:2` / `inspect_backup.js:5` open the DB **read-write** with no
  `{readonly:true}`; `audit_80_use_cases.js:3` hardcodes `C:/Users/ammar/AppData/Local/Temp/...`.
- `REMOVED/auth_and_unused_js/db.js:1` imports `pg`, **which is not in `package.json`** → crashes on
  import; `:20-32` pipes all of `postgres_schema.sql` through one query at boot.
- `update_artists_members.sql:11-13` uses `ADD COLUMN IF NOT EXISTS`, unsupported on MySQL < 8.0.29
  and many MariaDB builds (Hostinger).

### 4.5 The database connector (`config/database.js`)

- **No prepared-statement cache** — `:104`, `:132`, `:177` call `sqliteDb.prepare(sql)` fresh on every
  call, so hot queries recompile their SQL each time.
- **No `PRAGMA busy_timeout`** (default 0 ms) — a second writer on the same file gets an immediate
  `SQLITE_BUSY`; WAL is set at `:46` but `synchronous`/`cache_size` are left at defaults.
- **Inconsistent MySQL path** — `:98` uses `mysqlPool.query` for reads while `:168` uses
  `mysqlPool.execute` for writes.
- `:102-103`/`:130-131`/`:174-175` lazily re-open the SQLite handle, duplicating `:45` (harmless, redundant).

---

## 5. Part D — Dependencies, CI, docs and repo hygiene

### 5.1 `docs/` — 115 files, 5.80 MB — **not served, zero runtime impact**
99 `.puml` (3 activity + 47 UC activity + 47 SSD + 2 combined), 4 generator `.js` (215 KB), 4 `.md`
(61 KB), 2 `.docx`, 2 `.html` (244 KB), 1 `.svg`, 1 `.png`, and **2 PDFs totalling 5.01 MB**
(`K-Sync_Malaysia_Diagrams_Specification.pdf` 4.39 MB, `K-Sync_Malaysia_Database_Specification_ERD.pdf` 0.62 MB).

**Verified:** `server.js` mounts `express.static` only on `public/`, `public/uploads` and `uploads`.
`docs/` is **not reachable over HTTP**, so none of this affects page performance. It does affect
clone size, CI checkout time and repo weight. The PDFs and `.docx` are build outputs of the 4
generator scripts and could be released as artifacts rather than committed.

### 5.2 Hosting / Cloudflare — `REMOVED/cloudflare/`
`wrangler.toml` (257 B) and `.wranglerignore` (90 B) — a Cloudflare Workers config (`main = "server.js"`,
`compatibility_date = 2026-10-01`) for an app that uses Express, `node:fs`, in-memory sessions and
native `better-sqlite3`, none of which run on Workers. Retired; keep only if you plan a Workers port.

### 5.3 CI — `.github/workflows/main_ksync.yml` (65 lines)

Trigger `push` to `main` + `workflow_dispatch`; job `build` runs `actions/checkout@v4` →
`actions/setup-node@v3` (**node 22.x**) → `npm install` → `npm run build --if-present` →
`npm run test --if-present` → `actions/upload-artifact@v4` with **`path: .`**; job `deploy` downloads
the artifact, `azure/login@v2` (OIDC) and `azure/webapps-deploy@v3`.

| # | Problem | Line |
|---|---|---|
| 1 | **No `cache: npm`, no `actions/cache`** → full dependency re-download every run | `:21-24` |
| 2 | **Builds nothing** — `package.json:7-10` defines only `start`/`dev`, so both `--if-present` steps are no-ops. No lint, test, migration or performance gate — none of §2 is caught automatically | `:29-30` |
| 3 | **Uploads the entire workspace as the artifact** (`path: .`) — ~239 MB / 12 726 files of `node_modules` plus 5.8 MB `docs` and the 184 KB backup DB, round-tripped between two runners | `:36` |
| 4 | **`npm install` instead of `npm ci`** — non-deterministic, ignores the strict lockfile install | `:27` |
| 5 | `actions/setup-node@v3` is outdated (v4 current) | `:21` |
| 6 | **Target drift** — CI deploys to **Azure**, other artifacts reference Hostinger/Cloudflare; with no `DB_*` env vars it would deploy the **committed SQLite file** | `:58-64` |

Estimated runtime **2–5 minutes**, dominated by the uncached `npm install` (incl. the native
`better-sqlite3` build) and the 239 MB artifact round-trip — repeated on every push.

### 5.4 Dependencies — `node_modules` = **233.7 MB**

| Package | Install size | Used by |
|---|---|---|
| `better-sqlite3` | 26.04 MB | `config/database.js` (native bindings + prebuilds) |
| **`docx`** | **19.11 MB** | **only `docs/generate_srs_doc.js:18`, `docs/generate_word_doc.js:18`** — *not the app* |
| `nodemailer` | 1.60 MB | `src/utils/mailer.js` |
| `mysql2` | 0.60 MB | `config/database.js:7` (static import — loaded even though SQLite is used) |
| `jose` | 0.53 MB | `src/utils/google-auth.js` |
| `mssql` | 0.30 MB | `config/database.js` (lazy) |
| `multer` | 0.29 MB | `src/middleware/upload.js` |
| `ejs` / `express-session` / `express` / `bcryptjs` / `cors` / `dotenv` | < 0.25 MB each | app |

**`docx` is a 19.11 MB production dependency used only by documentation generators.** It belongs in
`devDependencies` (or out of the repo entirely) — an easy 8% cut of `node_modules`.

### 5.5 Root files
- `.gitignore` correctly ignores `node_modules/`, `.env*`, `*.log`, `database/*.db-wal`, `database/*.db-shm`, `public/uploads/`, `uploads/` — **good**.
- **`docs/`, `REMOVED/`, `perf/` are NOT ignored** → all would be committed (1.4 MB of retired code + 5.8 MB of docs + the harness). Note `.gitignore:5` ignores a directory named `scratch/` anywhere, so `REMOVED/scripts_and_scratch/scratch/` happens to be ignored while the rest of `REMOVED/` is not — accidental, not intentional.
- **`database/ksync.db` IS tracked in git** (confirmed: `git ls-files database` → `database/ksync.db`), pulled back in by the `!database/ksync.db` rule at `.gitignore:15`. A live database with user password hashes in version control — a security issue flagged in the earlier audit, and ~209 KB that churns on every data change. The `-wal` is ignored but the `.db` is not, so **the committed DB is WAL-stale** relative to the live one.
- **No `NODE_ENV`** in `.env` or `.env.example` → `server.js:61` never enforces `SESSION_SECRET`, and Express runs in dev mode.
- **No `DB_*` keys at all** → `config/database.js:19-20` resolves to the **SQLite** backend (this is definitively why the app runs on `database/ksync.db`).
- **No cache settings anywhere** (no `CACHE_*`, no CDN/HTTP-cache keys), and `.env.example` does not document the `SMTP_*`/`DB_*` keys `.env` actually uses.
- `.env` holds a blank `SESSION_SECRET`, `FIREBASE_PROJECT_ID` and a plaintext `SMTP_PASS`. It is correctly git-ignored (`.gitignore:2`).

---

## 6. Verified defects (empirically tested, not inferred)

I ran the app's exact SQL against a **copy** of the live database (`perf/db-test-inserts.mjs`).

### 6.1 🔴 Every notification write fails — twice
```
foreign_keys pragma = 1

[1] helpers.createNotification PRIMARY insert (helpers.js:249)
    FAIL  -> no such table: main.event_updates
[2] helpers.createNotification FALLBACK insert (helpers.js:256)
    FAIL  -> table notifications has no column named title
[3] helpers.logActivity insert (helpers.js:145)          PASS
[4] auth middleware user query (auth.js:21)              PASS  (22 columns)
```

`notifications.update_id` has `FOREIGN KEY (update_id) REFERENCES event_updates(id)` — and
**`event_updates` does not exist**. Because SQLite validates the parent table even for a NULL child
value, the primary insert always raises `no such table`. The fallback then fails because
`notifications` has no `title` column. Net effect:

- **The notification feature is completely non-functional** (`notifications` has 0 rows) — a correctness bug.
- Worse for performance: every notification attempt costs **two failed writes**, and it happens
  *inside loops* in `notifyEventFollowers` (`helpers.js:271-274`) and `notifyAdmins` (`285-288`),
  so one save by 1 000 fans = **2 000 failed writes**.

### 6.2 🟢 Correcting an earlier inference
`helpers.logActivity` (`helpers.js:145-148`) was flagged as a guaranteed-failing insert. **It passes
against the live SQLite schema** (test [3]). It would only fail on a MySQL deployment built from
`hostinger_mysql_schema.sql`, which still declares `target_type`/`target_id`/`details`. Reported
accurately now.

### 6.3 🟠 Duplicate favicon — byte-identical files
```
449E4ACB27F6  public\favicon-32x32.png
449E4ACB27F6  public\favicon.png      <-- identical MD5
```
`views/partials/header.ejs:9` and `:10` reference both, plus `:12` loads `favicon.ico` — **one wasted
request per page**, on top of `max-age=0` revalidation.

### 6.4 ⚪ Correcting the WAL suspicion
The 531 KB `ksync.db-wal` next to the 208 KB DB looked like un-checkpointed write churn. **It is not a
defect:** `-wal`/`-shm` are gitignored (`.gitignore:13-14`) and 531 KB is under SQLite's default
`wal_autocheckpoint` threshold (1000 pages ≈ 4 MB). The real (minor) storage note is
`freelist_count = 22`/51 pages — **43% of the DB file is free pages** with `auto_vacuum = 0`.

### 6.5 🔴 The live schema rejects the app's own registration INSERT

**First, this is confirmed to be the system database.** `config/database.js:13` resolves to
`SQLITE_DB_PATH || ../database/ksync.db`; MySQL/MSSQL only activate when `DB_HOST`/`DB_SERVER` are set
(`:19-20`); and `.env` contains **no `DB_*` keys at all**. So the app runs on this exact
`database/ksync.db` file.

**Tested through the app's OWN connector** (`perf/verify-register-e2e.mjs` — sets
`SQLITE_DB_PATH` to a copy, imports `config/database.js`, runs the real statements; cleaned up
afterwards):

| # | Statement | Result |
|---|---|---|
| 1 | Registration, exactly as `auth.js:275` writes it | ❌ `[SQLITE_CONSTRAINT_NOTNULL] NOT NULL constraint failed: users.role_id` |
| 2 | Registration **with `role_id` added** | ✅ `insertId 6` |
| 3 | Notification, exactly as `helpers.js:249` writes it | ❌ `[SQLITE_ERROR] no such table: main.event_updates` |
| 4 | Notification **after removing the bad FK** | ✅ `insertId 1` |

From the real file:

```
users.role_id   INTEGER   notnull=1   default=null    -- no default, the app never supplies it
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
notifications   FOREIGN KEY (update_id) REFERENCES event_updates(id)   -- table does not exist
```

`users` is declared with **both** `role_id INTEGER NOT NULL` (no default) **and** `role TEXT DEFAULT
'FAN'`, but the app writes **only** `role` (`auth.js:275` on register, `:536` on Google signup). On
the live SQLite file that is a **`NOT NULL` violation — account creation cannot succeed.** The 5
existing users all have `role_id` populated (1 = ADMIN, 2 = ORGANIZER, 3 = FAN) because they were
**seeded by scripts**, which is why the table looks healthy while the app's own insert path cannot add
a 6th. `config/database.js:47` also sets `foreign_keys = ON` explicitly, so the dangling FK is
enforced rather than ignored.

**Taken together with §6.1: the app cannot write a `user` and cannot write a `notification`.** Both
are schema defects in `database/ksync.db`, not application bugs. **Rows 2 and 4 above are the two
fixes, already proven to work** — but as of this report they have **not** been applied to the live
file (left untouched at your request).

---

## 7. Cross-cutting priority list

Ordered by impact ÷ effort, across the **whole folder**.

| # | Fix | Where | Effort | Impact |
|---|---|---|---|---|
| 1 | **Make the schema accept the app's writes** — `users.role_id` `NOT NULL` w/o default, the dangling `notifications.update_id → event_updates` FK, and the `title`/`link` fallback | `database/ksync.db` + a migration | XS | 🔥 **registration and notifications currently cannot work at all** (§6.1, §6.5) |
| 2 | **Replace the Tailwind Play CDN with a prebuilt stylesheet** | build + `header.ejs:15-45` | S | **−124 KB, −~1.4 s TBT** |
| 3 | **Add indexes** to SQLite *and* the shipped MySQL schema (§4.1 list) | migration + `hostinger_mysql_schema.sql` | S | turns every hot scan into a seek |
| 4 | **Drop `LOWER()`/`UPPER()` from indexed columns** — use a case-insensitive collation or normalise on write | `auth.js:68,178,356`, `submissions.js:218`, `admin.js:65` | S | makes login/tracking lookups use indexes at all |
| 5 | **Delete Font Awesome**, inline the ~40 icons as SVG | `header.ejs:50` + views | S | **−297 KB/page** |
| 6 | **Add `compression()`** + `maxAge` on static | `server.js:54-57,79-81` | XS | −35 KB HTML, kills revalidation |
| 7 | **Fix images** — dimensions, `loading=lazy`, `fetchpriority`, de-duplicate URLs | views, `event-details.ejs:23` | M | **−250–400 KB** |
| 8 | **Self-host 1–2 font files**, preload, drop unused `Inter` weights | `header.ejs:47-49` | S | removes blocking CSS + FOUT on the LCP element |
| 9 | **Reconcile the MySQL schema with the app** — add `reports.evidence_url/admin_action/…`, `event_chat_messages.is_organizer`, rename `activity_logs.target_*` → `entity_*`, fix the `roles` dangling drop | `hostinger_mysql_schema.sql` (+ generator) | M | makes a MySQL deploy functional at all |
| 10 | **Kill `location.reload()`** after save/chat | `event-details.ejs:574,593,715` | S | no 75 KB re-download per click |
| 11 | **Paginate** admin lists + `events.ejs`; `LIMIT` `api.js:120` | routes + views | M | bounds DOM and SQL |
| 12 | **Batch the N+1 writes**; move reminders to a scheduled job | `helpers.js:271-288,313-347` | M | O(n) → O(1) round-trips |
| 13 | **`SELECT` explicit columns instead of `*`** over `LONGTEXT` | `submissions.js:15`, `events.js:67/101`, `admin.js:23/363` | S | stops shipping JSON blobs for dropdowns |
| 14 | **Cache prepared statements; add `busy_timeout`** | `config/database.js:104,132,177` | S | removes per-call SQL compilation |
| 15 | **Trim the per-request user query**; stop dirtying the session | `middleware/auth.js:17,21-36` | S | −2 queries/request |
| 16 | **`bcryptjs` → native `bcrypt`** (or worker threads) | `auth.js` | S | removes 50–150 ms event-loop stalls |
| 17 | **Fix CI** — `npm ci`, `cache: npm`, narrow the artifact `path`, `setup-node@v4` | `main_ksync.yml:21-36` | XS | minutes off every push, ~239 MB less transfer |
| 18 | **Move `docx` to devDependencies** | `package.json:15` | XS | −19.11 MB of deps |
| 19 | **Untrack `database/ksync.db`**; delete or gitignore `REMOVED/`, `perf/` | `.gitignore` | XS | secrets out of git, −1.5 MB repo |
| 20 | **Delete `REMOVED/scripts_and_scratch/`** and `php_backup/` | — | XS | −0.86 MB dead code + credential/live-effect scripts |
| — | *Do NOT act on:* the retired PHP app (§3) and `docs/` (§5.1) — neither affects the running system | — | — | — |

### Estimated result after the front-end items (#2, #5–#8), home page

| Metric | Now | After (est.) |
|---|---|---|
| Transferred | 870.7 KB | **~180–220 KB** |
| FCP | 3 848 ms | **~1.0–1.3 s** |
| LCP | 4 552 ms | **~1.3–1.8 s** |
| TBT | 1 571 ms | **~150–250 ms** |

Estimates derived from the measured byte breakdown, not re-measured.

---

## 8. Method & limitations

- **Measured live:** Node app served on `localhost:8000` with its real SQLite DB; CDP harness with cold cache, Slow 4G (1.6 Mbps/150 ms RTT), 4× CPU. Byte sizes for cross-origin hosts read from the CDP `Network` domain (Resource Timing reports 0 for them without `Timing-Allow-Origin`).
- **Read line by line:** all 43 app files, all 60 PHP files (+39 in `php_backup` for diffing), all 6 schema files, 24 scratch + 4 DB scripts, the CI workflow, hosting config and dependency manifests.
- **Tested, not assumed:** the app's exact INSERT/SELECT statements against a copy of the live DB (§6); SQLite pragmas; the backup DB (24 tables, 10 autoindexes, **0 user indexes**); literal `CREATE INDEX`/`KEY` token counts in every schema; all favicon hashes; git tracking and ignore rules; dependency import sites.
- **Not measurable here:** no Lighthouse/DevTools MCP was available (no score, no INP); no field/CrUX data; the PHP app could not be executed (its `config/` directory is missing) so its figures are **static analysis, not measurements**; production CDN/HTTP-2/Brotli behaviour is not represented; DB behaviour at scale is structural — the live DB holds only 3 events and 5 users.

*No application file was modified. The only artifact added is `perf/` (harness + `AUDIT.md` + this report). The earlier `design/` folder was deleted at your request; the transient DB inspectors and the WAL/SHM pair they left beside the backup DB were cleaned up afterwards.*
