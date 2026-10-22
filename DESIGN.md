---
name: K-Sync Malaysia
description: Vibrant, high-trust K-Pop live concert intelligence and community platform for Malaysia
colors:
  primary: "#0f172a"          # Deep Slate (Hero, Footers, Headings)
  primary-hover: "#1e293b"    # Slate 800
  accent-pink: "#db2777"      # Electric Fuchsia / Hot Pink 600 (Primary Brand Voice)
  accent-pink-hover: "#be185d" # Pink 700
  accent-purple: "#8b5cf6"    # Cyber Violet / Purple 500 (Secondary Accent, Dates)
  accent-purple-hover: "#7c3aed" # Purple 600
  neutral-bg: "#f8fafc"       # Slate 50 Ground
  neutral-surface: "#ffffff"  # Pure White Surfaces
  neutral-card: "rgba(255, 255, 255, 0.95)"
  neutral-border: "#e2e8f0"   # Slate 200 Card Borders
  neutral-text-main: "#0f172a" # Slate 900
  neutral-text-muted: "#64748b" # Slate 500
  neutral-text-sub: "#94a3b8"  # Slate 400
  success: "#10b981"          # Emerald 500 (Verified Badges, Whitelisted Channels)
  success-bg: "#ecfdf5"       # Emerald 50
  success-border: "#a7f3d0"   # Emerald 200
  warning: "#f59e0b"          # Amber 500 (Postponed, Counter-evidence Required)
  warning-bg: "#fffbeb"       # Amber 50
  danger: "#e11d48"           # Rose 600 (Cancelled, Suspended, Scam Reports)
  danger-bg: "#fff1f2"        # Rose 50
typography:
  display:
    fontFamily: "Outfit, Inter, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Outfit, Inter, sans-serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Outfit, Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, Outfit, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Outfit, Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-accent:
    backgroundColor: "{colors.accent-pink}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.xl}"
    padding: "10px 24px"
  button-accent-hover:
    backgroundColor: "{colors.accent-pink-hover}"
  badge-verified:
    backgroundColor: "{colors.success-bg}"
    textColor: "#065f46"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# K-Sync Malaysia Design System

## Overview

K-Sync Malaysia is an authoritative, high-energy live entertainment platform for Malaysian K-Pop fans, organizers, and fanclubs. The visual design system synthesizes the electric excitement of stadium K-Pop concerts with the uncompromising rigor of financial-grade anti-scam verification.

### Core Philosophy
1. **Uncompromised Authenticity:** Every verified event carries high-salience proof tags (whitelisted ticketing domain, promoter validation, counter-evidence audits).
2. **Atmospheric Contrast:** Deep stadium-black accents (`#0f172a`) paired with electric magenta (`#db2777`) and cyber violet (`#8b5cf6`) against crisp, airy card surfaces (`#f8fafc`).
3. **Scanability First:** Dense concert schedules, LRT transit recommendations, and D-Day countdown timers are parsed at a glance by fans in transit.

---

## Colors

### Primary Palette
- **Deep Space Slate (`#0f172a`):** Anchors hero cards, navigation headers, primary buttons, and system authority.
- **Electric Pink (`#db2777` / `#ec4899`):** The signature brand heartbeat. Used for primary calls-to-action, active indicators, and highlight pills.
- **Cyber Violet (`#8b5cf6` / `#7c3aed`):** Secondary accent for dates, idol categories, and spatial precinct navigation.

### Functional Status System
- **Verified (`#10b981` / `#ecfdf5`):** Signal for official promoter verification, authentic tickets, and passed checks.
- **Under Review (`#f59e0b` / `#fffbeb`):** Pending autonomous verification or user-submitted counter-evidence.
- **Scam Alert / Suspended (`#e11d48` / `#fff1f2`):** Flagged or disputed listings with animated alert badges.

---

## Typography

### Font Families
- **Display & Headings:** `Outfit` (Weights: 700 Bold, 800 ExtraBold, 900 Black). Modern geometric grotesque with energetic circular terminals, matching K-Pop album typography.
- **Body & Controls:** `Inter` (Weights: 400 Regular, 500 Medium, 600 SemiBold). Optimized for crisp mobile legibility at 12px–14px.

### Hierarchy Scale
- **Display 1:** `clamp(2.5rem, 5vw, 4rem)` (900 Black, -0.03em tracking) for Hero titles.
- **H1:** `clamp(1.75rem, 3.5vw, 2.5rem)` (800 ExtraBold) for Page titles.
- **H2:** `1.5rem` (800 ExtraBold) for Section heads.
- **H3:** `1.125rem` (700 Bold) for Card titles.
- **Body Regular:** `0.875rem` / 14px (1.6 line-height) for general copy and descriptions.
- **Caption / Meta:** `0.75rem` / 12px for venue details, transit hints, and timestamps.

---

## Layout

### Grid Structure
- **Max Container:** `80rem` (1280px) centered with `px-4 sm:px-6 lg:px-8`.
- **Card Grids:** 
  - Desktop: 3-column (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`)
  - Tablet: 2-column
  - Mobile: Single column with edge-to-edge touch target margins.

### Spatial Corridor Modules
- **Precinct Cards:** Dedicated regional blocks (Bukit Jalil Hub, Zepp KL BBCC, Mega Star Arena) grouping multiple venues with LRT/MRT transit advisories.
- **Timeline Cohorts:** Friday–Sunday weekend grouping containers for trip planning.

---

## Elevation & Depth

### Tonal Stacking
- **Ground:** Slate 50 (`#f8fafc`) with subtle radial micro-grid pattern (`radial-gradient(#e2e8f0 1px, transparent 1px)`).
- **Cards (Surface 1):** Pure White (`#ffffff`) with 1px border (`#e2e8f0`) and subtle multi-layer drop shadow (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05)`).
- **Floating Modals / Drawers (Surface 2):** White or Slate 950 with backdrop blur (`backdrop-filter: blur(16px)`), border (`border-white/20`), and dramatic ambient glow (`box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25)`).

---

## Shapes

- **Base Cards & Modules:** `rounded-3xl` (24px to 32px) for a soft, friendly, modern aesthetic.
- **Interactive Buttons & Form Inputs:** `rounded-xl` (12px to 14px) with minimum 44px touch targets.
- **Status Pills & Categories:** `rounded-full` (9999px) with generous horizontal padding (`px-3 py-1`).

---

## Components

### 1. Verification Scorecard (UC029)
- Displays 0–100 automated verification score with color-graded progress arcs (Green $\ge 70$, Amber $50–69$, Red $<50$).
- Granular breakdown of 10 heuristic rules and OpenRouter Gemini 4 Argon AI consensus votes.

### 2. Live Countdown Clock (UC006 & UC016)
- Four-segment digital ticker (Days, Hours, Minutes, Seconds) with real-time vanilla JS updates.
- Micro-pill countdown chips on event discovery cards.

### 3. Spatial Event Radar (UC005)
- Mode switcher between **Geographic Precincts** (LRT/MRT proximity hubs) and **Same-Weekend Timeline Cohorts**.
- Interactive map launcher and direct transit walking-time badges.

### 4. Normalized Idol Member Cards (UC013)
- Member portrait with gradient fade, stage name, birth name in Hangul, position badge, and clean biodata grid (Zodiac, Nationality, MBTI, Height, Blood Type).

---

## Do's and Don'ts

### Do's
- **DO** always display the official ticketing channel badge on event detail pages with domain verification icons.
- **DO** calculate live countdowns dynamically based on Malaysian Standard Time (MYT / UTC+8).
- **DO** provide one-click external outbound actions (Google Maps transit, WhatsApp share, Google Calendar export).
- **DO** keep discussion comments immutable (no edit) to prevent scalpers from editing sold-out notices with fraudulent resale links.

### Don'ts
- **DON'T** use low-contrast grey text on dark backgrounds; ensure WCAG AA $\ge 4.5:1$ contrast at all times.
- **DON'T** hide counter-evidence feedback from organizers when an event verification score is suboptimal.
- **DON'T** introduce manual admin bottleneck queues for event publishing; let the autonomous verification engine enforce listings dynamically.
