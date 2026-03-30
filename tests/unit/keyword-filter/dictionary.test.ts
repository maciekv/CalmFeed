import { describe, it, expect } from 'vitest';
import { PL_KEYWORDS, EN_KEYWORDS } from '../../../src/constants/keywords';

describe('keyword dictionaries', () => {
  describe('PL_KEYWORDS', () => {
    it('has entries for all required negative categories', () => {
      const categories = PL_KEYWORDS.map((e) => e.category);
      expect(categories).toContain('violence');
      expect(categories).toContain('death');
      expect(categories).toContain('disaster');
      expect(categories).toContain('crime');
    });

    it('has all user-specified lemmas', () => {
      const lemmas = PL_KEYWORDS.map((e) => e.lemma);
      expect(lemmas).toContain('wojna');
      expect(lemmas).toContain('śmierć');
      expect(lemmas).toContain('nie żyje');
      expect(lemmas).toContain('wypadek');
      expect(lemmas).toContain('tragedia');
      expect(lemmas).toContain('atak');
      expect(lemmas).toContain('zabójstwo');
      expect(lemmas).toContain('katastrofa');
      expect(lemmas).toContain('pożar');
      expect(lemmas).toContain('ranni');
      expect(lemmas).toContain('ofiary');
    });

    it('has severity between 0 and 1 for all entries', () => {
      for (const entry of PL_KEYWORDS) {
        expect(entry.severity).toBeGreaterThanOrEqual(0);
        expect(entry.severity).toBeLessThanOrEqual(1);
      }
    });

    it('has multiple forms per lemma', () => {
      for (const entry of PL_KEYWORDS) {
        expect(entry.forms.length).toBeGreaterThan(1);
      }
    });

    it('all forms are lowercase', () => {
      for (const entry of PL_KEYWORDS) {
        for (const form of entry.forms) {
          expect(form).toBe(form.toLowerCase());
        }
      }
    });
  });

  describe('EN_KEYWORDS', () => {
    it('has entries for main categories', () => {
      const categories = EN_KEYWORDS.map((e) => e.category);
      expect(categories).toContain('violence');
      expect(categories).toContain('death');
      expect(categories).toContain('disaster');
      expect(categories).toContain('crime');
    });
  });
});
