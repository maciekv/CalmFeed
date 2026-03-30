import { ALL_KEYWORDS, type KeywordEntry } from '../constants/keywords';
import { compileDictionary, matchKeywords, type KeywordMatch } from './matcher';

type CompiledDict = ReturnType<typeof compileDictionary>;

export class KeywordFilter {
  private dictionary: CompiledDict;

  constructor(language: string, customKeywords: string[] = []) {
    const entries = this.getEntries(language);
    this.dictionary = compileDictionary(entries, customKeywords);
  }

  match(text: string, threshold: number): KeywordMatch {
    return matchKeywords(text, this.dictionary, threshold);
  }

  private getEntries(language: string): KeywordEntry[] {
    if (language === 'auto') {
      return Object.values(ALL_KEYWORDS).flat();
    }
    return ALL_KEYWORDS[language] ?? Object.values(ALL_KEYWORDS).flat();
  }
}

export type { KeywordMatch } from './matcher';
