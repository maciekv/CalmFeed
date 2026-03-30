# Changelog

All notable changes to CalmFeed will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-30

### Added

- Keyword-based filtering for Polish negative news content (17 keyword groups with full inflections)
- English keyword support (14 keyword groups)
- ML-powered zero-shot classification using transformers.js (Xenova/mobilebert-uncased-mnli)
- Three filtering modes: Light (keywords only), Balanced (keywords + AI), Strict (AI for all)
- Sensitivity threshold slider (0-100%)
- Site whitelist (exclude domains from filtering)
- Content placeholders with "Show anyway" button
- Badge showing count of filtered items per tab
- MutationObserver for dynamically loaded content (infinite scroll)
- Popup UI with settings management
- LRU classification cache (2000 entries)
- 68 automated tests (unit + integration)
- TypeScript strict mode
- Webpack 5 build system
- CI pipeline (GitHub Actions)
