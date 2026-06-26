import { KNOWN_BRANDS } from '../data/brands.js';

export const id = 'BRAND_IMPERSONATION';

/**
 * Matches the brand name as a whole token bounded by non-alphanumeric
 * characters (or string edges) rather than a raw substring — otherwise
 * short brand names like "ups" would false-positive inside unrelated words
 * like "startups".
 */
function hasBrandToken(hostLower, brandName) {
  const escaped = brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i');
  return re.test(hostLower);
}

export function check(ctx) {
  if (!ctx.hostname || ctx.isIpHost) return null;

  const hostLower = ctx.hostname.toLowerCase();
  const registeredDomainLower = ctx.registeredDomain.toLowerCase();

  for (const brand of KNOWN_BRANDS) {
    // This hostname's registered domain genuinely belongs to the brand — not impersonation.
    if (registeredDomainLower === brand.domain) continue;

    // The brand legitimately operates this whole multi-tenant platform
    // suffix (e.g. GitHub Pages on *.github.io) — every user's subdomain
    // will naturally contain the brand name, and that's not impersonation.
    if (brand.alsoOwns?.includes(ctx.tld.toLowerCase())) continue;

    if (hasBrandToken(hostLower, brand.name)) {
      return {
        ruleId: id,
        title: 'Brand Name Impersonation',
        description: `The hostname references "${brand.name}" but the actual registered domain is "${ctx.registeredDomain}", not ${brand.domain}. Referencing a brand name without owning its domain is a classic impersonation pattern.`,
        recommendation: `If you expect this to be ${brand.name}, type ${brand.domain} directly into your browser instead of following this link.`,
        severity: 'critical',
      };
    }
  }

  return null;
}
