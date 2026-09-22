# Architecture

## What this is

A single-page tool that scores product ideas using Impact × Confidence × Ease
(ICE). It's a personal/internal prioritization tool, not a product — see
[Scope: internal tool, not a public product](#scope-internal-tool-not-a-public-product)
below for what that implies.

## File structure

- [`index.html`](../index.html) — markup, styles, and DOM wiring (reading form
  inputs, writing score cards, the reveal/pulse animations).
- [`scoring.js`](../scoring.js) — the actual scoring math, as plain functions
  with no DOM access. Loaded by `index.html` via `<script src="scoring.js">`
  (as the `ICEScoring` global) and required directly by the test suite. It's a
  small UMD-style wrapper so the same file works both ways with zero build
  step.
- [`tests/scoring.test.js`](../tests/scoring.test.js) — automated tests
  against `scoring.js`, using Node's built-in test runner (`node:test`,
  `node:assert`). No dependencies to install; run with `npm test` or
  `node --test`.
- [`tests/TEST_CASES.md`](../tests/TEST_CASES.md) — the same coverage, as a
  human-readable table you can walk through by hand in the running app.
- `favicon.svg`, `README.md`, `CHANGELOG.md` — as named.

This is a deliberate change from the original "everything in one file"
layout: pulling the scoring math out of `index.html` was the only way to unit
test it without adding a DOM-emulation dependency (e.g. jsdom). Everything
else about the project — no build step, no install step to run the app,
open `index.html` directly in a browser — is unchanged.

## Scoring model

### Impact (0–5, additive, capped at 5)

| Field | Category | Options → weight |
|---|---|---|
| Win rate increase potential | New business | Low 0.1 · Medium 0.5 · High 1 |
| ARR increase potential | New business | <100K 0.2 · 100–249K 0.5 · 250–499K 1 · 500–999K 2 · >1M 3 · Unknown/None 0 |
| Retention / LTV increase potential | Existing business | Low 0.1 · Medium 0.5 · High 1 |
| Customer satisfaction / NPS improvement | Existing business | Low 0.01 · Medium 0.1 · High 0.5 |
| User base reach | — | <10% 0.2 · 10–25% 0.5 · 25–50% 0.75 · 50–100% 1 |

Raw max is 6.5; the displayed score is capped at 5.

### Confidence (0–5, additive, capped at 5)

| Field | Weight |
|---|---|
| Canny votes | <5 0.1 · 5–10 0.25 · 11–49 0.5 · 50–75 0.75 · >75 1 |
| Competitive landscape | Low-risk bet 0.5 · Medium-risk bet 0.1 · High-risk bet 0 |
| Confirmed by user research | +1 |
| Desirable from the tech perspective | +1 |
| Supported by product analytics | +0.5 |
| Differentiator potential | +0.5 |
| Supported by churned/lost deals | +0.75 |
| Generates Support workload | +0.5 |
| External factors | +0.5 |
| ICP market fit | +0.25 |
| Supported by market trends | +0.1 |
| ICP segment fit | +0.1 |
| Your manager's conviction | +0.02 |
| Self conviction | +0.01 |

### Ease (1–5, subtractive from a base of 5, floored at 1)

| Field | Weight |
|---|---|
| Implementation complexity | Low 0 · Medium -1 · High -2 · Unknown -3 |
| Estimated timeframe | Short 0 · Medium -0.5 · Long -2 · Unknown -3 |
| Cross-tech team | -1 |
| Cross-module/app/tech | -2 |
| Cross-project | -1 |
| Integrations | -2 |
| Internal 3rd parties | -1 |
| External 3rd parties | -2 |
| Legal / security / pricing implications | -1 |
| Unknown risk potential | -1 |

### Total and tiers

`Total = Impact × Confidence × Ease`, rounded to one decimal place. The tier
label is picked by `total < max`:

| Tier | Range | Label |
|---|---|---|
| 1 | < 5 | Low priority |
| 2 | < 15 | Needs work |
| 3 | < 30 | Worth exploring |
| 4 | < 55 | Strong bet |
| 5 | ≥ 55 | Must-do |

**Boundaries are exclusive on the top end** — a total of exactly 5 is tier 2
("Needs work"), not tier 1. All four field-level scores (Impact, Confidence,
Ease) and the Total are independently rounded to one decimal place at each
stage, so the displayed Total can differ very slightly from multiplying the
three *displayed* numbers together by hand.

## Known gotchas

- **Unanswered ≈ best case.** For Implementation complexity, Estimated
  timeframe, and ARR potential, the "Select..." (unanswered) option carries
  the same value as the most favorable real answer (`Low`/`Short`/`Unknown-None`
  all map to `0`). A field a user never touched is indistinguishable from one
  they answered optimistically, and nothing in the UI flags an unanswered
  field. **This is intentional for now** — see [Scope](#scope-internal-tool-not-a-public-product).
- **Tiny checkbox weights can round away to nothing.** Self conviction
  (0.01) and Your manager's conviction (0.02) only affect the displayed
  Confidence score if their sum, combined with everything else checked,
  crosses a 0.05 rounding boundary. Checking just those two boxes alone
  scores Confidence = 0.
- **No persistence.** Reloading the page resets every field — there's no
  `localStorage`, URL state, or save/export. Fine for a single scoring
  session; not fine if you want to revisit or share a saved score.

## Decisions log

- **Plain HTML/CSS/JS, no framework, no build step.** This is a personal
  tool used by one person for occasional scoring — a framework and build
  pipeline would be pure overhead.
- **Scoring logic split out of `index.html` into `scoring.js`.** Needed to
  unit test the math in isolation. Chose a hand-written UMD wrapper over a
  bundler/module system so it still works as a plain `<script>` tag with zero
  build step.
- **Node's built-in test runner (`node:test`) instead of a test framework.**
  Zero dependencies to install (works on Node ≥18); nothing to run beyond
  `node --test`.

## Scope: internal tool, not a public product

This calculator was built for one person's/one team's internal use, and a
few things reflect that on purpose:

- The "unanswered defaults to best case" behavior above is left as-is. It'd
  be worth fixing (e.g. requiring every field to be touched, or defaulting
  unanswered fields to a neutral/worst value) before this tool is used by
  people other than its author.
- **"Canny votes" is specific to whichever feedback tool this team happens
  to use** — not everyone tracks feature requests in Canny.
- **The numeric bands themselves are specific to this product/team**: ARR
  breakpoints (<100K, 100–249K, …, >1M), vote-count breakpoints (<5, 5–10,
  11–49, 50–75, >75), and similar thresholds were picked for one business's
  scale. A different product would need entirely different bands.

### If this were ever released more broadly, it would be worth:

- **Making the field values configurable** instead of hard-coded in
  `scoring.js`/`index.html` — e.g. a config object (or admin UI) defining
  each field's label, options, and weights, so a team can adapt the ARR
  bands, vote thresholds, and similar numbers to their own business without
  editing source.
- **Explaining what each option actually means**, in place or on hover —
  right now several fields (the various checkboxes especially) assume the
  reader already knows the scoring framework and what "counts" for each
  one. A newcomer filling this out for the first time would benefit from
  short inline explanations of what qualifies, e.g. what makes something a
  "Differentiator" or what "ICP market fit" vs "ICP segment fit" actually
  means in practice.
- Generalizing or removing the Canny-specific field (e.g. "external
  feedback signal volume" with a pluggable source).
- Deciding what to do about the unanswered-field gotcha above.
- Adding persistence (save/share a scored idea, not just a live session).
