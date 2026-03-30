export class BadgeManager {
  update(tabId: number | undefined, count: number): void {
    if (!tabId) return;

    const text = count > 0 ? String(count) : '';
    chrome.action.setBadgeText({ text, tabId });
    chrome.action.setBadgeBackgroundColor({ color: count > 0 ? '#ef5350' : '#4caf50', tabId });
  }
}
