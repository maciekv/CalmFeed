import { vi } from 'vitest';

const storageMock = () => ({
  get: vi.fn().mockResolvedValue({}),
  set: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
});

globalThis.chrome = {
  runtime: {
    id: 'fake-extension-id',
    sendMessage: vi.fn().mockResolvedValue(null),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn(),
    },
    getURL: vi.fn((path: string) => `chrome-extension://fakeid/${path}`),
  },
  storage: {
    sync: storageMock(),
    local: storageMock(),
    session: storageMock(),
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  action: {
    setBadgeText: vi.fn().mockResolvedValue(undefined),
    setBadgeBackgroundColor: vi.fn().mockResolvedValue(undefined),
  },
  offscreen: {
    createDocument: vi.fn().mockResolvedValue(undefined),
    hasDocument: vi.fn().mockResolvedValue(false),
    closeDocument: vi.fn().mockResolvedValue(undefined),
    Reason: { WORKERS: 'WORKERS' },
  },
} as unknown as typeof chrome;
