# ICE Calculator

A single-page tool for scoring product ideas using the **Impact × Confidence × Ease (ICE)** framework. Fill in the criteria for each dimension and the total score updates live.

## Usage

No build step or dependencies — just open [`index.html`](index.html) in a browser.

## How scoring works

- **Impact** (0–5): weighted sum of new-business potential (win rate, ARR), existing-business potential (retention/LTV, CSAT/NPS), and user base reach.
- **Confidence** (0–5): weighted sum of demand signals (Canny votes, competitive landscape) and supporting checkboxes (user research, analytics, market trends, ICP fit, etc.).
- **Ease** (1–5): starts at 5 and is reduced by implementation complexity, timeframe, and dependency/risk checkboxes (cross-team, integrations, legal/security, unknown risk, etc.).
- **Total Score** = Impact × Confidence × Ease.

## Project structure

- `index.html` — the entire app: markup, styles, and scoring logic in one file.
- `favicon.svg` — the browser tab icon.

## Development

Plain HTML/CSS/vanilla JS, no framework or tooling required. Edit `index.html` directly and reload the page to see changes.
