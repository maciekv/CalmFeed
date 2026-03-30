import { h } from 'preact';

interface StatsDisplayProps {
  modelStatus: string;
  modelProgress: number;
}

export function StatsDisplay({ modelStatus, modelProgress }: StatsDisplayProps) {
  const statusLabels: Record<string, string> = {
    idle: 'Nieaktywny',
    loading: 'Ladowanie modelu...',
    ready: 'Gotowy',
    error: 'Blad',
    initiate: 'Inicjalizacja...',
    download: 'Pobieranie...',
    progress: 'Ladowanie...',
    done: 'Gotowy',
  };

  const label = statusLabels[modelStatus] ?? modelStatus;

  return (
    <div class="stats-display">
      <label class="section-label">Model AI</label>
      <div class="model-status">
        <span class={`status-dot ${modelStatus === 'done' || modelStatus === 'ready' ? 'ready' : ''}`} />
        <span>{label}</span>
        {modelProgress > 0 && modelProgress < 100 && (
          <span class="progress-text">{Math.round(modelProgress)}%</span>
        )}
      </div>
      {modelProgress > 0 && modelProgress < 100 && (
        <div class="progress-bar">
          <div class="progress-fill" style={{ width: `${modelProgress}%` }} />
        </div>
      )}
    </div>
  );
}
