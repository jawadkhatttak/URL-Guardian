import { SUSPICIOUS_HOSTNAME_KEYWORDS } from '../data/suspiciousKeywords.js';

export const id = 'SUSPICIOUS_KEYWORDS';

/**
 * Deliberately scoped to the hostname only. "verify" in a path like
 * /account/verify is completely normal app routing on a legitimate site;
 * "verify" baked into the hostname itself ("verify-account-secure.tk") is
 * not something legitimate companies need to do.
 *
 * Token-exact matches (the keyword is its own hyphen/dot-delimited segment)
 * are weighted higher than substring matches, since substring matching
 * alone produces false positives against real brands/words
 * (e.g. "service" inside "servicenow").
 */
export function check(ctx) {
  if (!ctx.hostname || ctx.isIpHost) return null;

  const hostLower = ctx.hostname.toLowerCase();
  const tokens = hostLower.split(/[^a-z0-9]+/).filter(Boolean);

  const exactMatches = SUSPICIOUS_HOSTNAME_KEYWORDS.filter((kw) => tokens.includes(kw));
  const substringMatches = SUSPICIOUS_HOSTNAME_KEYWORDS.filter(
    (kw) => !exactMatches.includes(kw) && hostLower.includes(kw)
  );

  if (exactMatches.length === 0 && substringMatches.length === 0) return null;

  const weightedCount = exactMatches.length * 1 + substringMatches.length * 0.5;
  const severity = weightedCount >= 3 ? 'high' : weightedCount >= 2 ? 'medium' : 'low';

  const allMatched = [...exactMatches, ...substringMatches];

  return {
    ruleId: id,
    title: 'Suspicious Keyword in Hostname',
    description: `The hostname itself contains term(s) commonly used to manufacture urgency or false trust in phishing domains: ${allMatched.join(', ')}.`,
    recommendation: 'Legitimate organizations rarely need words like these baked into the domain name — this is a social-engineering trick, not a technical one. Treat it as supporting evidence, not a verdict on its own.',
    severity,
  };
}
