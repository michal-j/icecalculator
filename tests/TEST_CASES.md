# Test cases

Manual walkthrough companion to [`scoring.test.js`](scoring.test.js). Each case
can be run either by calling the matching function in [`scoring.js`](../scoring.js)
directly, or by setting the listed fields in the running app ([`index.html`](../index.html))
and reading the score cards.

Automated run: `npm test` (or `node --test`) — no install step required.

## Impact

| # | Case | Steps | Expected result |
|---|------|-------|------------------|
| 1 | Nothing answered | Leave all Impact fields on "Select..." | Impact = 0 |
| 2 | Partial answers sum correctly | Win rate = Low (0.1), ARR = <100K (0.2), Retention/LTV = Low (0.1), CSAT = Low (0.01), User base reach = <10% (0.2) | Impact = 0.6 |
| 3 | Capped at 5 | Set every Impact field to its highest option (Win rate = High, ARR = >1M, Retention/LTV = High, CSAT = High, User base reach = 50–100%) | Impact = 5 (raw sum is 6.5, but the display caps at 5) |

## Confidence

| # | Case | Steps | Expected result |
|---|------|-------|------------------|
| 4 | Nothing answered | Leave all Confidence fields/checkboxes unset | Confidence = 0 |
| 5 | Two checkboxes | Check "Confirmed by user research" (+1) and "Supported by product analytics" (+0.5) | Confidence = 1.5 |
| 6 | Capped at 5 | Set Canny votes = >75, Competitive = Low-risk bet, and check every Confidence checkbox | Confidence = 5 |
| 7 | Smallest weights can vanish | Check only "Self conviction" (+0.01) and "Your manager's conviction" (+0.02) | Confidence = 0 — the 0.03 raw total rounds to one decimal place and disappears. This is expected, not a bug. |

## Ease

| # | Case | Steps | Expected result |
|---|------|-------|------------------|
| 8 | Nothing answered | Leave Implementation complexity and Estimated timeframe on "Select...", no dependency boxes checked | Ease = 5 (best case) |
| 9 | Unanswered looks identical to best-case | Compare case 8 to: Implementation complexity = Low, Estimated timeframe = Short | Both score Ease = 5 — "Select..." and the best-case option share the same underlying value (`0`). Known, intentional for this internal-use version (see [docs/architecture.md](../docs/architecture.md)). |
| 10 | Typical deductions | Implementation complexity = Medium (-1), Estimated timeframe = Medium (-0.5), check "Cross-tech team" (-1) | Ease = 2.5 |
| 11 | Floors at 1 | Implementation complexity = Unknown (-3), Estimated timeframe = Unknown (-3), check every dependency box | Ease = 1 (raw total would be negative) |

## Total score and tier

| # | Case | Steps | Expected result |
|---|------|-------|------------------|
| 12 | All zero | Fill nothing in | Total = 0, tier = "Low priority" |
| 13 | Strong idea | Win rate = High, ARR = >1M, Retention/LTV = High, CSAT = High, User base reach = 50–100% (Impact = 5); Canny votes = >75, Competitive = Low-risk bet, check "Confirmed by user research", "Supported by product analytics", "Desirable from the tech perspective" (Confidence = 4); Implementation complexity = Low, Estimated timeframe = Short (Ease = 5) | Total = 100, tier = "Must-do" |
| 14 | Tier boundary is exclusive on the top end | Construct any combination whose total lands exactly on 5, 15, 30, or 55 | The score belongs to the *next* tier up (e.g. a total of exactly 15 shows "Worth exploring", not "Needs work") — the code checks `total < max` |

## UI behavior (manual only — not covered by the automated suite)

| # | Case | Steps | Expected result |
|---|------|-------|------------------|
| 15 | Score pulse animation | Change any field after the page has loaded | The affected score card briefly flashes and the number pulses; the initial page load does not pulse |
| 16 | Reveal animation | Reload the page | Every section cascades into view with a staggered fade/blur, then stops overriding opacity for later score-change animations |
| 17 | Total score tier color | Push the total score across a tier boundary (e.g. from 0 into the 5–15 range) | The Total Score card's border/text color and label update to match the new tier (red → orange → yellow → light green → green) |
