export class OffscreenManager {
  private creating: Promise<void> | null = null;
  private lastUsed = 0;
  private idleTimeoutMs = 5 * 60 * 1000;
  private ready = false;
  private readyResolve: (() => void) | null = null;
  private readyPromise: Promise<void> | null = null;

  constructor() {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'OFFSCREEN_READY') {
        this.ready = true;
        this.readyResolve?.();
      }
    });
  }

  async ensureReady(): Promise<void> {
    if (this.ready && await chrome.offscreen.hasDocument()) {
      this.lastUsed = Date.now();
      return;
    }

    if (this.creating) {
      await this.creating;
      await this.readyPromise;
      return;
    }

    this.ready = false;
    this.readyPromise = new Promise<void>((resolve) => {
      this.readyResolve = resolve;
    });

    this.creating = chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.WORKERS],
      justification: 'ML model inference for content classification',
    });

    await this.creating;
    this.creating = null;

    // Wait for offscreen script to signal ready (max 10s)
    await Promise.race([
      this.readyPromise,
      new Promise<void>((resolve) => setTimeout(resolve, 10000)),
    ]);

    this.lastUsed = Date.now();
  }

  async checkIdleTimeout(): Promise<void> {
    if (Date.now() - this.lastUsed > this.idleTimeoutMs) {
      if (await chrome.offscreen.hasDocument()) {
        await chrome.offscreen.closeDocument();
        this.ready = false;
      }
    }
  }
}
