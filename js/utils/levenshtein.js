/**
 * Classic Levenshtein edit distance between two strings.
 * Uses a single-row dynamic programming pass (O(n*m) time, O(min(n,m)) space).
 * Pure function — no dependency on rule severity/weight concerns.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} minimum number of insert/delete/substitute ops to turn a into b
 */
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Iterate over the shorter string to minimize memory.
  if (a.length > b.length) [a, b] = [b, a];

  let prevRow = new Array(a.length + 1);
  for (let i = 0; i <= a.length; i++) prevRow[i] = i;

  for (let j = 1; j <= b.length; j++) {
    const currRow = new Array(a.length + 1);
    currRow[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[i] = Math.min(
        prevRow[i] + 1, // deletion
        currRow[i - 1] + 1, // insertion
        prevRow[i - 1] + cost // substitution
      );
    }
    prevRow = currRow;
  }

  return prevRow[a.length];
}

/**
 * Normalized similarity in [0, 1], 1 = identical.
 * Useful when comparing brand names of different lengths.
 */
export function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}
