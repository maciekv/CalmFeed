import type { CalmFeedSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants/defaults';

export async function loadSettings(): Promise<CalmFeedSettings> {
  const result = await chrome.storage.sync.get('settings');
  return { ...DEFAULT_SETTINGS, ...(result.settings ?? {}) };
}

export async function saveSettings(settings: CalmFeedSettings): Promise<void> {
  await chrome.storage.sync.set({ settings });
}

export function onSettingsChanged(callback: (settings: CalmFeedSettings) => void): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings?.newValue) {
      callback({ ...DEFAULT_SETTINGS, ...changes.settings.newValue });
    }
  });
}
