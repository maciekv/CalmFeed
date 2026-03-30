import { describe, it, expect } from 'vitest';
import { stemPolish } from '../../../src/keyword-filter/stemmer';

describe('stemPolish', () => {
  it('removes common Polish suffixes', () => {
    expect(stemPolish('korupcji')).toBe('korupcj');
    expect(stemPolish('wojnami')).toBe('wojn');
    expect(stemPolish('katastrofami')).toBe('katastrofami'.slice(0, -3));
  });

  it('does not over-stem short words', () => {
    expect(stemPolish('dom')).toBe('dom');
    expect(stemPolish('kot')).toBe('kot');
  });

  it('handles words with no matching suffix', () => {
    expect(stemPolish('test')).toBe('test');
  });

  it('lowercases input', () => {
    expect(stemPolish('WOJNA')).toBe(stemPolish('wojna'));
  });
});
