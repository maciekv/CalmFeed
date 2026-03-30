import { describe, it, expect } from 'vitest';
import { compileDictionary, matchKeywords } from '../../../src/keyword-filter/matcher';
import { PL_KEYWORDS, EN_KEYWORDS } from '../../../src/constants/keywords';

describe('matchKeywords', () => {
  const plDict = compileDictionary(PL_KEYWORDS);
  const enDict = compileDictionary(EN_KEYWORDS);

  describe('Polish keywords', () => {
    it('matches "wojna" and all its forms', () => {
      const forms = ['wojna', 'wojny', 'wojnie', 'wojnę', 'wojną', 'wojennym'];
      for (const form of forms) {
        const result = matchKeywords(`Artykuł o ${form} w Europie`, plDict, 0);
        expect(result.matched).toBe(true);
        expect(result.category).toBe('violence');
      }
    });

    it('matches death-related keywords', () => {
      const texts = [
        'Zginął kierowca',
        'Zmarła znana aktorka',
        'Śmierć na drodze',
        'Umarł pacjent w szpitalu',
      ];
      for (const text of texts) {
        const result = matchKeywords(text, plDict, 0);
        expect(result.matched).toBe(true);
        expect(result.category).toBe('death');
      }
    });

    it('matches multi-word pattern "nie żyje"', () => {
      const result = matchKeywords('Kierowca nie żyje po wypadku', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.keyword).toBe('nie żyje');
      expect(result.category).toBe('death');
    });

    it('matches "nie żyją" variant', () => {
      const result = matchKeywords('Dwoje dzieci nie żyją', plDict, 0);
      expect(result.matched).toBe(true);
    });

    it('matches wypadek forms', () => {
      const forms = ['wypadek', 'wypadku', 'wypadki', 'wypadków'];
      for (const form of forms) {
        const result = matchKeywords(`Na drodze doszło do ${form}`, plDict, 0);
        expect(result.matched).toBe(true);
        expect(result.category).toBe('disaster');
      }
    });

    it('matches tragedia forms', () => {
      const result = matchKeywords('Tragiczny finał pościgu policyjnego', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('disaster');
    });

    it('matches atak forms', () => {
      const result = matchKeywords('Atak na cywilów w strefie konfliktu', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('violence');
    });

    it('matches zabójstwo and related forms', () => {
      const texts = [
        'Zabójstwo w centrum miasta',
        'Zamordował sąsiada',
        'Morderstwo w biały dzień',
      ];
      for (const text of texts) {
        const result = matchKeywords(text, plDict, 0);
        expect(result.matched).toBe(true);
        expect(result.category).toBe('crime');
      }
    });

    it('matches katastrofa forms', () => {
      const result = matchKeywords('Katastrofa lotnicza w Alpach', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('disaster');
    });

    it('matches pożar forms', () => {
      const result = matchKeywords('Pożar w kamienicy na Pradze', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('disaster');
    });

    it('matches ranni forms', () => {
      const result = matchKeywords('Rannych zostało 5 osób w zdarzeniu', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('violence');
    });

    it('matches ofiary forms', () => {
      const result = matchKeywords('Liczba ofiar rośnie', plDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('death');
    });
  });

  describe('does NOT match neutral content', () => {
    const neutralTexts = [
      'Prognoza pogody na weekend',
      'Nowy film w kinach',
      'Polska wygrała mecz',
      'Przepis na szarlotkę',
      'Rynek nieruchomości rośnie',
      'Festiwal muzyczny w Sopocie',
    ];

    for (const text of neutralTexts) {
      it(`does not match: "${text}"`, () => {
        const result = matchKeywords(text, plDict, 0);
        expect(result.matched).toBe(false);
      });
    }
  });

  describe('severity threshold', () => {
    it('filters out low-severity matches when threshold is high', () => {
      const result = matchKeywords('Pożar w kamienicy', plDict, 0.8);
      expect(result.matched).toBe(false); // pożar severity = 0.7
    });

    it('includes high-severity matches regardless of threshold', () => {
      const result = matchKeywords('Zabójstwo w parku', plDict, 0.9);
      expect(result.matched).toBe(true); // zabójstwo severity = 1.0
    });
  });

  describe('English keywords', () => {
    it('matches war-related content', () => {
      const result = matchKeywords('War breaks out in the region', enDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('violence');
    });

    it('matches death-related content', () => {
      const result = matchKeywords('Three people killed in accident', enDict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('death');
    });

    it('does not match neutral English', () => {
      const result = matchKeywords('Scientists discover new species', enDict, 0);
      expect(result.matched).toBe(false);
    });
  });

  describe('custom keywords', () => {
    it('matches custom keyword stems', () => {
      const dict = compileDictionary([], ['korupcja']);
      const result = matchKeywords('Korupcji w urzędzie nie będzie', dict, 0);
      expect(result.matched).toBe(true);
      expect(result.category).toBe('custom');
    });
  });

  describe('case insensitivity', () => {
    it('matches regardless of case', () => {
      const result = matchKeywords('WOJNA W UKRAINIE', plDict, 0);
      expect(result.matched).toBe(true);
    });

    it('matches mixed case', () => {
      const result = matchKeywords('Tragiczny Wypadek Na Drodze', plDict, 0);
      expect(result.matched).toBe(true);
    });
  });
});
