# K-Sync Malaysia — Web Performance Audit

**Target:** the original Express + EJS application (`server.js`, `src/**`, `views/**`)
**Date:** 18 Oct 2026 · **Chrome:** 155.0.8059.80 · **Node:** v22.16.0
**Method:** live measurement of the running app + line-by-line source analysis.

---

## 0. Method, conditions and caveats

**What I measured.** I started the app locally (`node server.js`, SQLite backend) and drove
headless Chrome over the DevTools Protocol with Lighthouse-like conditions:

| Condition | Value |
|---|---|
| Cache | **disabled** (cold load, every navigation) |
| Network | **Slow 4G** — 1.6 Mbps down / 750 kbps up / 150 ms RTT |
| CPU | **4× throttling** |
| Pages | `/`, `/events`, `/submit-event`, `/login` |

Byte sizes for **cross-origin** resources were read from the CDP `Network` domain
(`Network.loadingFinished.encodedDataLength`), because the Resource Timing API reports
`transferSize: 0` for third-party hosts (no `Timing-Allow-Origin`).

**What I could NOT measure — be aware:**

- **No Chrome DevTools MCP / Lighthouse was available** in this environment (`list_mcp_resources` returned nothing), so there is no Lighthouse score, no INP, and no trace-based insight set. Everything below is from my own CDP harness + source reading.
- **INP / interactivity under load** was not measured (needs a scripted interaction trace).
- **Real-user field data (CrUX)** is unavailable for a local app.
- **Production CDN behaviour** (Cloudflare, HTTP/2-3, Brotli at the edge, `trust proxy`) is not represented — I measured plain `http/1.1` against `localhost`. Production will differ, mostly for the better on transport but identically on the issues below.
- **Database behaviour at volume** — the live DB has only 3 events, 5 users, 120 log rows. The query/index findings are therefore *structural* (proven from code + schema), not demonstrated with big data.

Reproduce:

```bash
npm start                 # terminal 1
node perf/audit.mjs       # terminal 2  -> perf/raw.json
node perf/summarize.mjs   # readable breakdown
node perf/db-indexes.mjs  # index inventory
```

---

## 1. Executive summary

> **The backend is fast. The front end is the problem.**
> TTFB is **14–20 ms** — the server renders the whole page almost instantly. But the user
> cannot *see* anything for **3.7–4.0 s**, and the largest element paints at **4.1–5.0 s**,
> because three third-party resources block rendering and ~300 KB of icon fonts plus
> ~400 KB of hotlinked photos are pulled on every single page.

The four things that dominate, in order of leverage:

| # | Problem | Where | Measured cost |
|---|---|---|---|
| 1 | **Tailwind Play CDN** loaded as a synchronous, render-blocking `<script>` — it is a *compiler* that generates the CSS in the browser at runtime | `views/partials/header.ejs:15` | 124 KB JS + **~1.4 s of main-thread compile** per page |
| 2 | **Full Font Awesome bundle** from cdnjs for ~40 icons | `views/partials/header.ejs:50` | **297 KB per page** (19 KB CSS + 278 KB woff2) |
| 3 | **Hotlinked, duplicated, un-sized Unsplash images** | `index.ejs:129,243`, `events.ejs:108`, `saved-events.ejs:40`, `event-details.ejs:25,188,265`, `admin/artists.ejs:81` | 373 KB on `/`, **508 KB on `/events`** |
| 4 | **No compression + `max-age=0` static caching** | `server.js:54-57, 79-81` | HTML ships **44.9 KB uncompressed**; every asset revalidates |

Secondary but real: `location.reload()` after every save/chat (`event-details.ejs:574,593,715`),
**zero database indexes** on 11 tables, N+1 notification writes (`helpers.js:271-288,313-347`),
2 queries on every request for logged-in users (`middleware/auth.js:21-36`), synchronous
`bcryptjs` on the event loop (`auth.js:189,444,639`), and **no pagination anywhere**.

---

## 2. Core Web Vitals (measured, cold cache, Slow 4G, 4× CPU)

| Page | TTFB | FCP | **LCP** | CLS | **TBT** | Requests | Transferred |
|---|---|---|---|---|---|---|---|
| `/` | 15 ms | 3 848 ms | **4 552 ms** 🔴 | 0.019 🟢 | **1 571 ms** 🔴 | 15 | 870.7 KB |
| `/events` | 20 ms | 3 688 ms | **4 084 ms** 🔴 | 0.002 🟢 | **1 603 ms** 🔴 | 18 | 994.3 KB |
| `/submit-event` | 15 ms | 3 952 ms | **5 012 ms** 🔴 | 0.000 🟢 | **3 454 ms** 🔴 | 9 | 465.9 KB |
| `/login` | 14 ms | 3 744 ms | **4 372 ms** 🔴 | 0.047 🟢 | **2 790 ms** 🔴 | 10 | 501.3 KB |

Ratings per Google thresholds: LCP good < 2.5 s, poor > 4 s · TBT good < 200 ms, poor > 600 ms · CLS good < 0.1.

**Reading of this table**

- **TTFB 14–20 ms** — the Express/SQLite render path is excellent. *Do not optimise the server first.*
- **FCP ≈ LCP ≈ 3.7–5.0 s** — first paint is gated by the render-blocking `<head>` (Tailwind + 2 CSS files). The LCP element is literally the `<h1>` (`H1.text-4xl` on `/`, `H1.text-3xl` on `/events`, `P.text-xs` on `/submit-event`, `H1.text-2xl` on `/login`), i.e. **text that cannot paint until ~500 KB of CSS/JS arrives**.
- **TBT 1.6–3.5 s** — that is the browser *compiling Tailwind CSS at runtime* on the main thread. `/submit-event` is worst (3 454 ms / 9 long tasks) because a big form produces a large class set to generate.
- **CLS is already good** on 3 of 4 pages. `/login` at 0.047 comes from `DIV.max-w-md` (the Firebase auth widget swapping in) — not alarming, but see §3.6.

---

## 3. Where the bytes go

### Third-party exposure (all pages, measured)

| Origin | Requests | Bytes | Loaded on |
|---|---|---|---|
| `cdnjs.cloudflare.com` (Font Awesome) | 14 | **1 139.3 KB** | **every page** |
| `images.unsplash.com` | 17 | **881.2 KB** | most pages |
| `cdn.tailwindcss.com` | 4 | **495.3 KB** | **every page** |
| `fonts.gstatic.com` | 4 | 126.3 KB | every page |
| `www.gstatic.com` (Firebase) | 3 | 48.4 KB | `/login`, `/register` |
| `fonts.googleapis.com` | 4 | 3.7 KB | every page |
| **your own server** | 4 | 138.1 KB | — |

Your server serves **138 KB across 4 pages**; **third parties serve 2 694 KB**. The app has a
dependency-to-first-party-payload ratio of roughly **19 : 1**.

### Per-page, largest resources (home page)

| Bytes | Type | Encoding | URL |
|---|---|---|---|
| 147.3 KB | Font | none | `cdnjs…/webfonts/fa-solid-900.woff2` |
| 123.8 KB | Script | br | `cdn.tailwindcss.com/3.4.17` |
| 106.8 KB | Image | none | `images.unsplash.com/photo-1514525253161…?w=600` |
| 106.3 KB | Image | none | `images.unsplash.com/photo-1514525253161…?w=600&auto=format&fit=crop` |
| 106.1 KB | Font | none | `cdnjs…/webfonts/fa-brands-400.woff2` |
| 52.2 KB | Image | none | `images.unsplash.com/photo-1501386761578…?w=800` |
| **44.3 KB** | **Document** | **none** | `localhost:8000/` ← **your HTML, uncompressed** |
| 41.5 KB | Image | none | `images.unsplash.com/photo-1501386761578…?w=600` |
| 31.6 KB | Font | none | `fonts.gstatic.com/…outfit…woff2` |
| 25.0 KB | Font | none | `cdnjs…/webfonts/fa-regular-400.woff` |
| 18.9 KB | Stylesheet | br | `cdnjs…/font-awesome/6.4.0/css/all.min.css` |

Note the two `photo-1514525253161` rows: **the same photograph is downloaded twice on one
page load** because two URLs differ only by `&auto=format&fit=crop` — 213 KB for one image.
The same happens to `photo-1501386761578` (52.2 KB + 41.5 KB). **~148 KB of the home page is
duplicate image weight.**

---

## 4. Findings — line by line

### 🔴 4.1 `views/partials/header.ejs` — included by *every* page, and it is the bottleneck

```ejs
14:    <!-- Tailwind CSS CDN -->
15:    <script src="https://cdn.tailwindcss.com"></script>   ← render-blocking, no defer/async
16:    <script>
17:        tailwind.config = { … }
45:    </script>
47:    <link rel="preconnect" href="https://fonts.googleapis.com">
48:    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
49:    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;…;900&display=swap" rel="stylesheet">
50:    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
51:    <style>
52:        body { font-family: 'Outfit', 'Inter', sans-serif; … }
58:        .glass-nav { … backdrop-filter: blur(12px); … }
63:        .glass-card { … }          ← never used anywhere (dead CSS)
67:    </style>
```

**Confirmed render-blocking (measured — 3 blockers on all 4 pages):**
```
cdn.tailwindcss.com/                                     script
fonts.googleapis.com/css2                                 link
cdnjs.cloudflare.com/…/font-awesome/6.4.0/css/all.min.css link
```

**(a) Tailwind Play CDN — line 15.** This is the single worst issue in the app.
`cdn.tailwindcss.com` is Tailwind's *development playground* build: it ships ~124 KB of JS
that **scans your DOM and generates the stylesheet in the browser**, then keeps a
`MutationObserver` alive. Consequences:
- **+1.4 s of main-thread work per page** (measured TBT 1 571 ms on `/`; the only scripts on that page are Tailwind and the tiny inline handlers).
- It is **render-blocking** — it sits in `<head>` with no `defer`.
- Every class toggle in the app (`toggleSaveEvent`, modal open/close, dropdowns) is a DOM mutation that **re-triggers the compiler**.
- Cache headers are short-lived (`max-age=31536000` on the versioned file, but the CDN contract is "not for production").

**(b) Font Awesome — line 50.** Measured **297.3 KB per page load** for what is ~42 `<i class="fa…">` icons on the home page. Breakdown: `all.min.css` 18.9 KB + `fa-solid-900.woff2` 147.3 KB + `fa-brands-400.woff2` 106.1 KB + `fa-regular-400.woff` 25.0 KB. `fa-brands` is 106 KB and is used for a handful of social links.

**(c) Google Fonts — line 49.** Requests **11 weights** across 2 families (`Inter` 300/400/500/600/700 + `Outfit` 400/500/600/700/800/900). Measured: 1 woff2 actually downloaded (31.6 KB), because only `Outfit` is ever applied — `body { font-family: 'Outfit', 'Inter', sans-serif }` (line 53) means **`Inter` is a fallback only, so most of its 5 weights are requested-but-unused**. The stylesheet is render-blocking and there is **no `rel="preload"`** for the woff2 → the `<h1>` renders in `sans-serif` then reflows to Outfit (FOUT on the LCP element itself).

**(d) `backdrop-filter: blur(12px)` on a sticky bar — line 58-62.** `.glass-nav` is applied to the always-visible sticky navbar (`navbar.ejs:9`), so the compositor must re-blur everything scrolling beneath it every frame. Fixable and cost-free on low-end Android.

**(e) Five favicon `<link>`s — lines 8-12.** `favicon.png` (line 10) has no `sizes`, so browsers fetch more than one icon; combined with `max-age=0` (§4.4) these revalidate constantly.

---

### 🔴 4.2 `server.js` — no compression, no caching, per-request session churn

**No compression (measured).** `compression` is not in `package.json` and there is no
`app.use(compression())`. A request with `Accept-Encoding: gzip, br` returns:

```
content-encoding = ''        ← nothing compressed
Content-Length: 44981        ← home page HTML, uncompressed
```

Every EJS page ships raw. `event-details.ejs` renders **75 KB of HTML**, a large share of it
repeated Tailwind class strings. Gzip/Brotli would take ~45 KB → **~9 KB** and 75 KB → ~14 KB.

**Static caching (measured).** `express.static` is mounted with no options:

```js
79: app.use(express.static(publicDir));
80: app.use('/uploads', express.static(uploadDir));
81: app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```
```
GET /favicon.svg  →  Cache-Control: public, max-age=0   ← revalidate on every navigation
```
Every CSS/JS/image/favicon revalidates on every page load. Also `/uploads` is mounted
**twice** (lines 80-81), so a miss on the first mount costs a second filesystem `stat`.

**`cors()` on everything — line 55.** Measured: `Access-Control-Allow-Origin: *` on the HTML
document and on every static asset. This app has no cross-origin API consumer that needs it
on HTML; it is pure per-request overhead (and a security smell).

**Session — lines 64-76.** No `store` is configured, so `express-session` uses the in-memory
`MemoryStore` (unbounded growth, single-process). Compounding it:

```js
src/middleware/auth.js:17:  req.session.flash = {};
```
This runs on **every request**, marking the session dirty so the store is re-written on every
request even when nothing changed.

---

### 🔴 4.3 Third-party, duplicated, un-sized images

Verified against the rendered HTML:

```
IMG tags on home: 8
loading="lazy" : 0
width=         : 0
height=        : 0
fetchpriority  : 0
unsplash srcs  : 16   ← 8 <img> + 8 onerror fallbacks
```

**Every image in the app lacks `width`/`height`/`aspect-ratio`, `loading`, `decoding` and
`fetchpriority` — there are zero occurrences in `views/`.** Consequences:

- **Duplicates (measured).** `photo-1514525253161` is fetched twice on the home page (106.8 KB + 106.3 KB) — two URLs differing only in `&auto=format&fit=crop`. Same for `photo-1501386761578` (52.2 + 41.5 KB). **≈148 KB wasted on one page.**
- **Oversized.** `?w=600` still returns ~106 KB for these photos; nothing is served in AVIF/WebP-optimised form because Unsplash's `auto=format` depends on the `Accept` header and no `q=` is set.
- **Hotlinked to a third party.** If Unsplash is slow/down/blocked, cards break — and there is a second request behind each `onerror`.
- **No lazy loading.** On `/events`, 10 Unsplash images / **508 KB** load immediately, most of them below the fold.
- **`event-details.ejs:23-25`** is the real LCP image (the hero backdrop) and has **no `fetchpriority="high"`**, no dimensions, and a `blur-xs` class that **does nothing** under the v3 Play CDN — so a multi-MB user poster paints sharp, full-bleed.
- **`event-details.ejs:205-207`** — the single-poster container has no reserved height, so the page below it shifts when the image arrives (**genuine CLS**, unlike the card grids which have fixed heights).
- **`event-details.ejs:1150`** — `<img id="lightbox-img" src="">` — an empty `src` can resolve to the current document URL and issue a spurious self-request.

The images come from `onerror` fallbacks because seeded events have no uploaded poster, so
**every card pays a failed request + an Unsplash request**.

---

### 🟠 4.4 `views/event-details.ejs` — the heaviest page (75 KB source)

- **`location.reload()` after every interaction** — `:574` (save), `:593` (interest), `:715` (chat send). Sending one chat message re-downloads the entire 75 KB page, re-parses it, and **re-runs the Tailwind compiler**. This is the worst possible pattern with the Play CDN.
- **333-line inline script at `:561-893`** on top of a 1 161-line document. No external, cacheable JS file exists anywhere in the project.
- **Google Maps `<iframe>` at `:447-448`** pulls `maps.google.com` + `maps.gstatic.com` + tile hosts — several cold DNS/TLS handshakes. `loading="lazy"` **is** present and the wrapper is fixed-height (good), but the map sits in the desktop viewport so it loads anyway. A static map image or click-to-load would remove an entire origin from the critical path.
- **Uncleared 1-second timer at `:867`** — `setInterval(updateCountdown, 1000)` never calls `clearInterval`; it keeps doing DOM writes (and waking the Tailwind observer) for the life of the tab.
- **Five always-present hidden modals at `:896-1153`** add DOM and classes to every render.

---

### 🟠 4.5 No pagination anywhere + unbounded SQL

Every list renders with `forEach` and filtering is **client-side only**, so all rows must be in
the DOM. Nothing limits the query either:

| View | Loop | Backing query |
|---|---|---|
| `admin/logs.ejs:92-134` | all rows | `admin.js:558-584` (this one *does* `LIMIT 150` ✓) |
| `admin/verifications.ejs:126-203` + `:247-284` | 2 tables | `admin.js:55-68` (unbounded) |
| `admin/reports.ejs:117-209` | all rows | `admin.js:398-406` (unbounded 3-table join, `ORDER BY CASE…`) |
| `admin/users.ejs:49-102` | all rows | `admin.js:496-500` `SELECT u.*` |
| `admin/events.ejs:55-105` | all rows, **one `<form>`+`<select>` per row** | `admin.js:253-259` `SELECT e.*` |
| `events.ejs:98-170` | all rows, each with an image | `events.js:66-100` (no `LIMIT`) |
| `api.js:120-126` | `GET /api/chat/:eventId` | **returns every chat message ever** |

`SELECT e.*` / `SELECT u.*` also drag the `LONGTEXT` columns (`events.gallery_images`,
`artists.members`, `events.description`) into memory and into the template on every request —
including three places that only need names:

```js
events.js:101        SELECT * FROM artists ORDER BY name ASC      ← only needs id,name
admin.js:363         SELECT * FROM artists
submissions.js:15    SELECT * FROM artists
```

`artists.members` holds full member JSON; the artist filter dropdown needs none of it.

**`events.js:171-175`** — a slug-miss does `SELECT id, event_name FROM events` (whole table)
then slugifies every row in JS. Same at `events.js:278`. Crawlers and stale links hit this.

---

### 🔴 4.6 Database — zero indexes on 11 tables (measured)

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

Custom CREATE INDEX statements found: 0
```

`hostinger_mysql_schema.sql` likewise declares only PKs and UNIQUE constraints. Every `WHERE`,
`JOIN` and `ORDER BY` on a non-key column is a full table scan. The hot ones:

`events.verification_status`, `events.event_date/start_time/created_at`,
`events.organizer_id/artist_id/category_id`, `event_chat_messages.event_id/created_at`,
`notifications.user_id/is_read/created_at`, `saved_events.event_id`,
`reports.status/user_id/event_id`, `activity_logs.created_at/action`,
`users.role`.

`activity_logs` already has 120 rows and grows on every login/submit/approve/reject, and
`admin.js:584` runs `SELECT DISTINCT action FROM activity_logs` — a full scan through the
fastest-growing table. **Adding indexes is a zero-application-code change and the highest
server-side ROI available.**

---

### 🟠 4.7 Per-request work: N+1 writes and redundant queries (verified in source)

**2 queries on every request for any logged-in user** — `src/middleware/auth.js:21-36`:

```js
21: const user = await db.getOne(`SELECT u.*, COALESCE(u.role,'FAN') as role, … FROM users u WHERE u.id = ?`, …);
32: const unread = await db.getOne("SELECT count(id) as count FROM notifications WHERE user_id = ? AND is_read = 0", …);
```
`SELECT u.*` pulls `password_hash`/`bio` on every render, and the unread `count` is a scan
(no index). Both run before *any* route logic.

**N+1 notification writes** — `src/utils/helpers.js`:

```js
271: const followers = await db.query("SELECT user_id FROM saved_events WHERE event_id = ?", [eventId]);
272: for (const f of followers) { await createNotification(f.user_id, …); }        // 1 insert per follower

285: const admins = await db.query("SELECT id FROM users WHERE UPPER(role) = 'ADMIN' OR role_id = 1");
286: for (const admin of admins) { await createNotification(admin.id, …); }          // 1 insert per admin

313: for (const ev of saved) {
338:   const existing = await db.getOne("SELECT id FROM notifications WHERE user_id = ? AND event_id = ? AND message LIKE ? AND created_at LIKE ?", …);
344:   if (!existing) await createNotification(…);                                     // 1 select (+ insert) per saved event
```

`generateEventRemindersForUser` runs on **every** `GET /notifications` (`notifications.js:16`) —
a user with 50 saved events pays 50 sequential SELECTs each time they open the page.

**Guaranteed double-write** — `helpers.js:244-262`: `createNotification` tries one INSERT shape,
and on failure (schema mismatch) retries a different shape. Against the shipped schema the
**first insert always throws**, so every notification costs a failed write + a real write.
`created_at LIKE '<date>%'` and `message LIKE '%D-7%'` are also unindexable.

**Serial awaits.** Home (`events.js:11,21,29,41`) and `/events` (`events.js:100-108`) issue
4–5 queries strictly one after another with no `Promise.all`; the admin dashboard runs 6
serially (`admin.js:16-35`), including 4 separate `COUNT(*)` scans.

**Schema introspection on the write path** — `submissions.js:131-143` runs
`PRAGMA table_info(events)` / `SHOW COLUMNS FROM events` on **every submit** to discover
columns that never change; this belongs at startup.

---

### 🟠 4.8 `bcryptjs` blocks the event loop

```js
auth.js:84   isMatch = await bcrypt.compare(password, hash);
auth.js:189  const passwordHash = await bcrypt.hash(password, salt);
auth.js:444  const passwordHash = await bcrypt.hash(newPassword, 10);
auth.js:639  const passwordHash = await bcrypt.hash(newPassword, salt);
auth.js:116  const freshHash = await bcrypt.hash(p, 10);   // + UPDATE on the login path
```

`bcryptjs` is pure JavaScript: `await` does **not** move it off the main thread. At cost
factor 10 each hash/compare blocks the event loop for roughly **50–150 ms**, stalling *every*
other in-flight request. Native `bcrypt` or a `worker_threads` pool fixes it. The `auth.js:116`
"auto-heal" adds a **second** blocking hash plus a write inside login.

---

### 🟡 4.9 Smaller issues

| Issue | Location | Note |
|---|---|---|
| `SELECT * FROM users` for credential checks | `auth.js:68,356` | drags `bio`/`profile_image` |
| OTP/reset `Map`s never evicted on expiry | `auth.js:13-17` | slow memory growth |
| Duplicated inline JS (`toggleSaveEvent` ×3, `togglePasswordVisibility` ×3, per-table filters ×5) | `index/events/event-details/login/register/reset-password/admin/*` | no cacheable JS file exists |
| Duplicated card markup inflated ×3 | `index.ejs:124-190`, `events.ejs:103-169`, `saved-events.ejs:36-71` | bloats HTML + Tailwind's class set |
| Dead CSS `.glass-card` | `header.ejs:63-66` | never applied |
| Duplicate `font-family` declaration | `header.ejs:36` and `:53` | config vs `<style>` |
| `nodemailer.createTestAccount()` on first request if SMTP env missing | `mailer.js:39` | an external HTTP call on the request path (first send only; sends are correctly fire-and-forget) |
| MSSQL pool lazy-init has no in-flight guard | `config/database.js:55` | could create >1 pool; inactive for SQLite |
| 404 handler renders only `partials/header` | `server.js:96-98` | renders a partial with no layout |
| `POST /api/events/:id/interest` writes nothing | `api.js:33-42` | returns success without a DB write |

---

## 5. Prioritised fix plan

Ordered by impact ÷ effort. Estimated savings are for the home page
(870.7 KB / LCP 4 552 ms / TBT 1 571 ms today).

| # | Fix | Change | Est. saving |
|---|---|---|---|
| 1 | **Replace the Tailwind Play CDN with a prebuilt stylesheet.** Add a build step (Tailwind CLI or PostCSS) producing one hashed `app.css`, serve it from `express.static`, drop `header.ejs:15-45`. | build + `header.ejs` | **−124 KB, −~1.4 s TBT**, unblocks FCP |
| 2 | **Delete Font Awesome.** Replace the ~40 `<i class="fa…">` with inline SVG (or a small sprite). Remove `header.ejs:50`. | `header.ejs` + views | **−297 KB per page** |
| 3 | **Add `compression()`** and `express.static(dir, { maxAge: '1y', immutable: true })` for hashed assets; `maxAge: '1d'` for images. | `server.js:54-57, 79-81` | **−35 KB HTML**, kill revalidation |
| 4 | **Fix images:** add `width`/`height` (or `aspect-ratio`), `loading="lazy"` (below fold), `decoding="async"`; `fetchpriority="high"` + `rel=preload` on `event-details.ejs:23`; **de-duplicate the URLs** so one photo is one request; self-host or proxy posters. | views + `event-details.ejs` | **−250 to −400 KB** on image-heavy pages |
| 5 | **Self-host 1–2 font files** (Outfit 400/700, subset), `preload` them, drop the `Inter` weights you never apply; then remove `header.ejs:47-49`. | `header.ejs` + `/fonts` | removes a blocking stylesheet + FOUT on the LCP element |
| 6 | **Add DB indexes** (see list §4.6). | migration only | turns hot-path scans into index seeks |
| 7 | **Kill `location.reload()`** after save/interest/chat — update the DOM or re-render a partial. | `event-details.ejs:574,593,715`, `saved-events.ejs:87` | avoids re-downloading 75 KB + recompiling per click |
| 8 | **Paginate** `admin/logs`, `admin/verifications`, `admin/reports`, `admin/users`, `admin/events`, `events.ejs`; add `LIMIT` to `api.js:120`. | routes + views | keeps DOM/SQL bounded as data grows |
| 9 | **Batch the N+1 writes** (`INSERT … VALUES (…),(…)`) and move reminder generation to a scheduled job. | `helpers.js:271-288,313-347` | O(n) → O(1) round-trips |
| 10 | **Trim the per-request user query**: select only needed columns; cache the unread count; don't dirty the session when flash is empty. | `middleware/auth.js:17,21-36` | −2 queries/request for logged-in users |
| 11 | **Switch `bcryptjs` → native `bcrypt`** (or worker threads). | `auth.js` | removes 50–150 ms event-loop stalls per auth call |
| 12 | Minor: `clearInterval` the countdown, fix `<img src="">`, drop dead `.glass-card`, replace the Maps iframe with a static map, guard `createTestAccount`, add an explicit 404 view. | various | polish |

### Realistic target after #1–#5

| Metric | Now | After (est.) |
|---|---|---|
| Transferred (home) | 870.7 KB | **~180–220 KB** |
| FCP | 3 848 ms | **~1.0–1.3 s** |
| LCP | 4 552 ms | **~1.3–1.8 s** |
| TBT | 1 571 ms | **~150–250 ms** |
| LCP rating | 🔴 poor | 🟢 good |

These are estimates from the measured breakdown, not re-measured results.

---

## 6. What is already good (don't touch it)

- **Server render time is excellent** — TTFB 14–20 ms including SQLite work.
- **CLS is already good** (0.000–0.047) on all four pages — the card grids use fixed heights (`h-52`/`h-48`/`h-44`), and flash messages are server-rendered in the initial HTML (`header.ejs:71`) rather than injected after load.
- **`loading="lazy"` on the Maps iframe** (`event-details.ejs:447`) and a fixed-height wrapper — no CLS there.
- **Emails are fire-and-forget** (`.catch()` at `auth.js:211,331,379`, `submissions.js:171`, `admin.js:118,179`) — SMTP never blocks a request.
- **`admin/logs` is paginated** (`LIMIT 150`, `admin.js:581`) — the pattern exists, it just isn't used elsewhere.
- **`display=swap`** is set on the font request (line 49) — correct, even if the rest of the font setup isn't.

---

## 7. Appendix — raw measurement notes

- Full data: `perf/raw.json` (per-page vitals, resource timings, CDP network entries with byte sizes).
- Home page render-blocking set (identical on all 4 pages): `cdn.tailwindcss.com/`, `fonts.googleapis.com/css2`, `cdnjs.cloudflare.com/…/all.min.css`.
- Long-task counts: `/` 5, `/events` 7, `/submit-event` 9, `/login` 8.
- Duplicate image URLs observed across the run: `photo-1514525253161-7a46d19cd819` (×4, incl. two distinct URLs), `photo-1501386761578-eac5c94b800a` (×4), `photo-1470225620780`, `photo-1511671782779`, `photo-1493225457124` (×2 each).
- Static + document responses carry **no `Content-Encoding`**; `Cache-Control: public, max-age=0` on `/favicon.svg`; `Access-Control-Allow-Origin: *` on all responses.
- No `CREATE INDEX` statements exist in the live SQLite DB or in `database/hostinger_mysql_schema.sql`.

*No application files were modified during this audit. The harness lives in `perf/` and is safe to delete.*
