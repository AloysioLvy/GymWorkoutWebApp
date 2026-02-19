/**
 * Normalizes an exercise name to be used as a cache key.
 * Strips accents, lowercases, removes non-alphanumeric chars and collapses spaces.
 */
export function normalizeExerciseName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
