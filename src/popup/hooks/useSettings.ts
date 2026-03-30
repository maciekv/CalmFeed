import { useState, useEffect } from 'preact/hooks';
import type { CalmFeedSettings } from '../../types';
import { loadSettings, saveSettings, onSettingsChanged } from '../../shared/storage';

export function useSettings(): [CalmFeedSettings | null, (s: CalmFeedSettings) => Promise<void>] {
  const [settings, setSettings] = useState<CalmFeedSettings | null>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
    onSettingsChanged(setSettings);
  }, []);

  const update = async (newSettings: CalmFeedSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  return [settings, update];
}
