import {
  ALL_SCANNABLE_SELECTORS,
  ALL_HEADLINE_SELECTORS,
  EXCLUDE_SELECTORS,
} from '../constants/selectors';

const EXCLUDE_SELECTOR_COMBINED = EXCLUDE_SELECTORS.join(', ');

export function scanPage(): Element[] {
  const candidates: Element[] = [];
  const seen = new Set<Element>();

  const articles = document.querySelectorAll(ALL_SCANNABLE_SELECTORS);
  for (const el of articles) {
    if (!isExcluded(el) && !seen.has(el)) {
      seen.add(el);
      candidates.push(el);
    }
  }

  const headlines = document.querySelectorAll(ALL_HEADLINE_SELECTORS);
  for (const headline of headlines) {
    if (isExcluded(headline)) continue;
    const container = findArticleContainer(headline);
    if (container && !seen.has(container)) {
      seen.add(container);
      candidates.push(container);
    } else if (!container && !seen.has(headline)) {
      seen.add(headline);
      candidates.push(headline);
    }
  }

  return candidates;
}

export function isExcluded(el: Element): boolean {
  return el.closest(EXCLUDE_SELECTOR_COMBINED) !== null;
}

function findArticleContainer(el: Element): Element | null {
  let current: Element | null = el.parentElement;
  while (current) {
    if (current.matches('article, [role="article"], li') ||
        current.className && /article|story|teaser|entry|card|news|post/i.test(current.className)) {
      return current;
    }
    if (current.matches('main, body, section, [role="main"]')) {
      return null;
    }
    current = current.parentElement;
  }
  return null;
}

export function extractClassifiableText(element: Element): string {
  const headline = element.querySelector('h1, h2, h3, [class*="title"], [class*="headline"]');
  const headlineText = headline?.textContent?.trim() ?? '';

  const summary = element.querySelector(
    'p, [class*="summary"], [class*="description"], [class*="lead"], [class*="excerpt"]',
  );
  const summaryText = summary?.textContent?.trim().slice(0, 200) ?? '';

  const combined = [headlineText, summaryText].filter(Boolean).join('. ');
  return combined || (element.textContent?.trim().slice(0, 300) ?? '');
}

export function isNewsElement(el: Element): boolean {
  if (el.matches(ALL_SCANNABLE_SELECTORS)) return true;
  if (el.matches(ALL_HEADLINE_SELECTORS)) return true;
  return false;
}
