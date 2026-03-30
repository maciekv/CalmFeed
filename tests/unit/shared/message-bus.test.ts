import { describe, it, expect, vi } from 'vitest';
import { sendMessage, onMessage } from '../../../src/shared/message-bus';

describe('message-bus', () => {
  it('sendMessage calls chrome.runtime.sendMessage', async () => {
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ ok: true });
    const result = await sendMessage({ type: 'GET_SETTINGS' });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: 'GET_SETTINGS' });
    expect(result).toEqual({ ok: true });
  });

  it('onMessage registers a listener', () => {
    const handler = vi.fn();
    onMessage(handler);
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(handler);
  });
});
