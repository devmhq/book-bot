# Design System & UI Palette — BookBot

This document details styling constants, fonts, border radii, components, and layout requirements.

---

## 1. Palette Specification

The BookBot application uses a custom dark theme. CSS variable tokens are defined in `globals.css` and mapped to Tailwind configuration keys.

| Variable Name | Hex Code | Interface Context |
|---|---|---|
| `--bg-base` | `#0f0f11` | Primary background color |
| `--bg-surface` | `#16151a` | Card, container, and dialog layouts |
| `--bg-elevated` | `#1a1820` | Inner cards, table headers, sidebar sections |
| `--bg-deep` | `#111014` | Sidebar and collapsed panels background |
| `--border` | `#2a2830` | Standard dividing line border colors |
| `--border-subtle` | `#1e1c24` | Faint container separation |
| `--text-primary` | `#f0eeff` | High-contrast headings and callouts |
| `--text-body` | `#e8e6f0` | Standard paragraph copy and input texts |
| `--text-muted` | `#9896a8` | Form labels and system titles |
| `--text-dim` | `#7a7890` | Descriptive details and icons |
| `--text-ghost` | `#55535f` | Micro-details, counts, and dates |
| `--text-dead` | `#45434f` | Input placeholder texts |
| `--accent` | `#6c5ce7` | Active items, CTA highlights, buttons |
| `--accent-hover` | `#7d6ef5` | Hover state background colors |
| `--accent-soft` | `#2a1f4a` | Selected item card container highlights |
| `--accent-text` | `#9b8cf5` | Colored highlight text links |
| `--green` | `#5dcaa5` | Success metrics, online indicators, booked |
| `--green-soft` | `#1a2e22` | Success indicator backgrounds |
| `--amber` | `#f0c070` | Warning details, pending states, SMS alerts |
| `--amber-soft` | `#2e2010` | Warning alerts container background |
| `--red` | `#e88080` | Danger buttons, critical error notices |
| `--red-soft` | `#2a1a1a` | Failure dialog box highlights |

---

## 2. Typography

* **Sans-Serif Font**: `DM Sans` (used for all general interface text, headlines, buttons, and prompts). Loaded via Google Fonts integration.
* **Monospace Font**: `DM Mono` (used for code snippets, database identifiers, date strings, and numeric metrics).

---

## 3. Border Radii

* `--radius-sm`: `6px` (used for input fields and small action badges).
* `--radius-md`: `8px` (used for utility buttons, checkboxes, and settings switches).
* `--radius-lg`: `10px` (used for cards, user bubbles, and lists).
* `--radius-xl`: `16px` (used for modals, dashboard widgets, and sheet drawers).
* `--radius-full`: `9999px` (used for user avatar shapes and pill filters).
