import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processElement } from '../../src/content/element-processor';
import { ClassificationCache } from '../../src/shared/cache';
import { KeywordFilter } from '../../src/keyword-filter';
import type { CalmFeedSettings } from '../../src/types';
import { DEFAULT_SETTINGS } from '../../src/constants/defaults';
import { NEGATIVE_PL, NEUTRAL_PL } from '../fixtures/sample-texts';

describe('Keyword → ML pipeline integration', () => {
  let cache: ClassificationCache;
  let keywordFilter: KeywordFilter;
  let settings: CalmFeedSettings;

  beforeEach(() => {
    cache = new ClassificationCache();
    keywordFilter = new KeywordFilter('pl');
    settings = { ...DEFAULT_SETTINGS, mode: 'light' };
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Light mode (keywords only)', () => {
    it('hides all negative Polish texts via keywords', async () => {
      for (const text of NEGATIVE_PL) {
        document.body.innerHTML = `
          <main><article><h2>${text}</h2><p>Szczegoly wydarzenia.</p></article></main>
        `;
        const article = document.querySelector('article')!;
        await processElement(article, settings, cache, keywordFilter);
        expect(
          article.classList.contains('calmfeed-hidden'),
          `Expected "${text}" to be hidden`,
        ).toBe(true);
      }
    });

    it('does not hide neutral Polish texts', async () => {
      for (const text of NEUTRAL_PL) {
        document.body.innerHTML = `
          <main><article><h2>${text}</h2><p>Wiecej informacji w artykule.</p></article></main>
        `;
        const article = document.querySelector('article')!;
        await processElement(article, settings, cache, keywordFilter);
        expect(
          article.classList.contains('calmfeed-hidden'),
          `Expected "${text}" to NOT be hidden`,
        ).toBe(false);
      }
    });
  });

  describe('Balanced mode', () => {
    beforeEach(() => {
      settings.mode = 'balanced';
    });

    it('keyword matches bypass ML (no sendMessage for CLASSIFY_TEXT)', async () => {
      document.body.innerHTML = `
        <main><article><h2>Wojna w Ukrainie: kolejne ataki</h2></article></main>
      `;
      const article = document.querySelector('article')!;
      await processElement(article, settings, cache, keywordFilter);

      expect(article.classList.contains('calmfeed-hidden')).toBe(true);

      const classifyCalls = vi.mocked(chrome.runtime.sendMessage).mock.calls.filter(
        (call) => (call[0] as { type: string }).type === 'CLASSIFY_TEXT',
      );
      expect(classifyCalls).toHaveLength(0);
    });

    it('sends ML request for non-keyword content in balanced mode', async () => {
      vi.mocked(chrome.runtime.sendMessage).mockResolvedValue({
        isNegative: false,
        score: 0.2,
        topLabel: 'neutral',
        source: 'ml',
      });

      document.body.innerHTML = `
        <main><article><h2>Sytuacja polityczna w regionie jest napięta</h2></article></main>
      `;
      const article = document.querySelector('article')!;
      await processElement(article, settings, cache, keywordFilter);

      const classifyCalls = vi.mocked(chrome.runtime.sendMessage).mock.calls.filter(
        (call) => (call[0] as { type: string }).type === 'CLASSIFY_TEXT',
      );
      expect(classifyCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Cache behavior', () => {
    it('caches keyword results', async () => {
      document.body.innerHTML = `
        <main><article id="a1"><h2>Wojna w Ukrainie</h2><p>Opis wydarzen.</p></article></main>
      `;
      await processElement(document.querySelector('#a1')!, settings, cache, keywordFilter);

      expect(cache.size).toBeGreaterThan(0);
    });
  });
});
