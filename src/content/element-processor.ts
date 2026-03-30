import type { CalmFeedSettings } from '../types';
import type { ClassificationResult } from '../types/messages';
import { ClassificationCache, type CacheEntry } from '../shared/cache';
import { KeywordFilter } from '../keyword-filter';
import { sendMessage } from '../shared/message-bus';
import { logger } from '../shared/logger';
import { extractClassifiableText } from './scanner';
import { hideElement } from './dom-mutator';

export async function processElement(
  element: Element,
  settings: CalmFeedSettings,
  cache: ClassificationCache,
  keywordFilter: KeywordFilter,
): Promise<void> {
  if (element.hasAttribute('data-calmfeed-processed')) return;

  const text = extractClassifiableText(element);
  if (!text || text.length < 10) return;

  element.setAttribute('data-calmfeed-processed', 'pending');

  const cached = cache.get(text);
  if (cached) {
    if (cached.isNegative && cached.score >= settings.threshold) {
      hideElement(element, cached);
    }
    element.setAttribute('data-calmfeed-processed', 'done');
    return;
  }

  const keywordResult = keywordFilter.match(text, settings.threshold);
  if (keywordResult.matched) {
    const entry: CacheEntry = {
      isNegative: true,
      score: keywordResult.severity!,
      topLabel: keywordResult.category!,
      source: 'keyword',
      timestamp: Date.now(),
    };
    cache.set(text, entry);
    hideElement(element, entry);
    element.setAttribute('data-calmfeed-processed', 'done');
    return;
  }

  if (settings.mode === 'light') {
    element.setAttribute('data-calmfeed-processed', 'done');
    return;
  }

  element.setAttribute('data-calmfeed-processed', 'analyzing');

  try {
    const mlResult = await sendMessage({
      type: 'CLASSIFY_TEXT',
      payload: { text: text.slice(0, 500), elementId: generateElementId() },
    }) as ClassificationResult | null;

    if (mlResult && mlResult.isNegative && mlResult.score >= settings.threshold) {
      const entry: CacheEntry = {
        isNegative: true,
        score: mlResult.score,
        topLabel: mlResult.topLabel,
        source: 'ml',
        timestamp: Date.now(),
      };
      cache.set(text, entry);
      hideElement(element, entry);
    } else if (mlResult) {
      cache.set(text, {
        isNegative: false,
        score: mlResult.score,
        topLabel: mlResult.topLabel,
        source: 'ml',
        timestamp: Date.now(),
      });
    }
  } catch (err) {
    logger.warn('ML classification failed:', err);
  }

  element.setAttribute('data-calmfeed-processed', 'done');
}

let idCounter = 0;
function generateElementId(): string {
  return `cf-${Date.now()}-${idCounter++}`;
}
