import type { CalmFeedMessage } from '../types';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import type { OffscreenManager } from './offscreen-manager';
import type { BadgeManager } from './badge-manager';
import { logger } from '../shared/logger';

export async function handleMessage(
  message: CalmFeedMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void,
  offscreen: OffscreenManager,
  badge: BadgeManager,
): Promise<void> {
  switch (message.type) {
    case 'CLASSIFY_TEXT': {
      try {
        await offscreen.ensureReady();
        const result = await chrome.runtime.sendMessage({
          target: 'offscreen',
          ...message,
        });
        sendResponse(result);
      } catch (err) {
        logger.error('Classification failed:', err);
        sendResponse(null);
      }
      break;
    }

    case 'UPDATE_BADGE': {
      badge.update(sender.tab?.id, message.payload.count);
      sendResponse({ ok: true });
      break;
    }

    case 'GET_SETTINGS': {
      const stored = await chrome.storage.sync.get('settings');
      sendResponse(stored.settings ?? DEFAULT_SETTINGS);
      break;
    }

    case 'SET_SETTINGS': {
      await chrome.storage.sync.set({ settings: message.payload });
      sendResponse({ ok: true });
      break;
    }

    case 'MODEL_LOAD_PROGRESS': {
      chrome.storage.session.set({ modelStatus: message.payload });
      chrome.runtime.sendMessage(message).catch(() => {});
      sendResponse({ ok: true });
      break;
    }

    case 'GET_MODEL_STATUS': {
      const data = await chrome.storage.session.get('modelStatus');
      sendResponse(data.modelStatus ?? { status: 'idle', progress: 0 });
      break;
    }

    default:
      sendResponse(null);
  }
}
