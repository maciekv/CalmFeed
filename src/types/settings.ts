export type FilterMode = 'light' | 'balanced' | 'strict';

export interface CalmFeedSettings {
  enabled: boolean;
  mode: FilterMode;
  threshold: number;
  language: string;
  whitelist: string[];
  customKeywords: string[];
  showPlaceholders: boolean;
}
