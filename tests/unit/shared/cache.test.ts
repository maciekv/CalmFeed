import { describe, it, expect } from 'vitest';
import { ClassificationCache } from '../../../src/shared/cache';

describe('ClassificationCache', () => {
  it('stores and retrieves entries', () => {
    const cache = new ClassificationCache();
    const entry = {
      isNegative: true,
      score: 0.9,
      topLabel: 'violence',
      source: 'keyword' as const,
      timestamp: Date.now(),
    };

    cache.set('test text', entry);
    const result = cache.get('test text');
    expect(result).toEqual(entry);
  });

  it('returns null for missing entries', () => {
    const cache = new ClassificationCache();
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('respects max entries (LRU eviction)', () => {
    const cache = new ClassificationCache(3);
    const makeEntry = (label: string) => ({
      isNegative: true,
      score: 0.5,
      topLabel: label,
      source: 'keyword' as const,
      timestamp: Date.now(),
    });

    cache.set('a', makeEntry('a'));
    cache.set('b', makeEntry('b'));
    cache.set('c', makeEntry('c'));
    cache.set('d', makeEntry('d')); // should evict 'a'

    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).not.toBeNull();
    expect(cache.get('d')).not.toBeNull();
    expect(cache.size).toBe(3);
  });

  it('refreshes recently accessed entries (LRU)', () => {
    const cache = new ClassificationCache(3);
    const makeEntry = (label: string) => ({
      isNegative: true,
      score: 0.5,
      topLabel: label,
      source: 'keyword' as const,
      timestamp: Date.now(),
    });

    cache.set('a', makeEntry('a'));
    cache.set('b', makeEntry('b'));
    cache.set('c', makeEntry('c'));

    // Access 'a' to make it recently used
    cache.get('a');

    cache.set('d', makeEntry('d')); // should evict 'b' (least recently used)

    expect(cache.get('a')).not.toBeNull();
    expect(cache.get('b')).toBeNull();
  });

  it('clears all entries', () => {
    const cache = new ClassificationCache();
    cache.set('test', {
      isNegative: true,
      score: 0.9,
      topLabel: 'test',
      source: 'keyword',
      timestamp: Date.now(),
    });
    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get('test')).toBeNull();
  });

  it('handles identical texts (same hash)', () => {
    const cache = new ClassificationCache();
    const entry1 = { isNegative: true, score: 0.5, topLabel: 'a', source: 'keyword' as const, timestamp: 1 };
    const entry2 = { isNegative: false, score: 0.1, topLabel: 'b', source: 'ml' as const, timestamp: 2 };

    cache.set('same text', entry1);
    cache.set('same text', entry2);

    expect(cache.get('same text')?.topLabel).toBe('b');
  });
});
