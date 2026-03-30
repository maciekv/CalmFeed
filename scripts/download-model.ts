/**
 * Downloads the ML model for local development.
 * The extension downloads the model on-demand from Hugging Face,
 * but this script allows offline development.
 *
 * Usage: npm run download-model
 */

import { pipeline } from '@huggingface/transformers';

async function main() {
  console.log('Downloading model: Xenova/mobilebert-uncased-mnli...');
  console.log('This will cache the model locally for development.');

  const classifier = await pipeline(
    'zero-shot-classification',
    'Xenova/mobilebert-uncased-mnli',
    {
      progress_callback: (progress: { status: string; progress?: number; file?: string }) => {
        if (progress.progress !== undefined) {
          const pct = Math.round(progress.progress);
          process.stdout.write(`\r  ${progress.status}: ${progress.file ?? ''} ${pct}%`);
        }
      },
    },
  );

  console.log('\n\nModel downloaded. Testing...');

  const result = await classifier(
    'Wojna w Ukrainie trwa. Kolejne ataki na miasta.',
    ['war and conflict', 'neutral news', 'positive news'],
  );

  console.log('Test result:', JSON.stringify(result, null, 2));
  console.log('\nDone! Model is cached and ready for development.');
}

main().catch(console.error);
