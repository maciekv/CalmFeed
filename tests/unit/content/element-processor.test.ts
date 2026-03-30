import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processElement } from '../../../src/content/element-processor';
import { ClassificationCache } from '../../../src/shared/cache';
import { KeywordFilter } from '../../../src/keyword-filter';
import type { CalmFeedSettings } from '../../../src/types';
import { DEFAULT_SETTINGS } from '../../../src/constants/defaults';

describe('processElement', () => {
  let cache: ClassificationCache;
  let keywordFilter: KeywordFilter;
  let settings: CalmFeedSettings;

  beforeEach(() => {
    cache = new ClassificationCache();
    keywordFilter = new KeywordFilter('pl');
    settings = { ...DEFAULT_SETTINGS, mode: 'light' };
    document.body.innerHTML = '';
  });

  it('hides element with negative keyword content', async () => {
    document.body.innerHTML = `
      <main>
        <article>
          <h2>Wojna w Ukrainie trwa</h2>
          <p>Kolejne ataki na cywilów.</p>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    expect(article.classList.contains('calmfeed-hidden')).toBe(true);
  });

  it('does not hide neutral content', async () => {
    document.body.innerHTML = `
      <main>
        <article>
          <h2>Prognoza pogody na weekend</h2>
          <p>Będzie słonecznie i ciepło.</p>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    expect(article.classList.contains('calmfeed-hidden')).toBe(false);
  });

  it('creates placeholder when hiding element', async () => {
    document.body.innerHTML = `
      <main>
        <article>
          <h2>Zabójstwo w parku miejskim</h2>
          <p>Policja szuka sprawcy.</p>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    const placeholder = document.querySelector('.calmfeed-placeholder');
    expect(placeholder).not.toBeNull();
    expect(placeholder?.textContent).toContain('CalmFeed');
  });

  it('skips already-processed elements', async () => {
    document.body.innerHTML = `
      <main>
        <article data-calmfeed-processed="done">
          <h2>Wojna trwa</h2>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    expect(article.classList.contains('calmfeed-hidden')).toBe(false);
  });

  it('skips elements with very short text', async () => {
    document.body.innerHTML = `<article><h2>OK</h2></article>`;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    expect(article.hasAttribute('data-calmfeed-processed')).toBe(false);
  });

  it('uses cache for repeated texts', async () => {
    cache.set('Wojna w Ukrainie trwa. Kolejne ataki.', {
      isNegative: true,
      score: 0.9,
      topLabel: 'violence',
      source: 'keyword',
      timestamp: Date.now(),
    });

    document.body.innerHTML = `
      <main>
        <article>
          <h2>Wojna w Ukrainie trwa</h2>
          <p>Kolejne ataki.</p>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    expect(article.classList.contains('calmfeed-hidden')).toBe(true);
  });

  it('does not send ML request in light mode', async () => {
    document.body.innerHTML = `
      <main>
        <article>
          <h2>Neutral but ambiguous content here</h2>
          <p>Something about politics and tension in the region.</p>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    settings.mode = 'light';
    await processElement(article, settings, cache, keywordFilter);
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CLASSIFY_TEXT' }),
    );
  });

  it('respects threshold setting', async () => {
    settings.threshold = 0.9;
    document.body.innerHTML = `
      <main>
        <article>
          <h2>Pożar w kamienicy</h2>
          <p>Strażacy walczą z ogniem.</p>
        </article>
      </main>
    `;
    const article = document.querySelector('article')!;
    await processElement(article, settings, cache, keywordFilter);
    // pożar severity is 0.7, threshold is 0.9, so should NOT be hidden
    expect(article.classList.contains('calmfeed-hidden')).toBe(false);
  });
});
