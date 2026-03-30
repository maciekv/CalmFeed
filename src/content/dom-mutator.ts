import { CONTAINER_SELECTORS, STOP_SELECTORS } from '../constants/selectors';
import type { CacheEntry } from '../shared/cache';

const CONTAINER_COMBINED = CONTAINER_SELECTORS.join(', ');
const STOP_COMBINED = STOP_SELECTORS.join(', ');

export function findHideTarget(element: Element): Element {
  let current: Element | null = element;
  while (current?.parentElement) {
    const parent: Element = current.parentElement;
    if (parent.matches(CONTAINER_COMBINED)) {
      return parent;
    }
    if (parent.matches(STOP_COMBINED)) {
      return current;
    }
    current = parent;
  }
  return element;
}

export function hideElement(element: Element, result: CacheEntry): void {
  const target = findHideTarget(element);
  if (target.classList.contains('calmfeed-hidden')) return;

  target.classList.add('calmfeed-hidden');
  target.setAttribute('data-calmfeed-category', result.topLabel);

  const placeholder = document.createElement('div');
  placeholder.className = 'calmfeed-placeholder';
  placeholder.setAttribute('data-calmfeed-placeholder', 'true');

  const categoryLabels: Record<string, string> = {
    violence: 'przemoc / wojna',
    death: 'smierc / zgon',
    disaster: 'katastrofa / wypadek',
    crime: 'przestepstwo',
    custom: 'niestandardowe',
  };

  const label = categoryLabels[result.topLabel] ?? result.topLabel;

  placeholder.innerHTML =
    `<span class="calmfeed-placeholder-icon">\u{1F6E1}\u{FE0F}</span>` +
    `<span class="calmfeed-placeholder-text">Ukryto przez CalmFeed (${label})</span>` +
    `<button class="calmfeed-show-btn" data-calmfeed-reveal="true">Pokaz mimo to</button>`;

  const btn = placeholder.querySelector('[data-calmfeed-reveal]');
  btn?.addEventListener('click', () => revealElement(target, placeholder));

  target.insertAdjacentElement('beforebegin', placeholder);
}

export function revealElement(element: Element, placeholder: Element): void {
  element.classList.remove('calmfeed-hidden');
  element.setAttribute('data-calmfeed-processed', 'revealed');
  placeholder.remove();
}

export function countHidden(): number {
  return document.querySelectorAll('.calmfeed-hidden').length;
}
