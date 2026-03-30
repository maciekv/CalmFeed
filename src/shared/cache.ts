export interface CacheEntry {
  isNegative: boolean;
  score: number;
  topLabel: string;
  source: 'keyword' | 'ml';
  timestamp: number;
}

export class ClassificationCache {
  private maxEntries: number;
  private cache = new Map<string, CacheEntry>();

  constructor(maxEntries = 2000) {
    this.maxEntries = maxEntries;
  }

  get(text: string): CacheEntry | null {
    const key = this.hashText(text);
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.cache.set(key, entry);
      return entry;
    }
    return null;
  }

  set(text: string, entry: CacheEntry): void {
    const key = this.hashText(text);
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, entry);
  }

  get size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }

  private hashText(text: string): string {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash.toString(36);
  }
}
