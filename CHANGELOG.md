# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Favicon (`favicon.svg`).
- README with usage and scoring notes.
- A 5-tier qualitative label for the Total Score (Low priority → Must-do), color-coded from red to green based on the score value.
- Automated test suite for the scoring logic (`tests/scoring.test.js`, run via `npm test` / `node --test`, no install step) plus a human-readable test-case walkthrough (`tests/TEST_CASES.md`).
- `docs/architecture.md` documenting the scoring weights, tier thresholds, known gotchas (e.g. unanswered fields scoring the same as the best-case answer, small checkbox weights rounding away), and design decisions — including what would need to change before this tool could go beyond internal/personal use (configurable field values, explaining what each option means, generalizing the Canny-specific field).

### Changed

- Extracted the scoring math out of `index.html` into `scoring.js` (loaded as a plain `<script>` and shared with the test suite) so it can be unit tested without a DOM. No behavior change.

- Simplified the title: dropped the Fraunces italic display face and the square icon mark in favor of Space Grotesk at a larger size, matching the rest of the type system.
- Redesigned the UI with a dark theme inspired by Linear: ambient gradient glow, layered card shadows, a single yellow accent color, and a Fraunces/Space Grotesk/Archivo type pairing in place of Inter.
- Impact, Confidence, and Ease cards are now neutral; the red/orange/green palette is used exclusively for the Total Score tiers instead.
- Every element now cascades into view on page load (staggered fade + blur), and score cards still pulse/flash when their value changes.
- Updated copy on several Impact/Confidence fields ("ARR increase potential", "User base reach", "Unknown risk potential", etc.) and renamed the matching field ids (`userReach` → `userBaseReach`, `additionalRisk` → `unknownRisk`) so ids stay consistent with the visible labels.
- Corrected the header subtitle from "Impact × Confidence × Effort Framework" to "Impact × Confidence × Ease Framework" to match the Ease field.
- Renamed `ice_calculator.html` to `index.html`.
- Stopped tracking `.DS_Store`.

## [0.1.0] - 2025-09-11

### Added

- Initial ICE (Impact × Confidence × Ease) calculator as a single HTML file.
