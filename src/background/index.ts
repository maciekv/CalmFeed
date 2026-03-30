import { handleMessage } from './message-handler';
import { OffscreenManager } from './offscreen-manager';
import { BadgeManager } from './badge-manager';
import { logger } from '../shared/logger';

const offscreen = new OffscreenManager();
const badge = new BadgeManager();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'offscreen' || message.type === 'OFFSCREEN_READY') return;

  handleMessage(message, sender, sendResponse, offscreen, badge).catch((err) => {
    logger.error('Message handler error:', err);
    sendResponse(null);
  });

  return true;
});

setInterval(() => offscreen.checkIdleTimeout(), 60_000);

logger.log('Service worker started');
