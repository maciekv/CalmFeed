export const PRIMARY_SELECTORS = [
  'article',
  '[role="article"]',
];

export const SECONDARY_SELECTORS = [
  '.article',
  '.post',
  '.story',
  '.news-item',
  '.card',
  '[class*="article"]',
  '[class*="story"]',
  '[class*="news"]',
  '[class*="teaser"]',
  '[class*="entry"]',
  '[data-type="article"]',
];

export const HEADLINE_SELECTORS = [
  'h1',
  'h2',
  'h3',
  '[class*="headline"]',
  '[class*="title"]',
];

export const CONTAINER_SELECTORS = [
  'article',
  '[role="article"]',
  '.article',
  '.post',
  '.story',
  '.news-item',
  '.card',
  '[class*="article"]',
  '[class*="story"]',
  '[class*="teaser"]',
  '[class*="entry"]',
  'li',
];

export const STOP_SELECTORS = [
  'main',
  'body',
  '#content',
  '.content',
  '[role="main"]',
  'section',
];

export const EXCLUDE_SELECTORS = [
  'nav',
  'header:not(article header)',
  'footer',
  'aside',
  '[role="navigation"]',
  '[role="banner"]',
  '.menu',
  '.sidebar',
  '.ad',
  '.advertisement',
  '.cookie',
];

export const ALL_SCANNABLE_SELECTORS = [
  ...PRIMARY_SELECTORS,
  ...SECONDARY_SELECTORS,
].join(', ');

export const ALL_HEADLINE_SELECTORS = HEADLINE_SELECTORS.join(', ');
