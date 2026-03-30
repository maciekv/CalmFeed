import './content.css';
import { scanPage } from './scanner';
import { createContentObserver } from './observer';
import { processElement } from './element-processor';
import { countHidden } from './dom-mutator';
import { KeywordFilter } from '../keyword-filter';
import { ClassificationCache } from '../shared/cache';
import { loadSettings, onSettingsChanged } from '../shared/storage';
import { sendMessage, isContextValid } from '../shared/message-bus';
import { logger } from '../shared/logger';

async function main() {
  if (!isContextValid()) return;

  const settings = await loadSettings();

  if (!settings.enabled) return;
  if (settings.whitelist.includes(window.location.hostname)) return;

  const keywordFilter = new KeywordFilter(settings.language, settings.customKeywords);
  const cache = new ClassificationCache();

  const processElements = async (elements: Element[]) => {
    for (const el of elements) {
      processElement(el, settings, cache, keywordFilter).catch((err) => {
        logger.warn('Error processing element:', err);
      });
    }

    setTimeout(() => {
      const count = countHidden();
      sendMessage({ type: 'UPDATE_BADGE', payload: { count } }).catch(() => {});
    }, 500);
  };

  const initialElements = scanPage();
  await processElements(initialElements);

  createContentObserver((elements) => {
    processElements(elements);
  });

  onSettingsChanged((newSettings) => {
    Object.assign(settings, newSettings);
  });

  logger.log(`Initialized (mode: ${settings.mode}, threshold: ${settings.threshold})`);
}

main().catch((err) => logger.error('Failed to initialize:', err));
