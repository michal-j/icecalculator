# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Favicon (`favicon.svg`).
- README with usage and scoring notes.

### Changed

- Redesigned the UI with a dark theme, yellow accent, and Inter typography, inspired by Linear.
- Added a subtle fade-in on page load and a pulse/flash animation on the score cards whenever a score changes.
- Updated copy on several Impact/Confidence fields ("ARR increase potential", "User base reach", "Unknown risk potential", etc.) and renamed the matching field ids (`userReach` → `userBaseReach`, `additionalRisk` → `unknownRisk`) so ids stay consistent with the visible labels.
- Stopped tracking `.DS_Store`.

## [0.1.0] - 2025-09-11

### Added

- Initial ICE (Impact × Confidence × Ease) calculator as a single HTML file.
