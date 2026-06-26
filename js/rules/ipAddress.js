export const id = 'IP_ADDRESS_HOST';

/**
 * Legitimate sites almost never expose an IP address directly to end users —
 * it skips DNS entirely and is a longstanding way to dodge domain-based
 * blocklists and certificate-name checks.
 */
export function check(ctx) {
  if (!ctx.isIpHost) return null;

  return {
    ruleId: id,
    title: 'IP Address Used as Host',
    description: `The link points directly to an IP address (${ctx.ipVersion === 'v6' ? 'IPv6' : 'IPv4'}: ${ctx.hostname}) instead of a domain name. This bypasses DNS-based reputation and blocklist checks entirely.`,
    recommendation: 'Treat raw-IP links with strong suspicion, especially in emails or messages. Legitimate services almost always use a named domain.',
    severity: 'high',
  };
}
