const PL_SUFFIXES = [
  'ości', 'ość', 'ami', 'ach', 'owi', 'iem',
  'ów', 'om', 'ie', 'ię', 'ią', 'ej', 'ym', 'em',
  'ą', 'ę', 'i', 'y', 'u', 'a', 'e', 'o',
];

const MIN_STEM_LENGTH = 3;

export function stemPolish(word: string): string {
  let stem = word.toLowerCase();
  for (const suffix of PL_SUFFIXES) {
    if (stem.endsWith(suffix) && stem.length - suffix.length >= MIN_STEM_LENGTH) {
      return stem.slice(0, -suffix.length);
    }
  }
  return stem;
}
