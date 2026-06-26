/**
 * Small confusables table covering the characters actually used in real
 * homograph phishing campaigns (Cyrillic/Greek look-alikes of Latin letters).
 * This is a practical subset, not the full Unicode Consortium confusables.txt
 * (that file has thousands of entries across dozens of scripts).
 *
 * Maps a confusable character -> the Latin letter it impersonates.
 */
export const CONFUSABLES_MAP = {
  // Cyrillic look-alikes
  'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
  'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O',
  'Р': 'P', 'С': 'C', 'Т': 'T', 'Х': 'X', 'і': 'i', 'ѕ': 's', 'ј': 'j',
  // Greek look-alikes
  'α': 'a', 'ο': 'o', 'ρ': 'p', 'υ': 'u', 'ν': 'v', 'τ': 't', 'ι': 'i',
  'Α': 'A', 'Β': 'B', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Ι': 'I', 'Κ': 'K',
  'Μ': 'M', 'Ν': 'N', 'Ο': 'O', 'Ρ': 'P', 'Τ': 'T', 'Υ': 'Y', 'Χ': 'X',
};

/**
 * Coarse Unicode script ranges used to flag *mixed-script* hostnames
 * (e.g. Latin letters combined with a Cyrillic letter in the same label),
 * which is the real-world signature of most homograph attacks — attackers
 * rarely go full non-Latin because it looks obviously foreign; they swap in
 * one or two confusable characters.
 */
const SCRIPT_RANGES = [
  { name: 'latin', regex: /[A-Za-z]/ },
  { name: 'cyrillic', regex: /[\u0400-\u04FF]/ },
  { name: 'greek', regex: /[\u0370-\u03FF]/ },
  { name: 'armenian', regex: /[\u0530-\u058F]/ },
  { name: 'hebrew', regex: /[\u0590-\u05FF]/ },
  { name: 'arabic', regex: /[\u0600-\u06FF]/ },
  { name: 'cjk', regex: /[\u4E00-\u9FFF]/ },
];

/** Returns the set of script names present in a string. */
export function detectScripts(str) {
  const found = new Set();
  for (const ch of str) {
    for (const script of SCRIPT_RANGES) {
      if (script.regex.test(ch)) {
        found.add(script.name);
        break;
      }
    }
  }
  return found;
}

/** True if the string contains any non-ASCII character at all. */
export function hasNonAscii(str) {
  return /[^\x00-\x7F]/.test(str);
}
