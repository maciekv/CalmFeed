import { h } from 'preact';
import type { FilterMode } from '../../types';

interface ModeSelectorProps {
  mode: FilterMode;
  onChange: (mode: FilterMode) => void;
}

const MODES: { value: FilterMode; label: string; desc: string }[] = [
  { value: 'light', label: 'Light', desc: 'Tylko slowa kluczowe' },
  { value: 'balanced', label: 'Balanced', desc: 'Slowa kluczowe + AI' },
  { value: 'strict', label: 'Strict', desc: 'AI analizuje wszystko' },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div class="mode-selector">
      <label class="section-label">Tryb filtrowania</label>
      <div class="mode-buttons">
        {MODES.map((m) => (
          <button
            key={m.value}
            class={`mode-btn ${mode === m.value ? 'active' : ''}`}
            onClick={() => onChange(m.value)}
            title={m.desc}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
