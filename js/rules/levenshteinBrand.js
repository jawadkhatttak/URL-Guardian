import { KNOWN_BRANDS } from '../data/brands.js';
import { levenshtein } from '../utils/levenshtein.js';

export const id = 'BRAND_TYPOSQUAT';

const MIN_BRAND_LENGTH = 4; // skip very short brand names (ups, dhl, dpd...) — too noisy for edit-distance matching
const MAX_DISTANCE = 2;

/**
 * Catches near-miss typosquats that DON'T contain the literal brand token
 * (those are caught by brandImpersonation.js instead) — things like
 * "paypa1.com", "gooogle.com", "micr0soft.com": close enough in edit
 * distance to be obviously deliberate, not a coincidence.
 */
export function check(ctx) {
  if (!ctx.hostname || ctx.isIpHost) return null;

  const regLabel = ctx.registeredDomain.split('.')[0]?.toLowerCase() ?? '';
  if (!regLabel) return null;

  let closest = null;
  for (const brand of KNOWN_BRANDS) {
    if (brand.name.length < MIN_BRAND_LENGTH) continue;
    if (ctx.registeredDomain.toLowerCase() === brand.domain) continue; // the genuine domain

    const distance = levenshtein(regLabel, brand.name);
    const lengthDiffOk = Math.abs(regLabel.length - brand.name.length) <= MAX_DISTANCE;

    if (distance > 0 && distance <= MAX_DISTANCE && lengthDiffOk) {
      if (!closest || distance < closest.distance) {
        closest = { brand, distance };
      }
    }
  }

  if (!closest) return null;

  const severity = closest.distance === 1 ? 'critical' : 'high';
  return {
    ruleId: id,
    title: 'Likely Brand Typosquat',
    description: `"${regLabel}" is only ${closest.distance} character${closest.distance > 1 ? 's' : ''} away from the brand name "${closest.brand.name}" (real domain: ${closest.brand.domain}). An edit distance this small is far more typical of deliberate typosquatting than coincidence.`,
    recommendation: `Compare this domain character-by-character against ${closest.brand.domain}, or just navigate there directly instead of trusting this link.`,
    severity,
  };
}
