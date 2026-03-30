import type { CalmFeedSettings } from './settings';

export interface ClassificationResult {
  isNegative: boolean;
  score: number;
  topLabel: string;
  source: 'keyword' | 'ml';
}

export interface FilterStats {
  totalFiltered: number;
  byCategory: Record<string, number>;
  modelStatus: 'idle' | 'loading' | 'ready' | 'error';
  modelProgress: number;
}

export type CalmFeedMessage =
  | { type: 'CLASSIFY_TEXT'; payload: { text: string; elementId: string } }
  | { type: 'CLASSIFY_RESULT'; payload: ClassificationResult & { elementId: string } }
  | { type: 'UPDATE_BADGE'; payload: { count: number } }
  | { type: 'GET_SETTINGS' }
  | { type: 'SET_SETTINGS'; payload: CalmFeedSettings }
  | { type: 'SETTINGS_CHANGED'; payload: CalmFeedSettings }
  | { type: 'MODEL_LOAD_PROGRESS'; payload: { status: string; progress: number } }
  | { type: 'GET_MODEL_STATUS' }
  | { type: 'GET_STATS' }
  | { type: 'STATS_RESPONSE'; payload: FilterStats };
