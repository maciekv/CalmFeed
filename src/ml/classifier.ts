import { pipeline, env } from '@huggingface/transformers';
import { NEGATIVE_LABELS, NEUTRAL_LABEL, ALL_LABELS } from './labels';
import { isContextValid } from '../shared/message-bus';
import { logger } from '../shared/logger';

// Use locally bundled WASM files instead of CDN (required for Chrome extension CSP)
env.allowLocalModels = false;
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('wasm/');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let classifierInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadingPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getClassifier(): Promise<any> {
  if (classifierInstance) return classifierInstance;

  if (loadingPromise) return loadingPromise;

  loadingPromise = pipeline(
    'zero-shot-classification',
    'Xenova/mobilebert-uncased-mnli',
    {
      progress_callback: (progress: { status: string; progress?: number }) => {
        if (!isContextValid()) return;
        chrome.runtime.sendMessage({
          type: 'MODEL_LOAD_PROGRESS',
          payload: {
            status: progress.status,
            progress: progress.progress ?? 0,
          },
        }).catch(() => {});
      },
    },
  );

  classifierInstance = await loadingPromise;
  loadingPromise = null;
  logger.log('ML model loaded');

  return classifierInstance;
}

export interface MLClassificationResult {
  isNegative: boolean;
  score: number;
  topLabel: string;
}

export async function classifyText(text: string): Promise<MLClassificationResult> {
  const classifier = await getClassifier();

  const result = await classifier(text, ALL_LABELS, {
    multi_label: false,
  });

  const labels: string[] = Array.isArray(result)
    ? (result[0] as { labels: string[] }).labels
    : (result as { labels: string[] }).labels;
  const scores: number[] = Array.isArray(result)
    ? (result[0] as { scores: number[] }).scores
    : (result as { scores: number[] }).scores;

  const neutralIndex = labels.indexOf(NEUTRAL_LABEL);
  const neutralScore = neutralIndex >= 0 ? scores[neutralIndex] : 0;

  let topNegScore = 0;
  let topNegLabel = '';
  for (let i = 0; i < labels.length; i++) {
    if (NEGATIVE_LABELS.includes(labels[i]) && scores[i] > topNegScore) {
      topNegScore = scores[i];
      topNegLabel = labels[i];
    }
  }

  return {
    isNegative: topNegScore > neutralScore,
    score: topNegScore,
    topLabel: topNegLabel || NEUTRAL_LABEL,
  };
}

export function isModelLoaded(): boolean {
  return classifierInstance !== null;
}
