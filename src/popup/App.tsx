import { h } from 'preact';
import { useSettings } from './hooks/useSettings';
import { useStats } from './hooks/useStats';
import { Toggle } from './components/Toggle';
import { ModeSelector } from './components/ModeSelector';
import { SensitivitySlider } from './components/SensitivitySlider';
import { WhitelistManager } from './components/WhitelistManager';
import { StatsDisplay } from './components/StatsDisplay';
import type { CalmFeedSettings } from '../types';

export function App() {
  const [settings, updateSettings] = useSettings();
  const stats = useStats();

  if (!settings) {
    return <div class="calmfeed-popup loading">Ladowanie...</div>;
  }

  const updateField = <K extends keyof CalmFeedSettings>(key: K, value: CalmFeedSettings[K]) => {
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <div class="calmfeed-popup">
      <header class="popup-header">
        <h1>CalmFeed</h1>
        <Toggle enabled={settings.enabled} onChange={(v) => updateField('enabled', v)} />
      </header>

      {settings.enabled && (
        <>
          <section class="popup-section">
            <ModeSelector mode={settings.mode} onChange={(v) => updateField('mode', v)} />
          </section>

          <section class="popup-section">
            <SensitivitySlider
              value={settings.threshold}
              onChange={(v) => updateField('threshold', v)}
            />
          </section>

          {settings.mode !== 'light' && (
            <section class="popup-section">
              <StatsDisplay
                modelStatus={stats.modelStatus}
                modelProgress={stats.modelProgress}
              />
            </section>
          )}

          <section class="popup-section">
            <WhitelistManager
              whitelist={settings.whitelist}
              onChange={(v) => updateField('whitelist', v)}
            />
          </section>
        </>
      )}

      <footer class="popup-footer">
        <a href="https://github.com/maciekv/CalmFeed" target="_blank" rel="noopener">
          GitHub
        </a>
        <span class="version">v1.0.0</span>
      </footer>
    </div>
  );
}
