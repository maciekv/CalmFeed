import { describe, it, expect, beforeEach } from 'vitest';
import { scanPage, extractClassifiableText, isExcluded } from '../../../src/content/scanner';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('scanner', () => {
  beforeEach(() => {
    const html = readFileSync(resolve(__dirname, '../../fixtures/news-page-pl.html'), 'utf-8');
    document.body.innerHTML = html;
  });

  describe('scanPage', () => {
    it('finds article elements', () => {
      const elements = scanPage();
      expect(elements.length).toBeGreaterThan(0);
    });

    it('finds all 5 articles from fixture', () => {
      const elements = scanPage();
      const articles = elements.filter((el) => el.tagName === 'ARTICLE');
      expect(articles.length).toBe(5);
    });

    it('does not return duplicates', () => {
      const elements = scanPage();
      const unique = new Set(elements);
      expect(unique.size).toBe(elements.length);
    });
  });

  describe('extractClassifiableText', () => {
    it('extracts headline text', () => {
      const article = document.querySelector('article[data-id="1"]')!;
      const text = extractClassifiableText(article);
      expect(text).toContain('Wojna w Ukrainie');
    });

    it('includes summary text', () => {
      const article = document.querySelector('article[data-id="1"]')!;
      const text = extractClassifiableText(article);
      expect(text).toContain('ataki');
    });

    it('combines headline and summary', () => {
      const article = document.querySelector('article[data-id="2"]')!;
      const text = extractClassifiableText(article);
      expect(text).toContain('Prognoza pogody');
      expect(text).toContain('słonecznie');
    });
  });

  describe('isExcluded', () => {
    it('excludes nav elements', () => {
      const nav = document.createElement('nav');
      const link = document.createElement('a');
      nav.appendChild(link);
      document.body.appendChild(nav);
      expect(isExcluded(link)).toBe(true);
    });

    it('does not exclude article elements', () => {
      const article = document.querySelector('article')!;
      expect(isExcluded(article)).toBe(false);
    });
  });
});
