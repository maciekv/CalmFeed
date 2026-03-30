import { useState, useEffect } from 'preact/hooks';

interface PopupStats {
  modelStatus: string;
  modelProgress: number;
}

export function useStats(): PopupStats {
  const [stats, setStats] = useState<PopupStats>({
    modelStatus: 'idle',
    modelProgress: 0,
  });

  useEffect(() => {
    // Fetch persisted model status on popup open
    chrome.runtime.sendMessage({ type: 'GET_MODEL_STATUS' }).then((result) => {
      if (result && result.status) {
        setStats({ modelStatus: result.status, modelProgress: result.progress ?? 0 });
      }
    }).catch(() => {});

    // Listen for live updates while popup is open
    const handler = (message: { type: string; payload?: { status: string; progress: number } }) => {
      if (message.type === 'MODEL_LOAD_PROGRESS' && message.payload) {
        setStats({
          modelStatus: message.payload.status,
          modelProgress: message.payload.progress,
        });
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  return stats;
}
