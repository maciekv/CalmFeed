import { h } from 'preact';

interface SensitivitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function SensitivitySlider({ value, onChange }: SensitivitySliderProps) {
  return (
    <div class="sensitivity-slider">
      <label class="section-label">
        Czulosc: {Math.round(value * 100)}%
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(value * 100)}
        onInput={(e) => onChange(parseInt((e.target as HTMLInputElement).value, 10) / 100)}
        class="slider"
      />
      <div class="slider-labels">
        <span>Mniej filtruje</span>
        <span>Wiecej filtruje</span>
      </div>
    </div>
  );
}
