# CalmFeed

Chrome extension that filters negative news content using AI. Works on any news website. Supports Polish and English (more languages coming).

## How It Works

CalmFeed scans news websites and hides articles about war, death, accidents, violence, and other negative topics. It uses a hybrid approach:

1. **Keyword filter** (instant) — matches known negative words in Polish and English with all grammatical forms
2. **ML classifier** (200-500ms) — zero-shot AI classification for content that keywords don't catch
3. **Cache** — previously classified content is served instantly

Hidden articles are replaced with a placeholder showing the category and a "Show anyway" button.

## Filtering Modes

| Mode | Description | Speed |
|------|-------------|-------|
| **Light** | Keywords only | Instant |
| **Balanced** | Keywords + AI for uncertain content | Fast |
| **Strict** | AI classifies everything | Thorough |

## Installation (Development)

```bash
git clone https://github.com/maciekv/CalmFeed.git
cd CalmFeed
npm install
npm run build
```

Then load in Chrome:
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` directory

## Development

```bash
npm run dev          # Watch mode (auto-rebuild on changes)
npm run test         # Run all tests
npm run test:watch   # Watch mode for tests
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run build        # Production build
```

See [DEV_GUIDE.md](DEV_GUIDE.md) for detailed development workflow.

## Architecture

```
Content Script (per tab)     → scans DOM, keyword filter, hides elements
Service Worker (background)  → message routing, settings, badge
Offscreen Document           → ML model inference (WASM)
Popup                        → user settings UI (Preact)
```

## Tech Stack

- TypeScript, Webpack 5, Chrome Manifest V3
- Preact (popup UI)
- @huggingface/transformers (ML inference)
- Vitest (testing)

## License

MIT
