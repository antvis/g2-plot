/**
 * @ignore
 * Determines whether between is
 * @param value
 * @param start
 * @param end
 * @returns true if between
 */
export function isBetween(value: number, start: number, end: number): boolean {
  const min = Math.min(start, end);
  const max = Math.max(start, end);

  return value >= min && value <= max;
}
