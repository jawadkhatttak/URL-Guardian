export const id = 'SUBDOMAIN_ABUSE';

/**
 * Two distinct abuse patterns share this rule:
 *  1. Depth abuse: stacking many subdomain labels to push the real
 *     registered domain out of the visible part of the address bar.
 *  2. Label mimicry: a single long, hyphen-heavy subdomain label crafted to
 *     *look* like a full domain at a glance (e.g. "paypal-secure-login" in
 *     front of the attacker's real domain).
 */
export function check(ctx) {
  if (ctx.isIpHost || ctx.subdomainLabels.length === 0) return null;

  const labels = ctx.subdomainLabels;
  const longestLabel = labels.reduce((a, b) => (b.length > a.length ? b : a), '');
  const hyphenCount = (longestLabel.match(/-/g) || []).length;

  if (longestLabel.length >= 18 && hyphenCount >= 2) {
    return {
      ruleId: id,
      title: 'Deceptive Subdomain Label',
      description: `The subdomain "${longestLabel}" is long and hyphen-heavy, a pattern commonly used to make a subdomain visually resemble a full, trustworthy domain name (e.g. "secure-login-paypal").`,
      recommendation: `Compare the actual registered domain ("${ctx.registeredDomain}") to what you'd expect — the subdomain label can say anything regardless of who owns the domain.`,
      severity: 'high',
    };
  }

  if (labels.length >= 4) {
    return {
      ruleId: id,
      title: 'Excessive Subdomain Depth',
      description: `This hostname stacks ${labels.length} subdomain labels in front of "${ctx.registeredDomain}", which can push the real domain out of view, especially on mobile address bars.`,
      recommendation: 'Read the hostname from right to left — the registered domain is what actually controls this site, not the leftmost labels.',
      severity: 'medium',
    };
  }

  if (labels.length === 3) {
    return {
      ruleId: id,
      title: 'Multiple Subdomain Levels',
      description: `This hostname has ${labels.length} subdomain labels in front of "${ctx.registeredDomain}". Not unusual on its own, but worth noting alongside other findings.`,
      recommendation: 'Confirm the registered domain is one you actually recognize and trust.',
      severity: 'low',
    };
  }

  return null;
}
