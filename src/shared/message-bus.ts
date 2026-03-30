import type { CalmFeedMessage } from '../types';

export function isContextValid(): boolean {
  return !!(chrome.runtime && chrome.runtime.id);
}

export function sendMessage(message: CalmFeedMessage): Promise<unknown> {
  if (!isContextValid()) return Promise.resolve(null);
  return chrome.runtime.sendMessage(message);
}

export function onMessage(
  handler: (
    message: CalmFeedMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void,
  ) => boolean | void,
): void {
  chrome.runtime.onMessage.addListener(handler);
}
