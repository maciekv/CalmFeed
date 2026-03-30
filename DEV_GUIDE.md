# CalmFeed Development Guide

## Prerequisites

- Node.js 18+
- Chrome browser
- npm

## Setup

```bash
git clone https://github.com/maciekv/CalmFeed.git
cd CalmFeed
npm install
```

## Development Workflow

### 1. Build and Watch

```bash
npm run dev
```

This starts webpack in watch mode. Changes to `src/` trigger automatic rebuilds to `dist/`.

### 2. Load Extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` directory
5. Navigate to any news site (e.g., tvn24.pl)

### 3. Reload After Changes

- **Content script changes**: Refresh the page tab
- **Popup changes**: Close and reopen popup
- **Background/offscreen changes**: Click reload button on `chrome://extensions`

### 4. Debugging

| Component | How to Debug |
|-----------|-------------|
| Content script | Regular DevTools console (filter by `[CalmFeed]`) |
| Service worker | `chrome://extensions` → "Inspect views: service worker" |
| Popup | Right-click popup → "Inspect" |
| Offscreen document | Logs relay through service worker |

## Testing

```bash
npm run test           # Run all tests once
npm run test:watch     # Interactive watch mode
npm run test:coverage  # With coverage report
```

### Test Structure

```
tests/
  setup.ts                    — Chrome API mocks
  fixtures/                   — HTML fixtures, sample texts
  unit/
    keyword-filter/           — Keyword matching, stemmer, dictionary
    content/                  — DOM scanning, element processing
    shared/                   — Cache, message bus
    ml/                       — Classification queue
  integration/                — End-to-end pipeline tests
```

## Adding Keywords

Edit `src/constants/keywords.ts`:

```typescript
{
  lemma: 'new_word',
  forms: ['new_word', 'new_words', ...all_inflected_forms],
  severity: 0.8,  // 0.0 to 1.0
  category: 'violence',  // violence | death | disaster | crime
}
```

Include all grammatical forms for Polish nouns (7 cases x 2 numbers).

## Adding a New Language

1. Create a new keyword array in `src/constants/keywords.ts` (e.g., `DE_KEYWORDS`)
2. Add it to `ALL_KEYWORDS` map
3. Add test cases in `tests/fixtures/sample-texts.ts`
4. The ML model already supports 100+ languages — no changes needed there

## Project Structure

```
src/
  types/          — TypeScript type definitions
  constants/      — Keywords, DOM selectors, default settings
  shared/         — Utilities (cache, storage, logger, message bus)
  keyword-filter/ — Fast keyword matching with Polish stemmer
  ml/             — ML classifier, queue, labels
  content/        — Content script (DOM scanning, hiding)
  background/     — Service worker (message routing, badge)
  offscreen/      — Offscreen document (ML inference)
  popup/          — Preact UI components
```

## Build System

- **Webpack 5** with 4 entry points (content, background, offscreen, popup)
- **ts-loader** for TypeScript compilation
- **MiniCssExtractPlugin** for CSS extraction
- **CopyPlugin** copies `public/` to `dist/`
- No code splitting (each entry runs in isolated context)

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking user-facing changes
- **MINOR**: New features (languages, filter categories)
- **PATCH**: Bug fixes, keyword updates, performance improvements

Version must be updated in both `package.json` and `public/manifest.json`.

## CI

GitHub Actions runs on every push/PR:
1. TypeScript typecheck
2. ESLint
3. Vitest (all tests)
4. Webpack production build
