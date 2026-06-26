/**
 * Shannon entropy (bits per character) of a string.
 * Random/algorithmically-generated strings (DGA domains, encoded tokens)
 * have high entropy; natural-language words have low-to-moderate entropy.
 *
 * @param {string} str
 * @returns {number} entropy in bits/char, 0 for empty or single-repeated-char strings
 */
export function shannonEntropy(str) {
  if (!str || str.length === 0) return 0;

  const freq = new Map();
  for (const ch of str) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  const len = str.length;
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}
