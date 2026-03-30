import { h } from 'preact';
import { useState } from 'preact/hooks';

interface WhitelistManagerProps {
  whitelist: string[];
  onChange: (whitelist: string[]) => void;
}

export function WhitelistManager({ whitelist, onChange }: WhitelistManagerProps) {
  const [input, setInput] = useState('');

  const addDomain = () => {
    const domain = input.trim().toLowerCase();
    if (domain && !whitelist.includes(domain)) {
      onChange([...whitelist, domain]);
      setInput('');
    }
  };

  const removeDomain = (domain: string) => {
    onChange(whitelist.filter((d) => d !== domain));
  };

  return (
    <div class="whitelist-manager">
      <label class="section-label">Whitelist (nie filtruj)</label>
      <div class="whitelist-input">
        <input
          type="text"
          placeholder="np. sport.tvn24.pl"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === 'Enter' && addDomain()}
        />
        <button onClick={addDomain} class="add-btn">+</button>
      </div>
      {whitelist.length > 0 && (
        <ul class="whitelist-items">
          {whitelist.map((domain) => (
            <li key={domain}>
              <span>{domain}</span>
              <button onClick={() => removeDomain(domain)} class="remove-btn">x</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
