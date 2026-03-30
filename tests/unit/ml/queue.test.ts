import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/ml/classifier', () => ({
  classifyText: vi.fn(),
}));

import { ClassificationQueue } from '../../../src/ml/queue';
import { classifyText } from '../../../src/ml/classifier';

describe('ClassificationQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enqueues and processes items', async () => {
    vi.mocked(classifyText).mockResolvedValue({
      isNegative: true,
      score: 0.8,
      topLabel: 'violence',
    });

    const queue = new ClassificationQueue();
    const result = await queue.enqueue('id-1', 'Wojna w Ukrainie');

    expect(result.isNegative).toBe(true);
    expect(result.score).toBe(0.8);
    expect(classifyText).toHaveBeenCalledWith('Wojna w Ukrainie');
  });

  it('processes multiple items', async () => {
    let callCount = 0;
    vi.mocked(classifyText).mockImplementation(async () => {
      callCount++;
      return {
        isNegative: callCount % 2 === 0,
        score: 0.5,
        topLabel: 'test',
      };
    });

    const queue = new ClassificationQueue();
    const results = await Promise.all([
      queue.enqueue('id-1', 'text1'),
      queue.enqueue('id-2', 'text2'),
      queue.enqueue('id-3', 'text3'),
    ]);

    expect(results).toHaveLength(3);
    expect(classifyText).toHaveBeenCalledTimes(3);
  });

  it('handles classification errors gracefully', async () => {
    vi.mocked(classifyText).mockRejectedValue(new Error('Model failed'));

    const queue = new ClassificationQueue();
    await expect(queue.enqueue('id-1', 'bad text')).rejects.toThrow('Model failed');
  });
});
