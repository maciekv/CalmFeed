import { isNewsElement } from './scanner';
import { ALL_SCANNABLE_SELECTORS, ALL_HEADLINE_SELECTORS } from '../constants/selectors';

const ALL_SELECTORS = `${ALL_SCANNABLE_SELECTORS}, ${ALL_HEADLINE_SELECTORS}`;

export function createContentObserver(
  processCallback: (elements: Element[]) => void,
): MutationObserver {
  let pendingElements: Element[] = [];
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const el = node as Element;

        if (isNewsElement(el)) {
          pendingElements.push(el);
        }

        try {
          const children = el.querySelectorAll(ALL_SELECTORS);
          for (const child of children) {
            pendingElements.push(child);
          }
        } catch {
          // querySelectorAll can fail on certain elements
        }
      }
    }

    if (pendingElements.length > 0) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const batch = [...pendingElements];
        pendingElements = [];
        processCallback(batch);
      }, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}
