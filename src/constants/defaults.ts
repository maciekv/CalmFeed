import type { CalmFeedSettings } from '../types';

export const DEFAULT_SETTINGS: CalmFeedSettings = {
  enabled: true,
  mode: 'balanced',
  threshold: 0.5,
  language: 'auto',
  whitelist: [],
  customKeywords: [],
  showPlaceholders: true,
};
