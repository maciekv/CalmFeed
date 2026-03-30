import { ClassificationQueue } from '../ml/queue';
import { ClassificationCache } from '../shared/cache';
import { logger } from '../shared/logger';

const queue = new ClassificationQueue();
const cache = new ClassificationCache();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  if (message.type === 'CLASSIFY_TEXT') {
    handleClassification(message.payload)
      .then(sendResponse)
      .catch((err) => {
        logger.error('Classification error:', err);
        sendResponse(null);
      });
    return true;
  }
});

async function handleClassification(payload: {
  text: string;
  elementId: string;
}): Promise<{ isNegative: boolean; score: number; topLabel: string; source: 'ml' }> {
  const cached = cache.get(payload.text);
  if (cached) {
    return {
      isNegative: cached.isNegative,
      score: cached.score,
      topLabel: cached.topLabel,
      source: 'ml',
    };
  }

  const result = await queue.enqueue(payload.elementId, payload.text);

  cache.set(payload.text, {
    ...result,
    source: 'ml',
    timestamp: Date.now(),
  });

  return { ...result, source: 'ml' };
}

// Signal to background that listener is registered and ready
chrome.runtime.sendMessage({ type: 'OFFSCREEN_READY' }).catch(() => {});
logger.log('Offscreen document ready');
