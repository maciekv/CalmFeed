import { classifyText, type MLClassificationResult } from './classifier';
import { logger } from '../shared/logger';

interface QueueItem {
  id: string;
  text: string;
  resolve: (result: MLClassificationResult) => void;
  reject: (error: Error) => void;
}

export class ClassificationQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private batchSize = 4;
  private batchDelayMs = 50;
  private timeoutMs = 10000;

  enqueue(id: string, text: string): Promise<MLClassificationResult> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, text, resolve, reject });
      this.scheduleBatch();
    });
  }

  private scheduleBatch(): void {
    if (this.processing) return;
    setTimeout(() => this.processBatch(), this.batchDelayMs);
  }

  private async processBatch(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    const batch = this.queue.splice(0, this.batchSize);

    for (const item of batch) {
      try {
        const result = await Promise.race([
          classifyText(item.text),
          this.createTimeout(item.id),
        ]);
        item.resolve(result);
      } catch (err) {
        logger.warn(`Classification timeout/error for ${item.id}:`, err);
        item.reject(err instanceof Error ? err : new Error(String(err)));
      }
    }

    this.processing = false;
    if (this.queue.length > 0) {
      this.scheduleBatch();
    }
  }

  private createTimeout(id: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout classifying ${id}`)), this.timeoutMs);
    });
  }
}
