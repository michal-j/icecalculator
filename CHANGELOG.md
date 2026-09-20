# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Favicon (`favicon.svg`).
- README with usage and scoring notes.
- A 5-tier qualitative label for the Total Score (Low priority → Must-do), color-coded from red to green based on the score value.

### Changed

- Redesigned the UI with a dark theme inspired by Linear: ambient gradient glow, layered card shadows, a single yellow accent color, and a Fraunces/Space Grotesk/Archivo type pairing in place of Inter.
- Impact, Confidence, and Ease cards are now neutral; the red/orange/green palette is used exclusively for the Total Score tiers instead.
- Every element now cascades into view on page load (staggered fade + blur), and score cards still pulse/flash when their value changes.
- Updated copy on several Impact/Confidence fields ("ARR increase potential", "User base reach", "Unknown risk potential", etc.) and renamed the matching field ids (`userReach` → `userBaseReach`, `additionalRisk` → `unknownRisk`) so ids stay consistent with the visible labels.
- Stopped tracking `.DS_Store`.

## [0.1.0] - 2025-09-11

### Added

- Initial ICE (Impact × Confidence × Ease) calculator as a single HTML file.
