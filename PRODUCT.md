# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Malaysian & Regional K-Pop Fans (Primary Consumers):** Interstate fans, concertgoers, cupsleeve cafe hoppers, and community members who need authentic Malaysian concert dates, venue transit directions, live countdowns, and verified ticketing links without scam risks.
2. **K-Pop Event Organizers & Fanclubs (Publishers):** Independent promoters (iMe, Star Planet, Live Nation MY), cafe owners, and fandom committees (CARAT MY, STAY MY, BLINK MY, etc.) who publish event schedules and need fast, transparent verification without bureaucratic admin approval delays.
3. **Platform Maintainers / System Stewards (Admins):** University FYP administrators and data integrity stewards auditing flagged scam listings, reviewing counter-evidence, and managing master catalogs (venues, idol groups, categories).

## Product Purpose

K-Sync Malaysia is Malaysia's centralized, authoritative K-Pop event intelligence and community platform. It eliminates fragmented social media schedules and ticketing scam risks by providing autonomous 10-point heuristic verification + Gemini 4 Argon multimodal consensus, venue-clustered event radars, idol discographies with normalized member profiles, and personalized fan concert command centers.

## Positioning

Unlike generic ticketing portals (Ticket2U, BookMyShow) or chaotic social channels (Twitter/X, Telegram), K-Sync Malaysia is built specifically for the Malaysian K-Pop live concert ecosystem: it combines autonomous anti-fraud verification, covered-walkway & LRT/MRT transit navigation for KL venues, crowdsourced fan reliability voting, and 24-hour post-event discussion archiving.

## Operating Context

- Web application responsive on desktop and mobile browsers (smartphones used during concert queues and cafe hops).
- Real-time event day operations: gate entry countdowns, transit guidance to Axiata Arena, Stadium Bukit Jalil, Zepp KL, Mega Star Arena, Sunway Pyramid.
- Server stack: Node.js (Express), SQLite local / MySQL Hostinger, Tailwind CSS, OpenRouter AI Gateway (Gemini 4 Argon & fallbacks).

## Capabilities and Constraints

- **Autonomous Event Verification:** 10-point algorithmic verification gate (ticketing whitelist, evidence URL resolution, duplicate protection, date consistency) + OpenRouter Gemini 4 Argon multimodal poster vision OCR.
- **Event Radar & Spatial Clustering:** Clustered venue precincts (Bukit Jalil, BBCC/Zepp, Bukit Bintang, KL Sentral, PJ/Sunway) and same-weekend multi-event cohorts.
- **Artists & Member Profiles:** Comprehensive idol database linked to Malaysian tour histories and normalized member biodata (stage names, birth names, positions, MBTI, birthdays, blood types).
- **Personalized Fan Command Center:** Live ticking D-Day showtime countdown, saved wishlist, crowdsourced recommendation history, and in-app schedule alert trays.
- **Anti-Fraud Discussion Threads:** 1-level threaded Q&A with organizer verification badges, comment deletion, and explicit immutability (no edit) to prevent scalper scam link hijacking.
- **Constraints:** No manual admin pre-approval bottlenecks, no anonymous guest event creation, strict adherence to supervisor requirements.

## Brand Commitments

- **Name:** K-Sync Malaysia (ksync.my)
- **Tagline:** Malaysia's Premier K-Pop Event Discovery & Community Hub
- **Voice:** Authoritative, energetic, fan-centric, clean, and trusted.
- **Visual Identity:** Vibrant deep-space slate (`#0f172a`), hot electric magenta/pink (`#ec4899` / `#db2777`), cyber violet (`#8b5cf6`), and emerald verification accents (`#10b981`).

## Evidence on Hand

- Full working implementation in Node.js/Express, SQLite (`database/ksync.db`), 24 core EJS templates and routes.
- 62 normalized idol members (SEVENTEEN, TWICE, IU, ENHYPEN, BABYMONSTER, IVE, etc.).
- 28/28 automated test suite assertions passing on port 9000.
- Empirical requirements survey data from 35 Malaysian K-Pop fans.

## Product Principles

1. **Zero-Trust Autonomous Verification:** Never rely on manual bottlenecks; audit listings algorithmically against official channels before public listing.
2. **Transit & Proximity First:** Group events by geographic transit corridors and shared weekends so interstate fans can plan realistic itineraries.
3. **Immutability for Safety:** Discussion comments and ticketing links must resist scalper tampering and post-publication bait-and-switch.
4. **Idol & Fandom Respect:** High-fidelity presentation of idol biodata, concert posters, and organizer credentials.

## Accessibility & Inclusion

- WCAG AA contrast compliance on all typography against dark and light backgrounds.
- Explicit semantic buttons with aria labels and screen-reader accessible countdown attributes.
- Mobile-responsive touch targets (minimum 44x44px) for one-handed phone use during live events.
