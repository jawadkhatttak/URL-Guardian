import { hasNonAscii } from '../data/confusables.js';

export const id = 'UNICODE_HOSTNAME';

/**
 * Runs against ctx.rawHostname specifically — by the time the WHATWG URL
 * parser has produced ctx.hostname, any Unicode characters have already
 * been converted to punycode (ASCII). rawHostname is captured before that
 * conversion in parser.js, which is the only reason this rule can see
 * anything at all.
 */
export function check(ctx) {
  if (!ctx.rawHostname || ctx.isIpHost) return null;
  if (!hasNonAscii(ctx.rawHostname)) return null;

  return {
    ruleId: id,
    title: 'Non-ASCII Characters in Hostname',
    description: `The hostname, as typed, contains non-ASCII characters ("${ctx.rawHostname}"). Browsers silently convert these to punycode, but on screen they can be visually indistinguishable from ordinary ASCII letters.`,
    recommendation: 'Verify the exact characters with an IDN-homograph checker before trusting this domain by sight.',
    severity: 'medium',
  };
}
