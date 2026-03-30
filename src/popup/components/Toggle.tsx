import { h } from 'preact';

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <label class="toggle">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
      />
      <span class="toggle-slider" />
    </label>
  );
}
