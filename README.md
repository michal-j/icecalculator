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

- `index.html` — markup, styles, and DOM wiring.
- `scoring.js` — the scoring math (pure functions, no DOM), shared by the app and the test suite.
- `favicon.svg` — the browser tab icon.
- `docs/architecture.md` — scoring weights, tier thresholds, known gotchas, and design decisions.
- `tests/` — automated tests plus a human-readable test-case walkthrough.

## Development

Plain HTML/CSS/vanilla JS, no framework or build step required. Edit `index.html` or `scoring.js` directly and reload the page to see changes.

## Testing

```
npm test
```

Runs the scoring logic tests with Node's built-in test runner (`node --test`) — no install step. See [`tests/TEST_CASES.md`](tests/TEST_CASES.md) for the same coverage as a manual walkthrough, and [`docs/architecture.md`](docs/architecture.md) for the reasoning behind the scoring weights and a few documented quirks.
