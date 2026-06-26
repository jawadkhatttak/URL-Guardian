export const id = 'LONG_URL';

const HIGH_THRESHOLD = 150;
const MEDIUM_THRESHOLD = 90;

/**
 * Long URLs aren't inherently malicious (tracking params, deep app links),
 * but excessive length is a known evasion tactic — it pushes the real
 * hostname out of the visible address bar on mobile and buries malicious
 * path/query content.
 */
export function check(ctx) {
  const len = ctx.fullLength;

  if (len >= HIGH_THRESHOLD) {
    return {
      ruleId: id,
      title: 'Unusually Long URL',
      description: `This URL is ${len} characters long. Excessive length is often used to bury malicious content or push the real hostname out of view on mobile screens.`,
      recommendation: 'Inspect the hostname carefully rather than judging the link by its path or query string.',
      severity: 'medium',
    };
  }

  if (len >= MEDIUM_THRESHOLD) {
    return {
      ruleId: id,
      title: 'Long URL',
      description: `This URL is ${len} characters long, longer than typical for a simple link.`,
      recommendation: 'Not alarming on its own, but worth combining with the other findings below before trusting the link.',
      severity: 'low',
    };
  }

  return null;
}
