import type { KeywordEntry } from '../constants/keywords';
import { stemPolish } from './stemmer';

export interface KeywordMatch {
  matched: boolean;
  keyword?: string;
  severity?: number;
  category?: string;
}

interface CompiledDictionary {
  singleWords: Map<string, { severity: number; category: string; lemma: string }>;
  multiWordPatterns: { pattern: string; severity: number; category: string; lemma: string }[];
  customStems: Map<string, { severity: number; category: string }>;
}

export function compileDictionary(
  entries: KeywordEntry[],
  customKeywords: string[] = [],
): CompiledDictionary {
  const singleWords = new Map<string, { severity: number; category: string; lemma: string }>();
  const multiWordPatterns: CompiledDictionary['multiWordPatterns'] = [];

  for (const entry of entries) {
    for (const form of entry.forms) {
      const lower = form.toLowerCase();
      if (lower.includes(' ')) {
        multiWordPatterns.push({
          pattern: lower,
          severity: entry.severity,
          category: entry.category,
          lemma: entry.lemma,
        });
      } else {
        singleWords.set(lower, {
          severity: entry.severity,
          category: entry.category,
          lemma: entry.lemma,
        });
      }
    }
  }

  const customStems = new Map<string, { severity: number; category: string }>();
  for (const kw of customKeywords) {
    const stem = stemPolish(kw);
    customStems.set(stem, { severity: 0.8, category: 'custom' });
  }

  return { singleWords, multiWordPatterns, customStems };
}

export function matchKeywords(
  text: string,
  dictionary: CompiledDictionary,
  threshold: number,
): KeywordMatch {
  const normalized = text.toLowerCase();

  for (const mwp of dictionary.multiWordPatterns) {
    if (mwp.severity >= threshold && normalized.includes(mwp.pattern)) {
      return {
        matched: true,
        keyword: mwp.lemma,
        severity: mwp.severity,
        category: mwp.category,
      };
    }
  }

  const words = normalized.match(/[\p{L}\p{N}]+/gu) ?? [];
  for (const word of words) {
    const entry = dictionary.singleWords.get(word);
    if (entry && entry.severity >= threshold) {
      return {
        matched: true,
        keyword: entry.lemma,
        severity: entry.severity,
        category: entry.category,
      };
    }
  }

  if (dictionary.customStems.size > 0) {
    for (const word of words) {
      const stem = stemPolish(word);
      const custom = dictionary.customStems.get(stem);
      if (custom && custom.severity >= threshold) {
        return {
          matched: true,
          keyword: word,
          severity: custom.severity,
          category: custom.category,
        };
      }
    }
  }

  return { matched: false };
}
