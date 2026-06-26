import { shannonEntropy } from '../utils/entropyMath.js';

export const id = 'HIGH_ENTROPY';

const MIN_LABEL_LENGTH = 10; // too short and entropy math gets noisy/meaningless
const HIGH_THRESHOLD = 4.0; // bits/char
const MEDIUM_THRESHOLD = 3.5;

/**
 * Random-looking domain labels are the fingerprint of algorithmically
 * generated domains (DGA malware C2 infrastructure, bulk-registered
 * phishing kits). Natural-language words/brand names sit meaningfully lower
 * on the entropy scale than uniformly-random alphanumeric strings.
 */
export function check(ctx) {
  if (!ctx.hostname || ctx.isIpHost) return null;

  const label = ctx.registeredDomain.split('.')[0] || '';
  if (label.length < MIN_LABEL_LENGTH) return null;

  const entropy = shannonEntropy(label.toLowerCase());

  if (entropy >= HIGH_THRESHOLD) {
    return {
      ruleId: id,
      title: 'High-Entropy Domain Label',
      description: `The domain label "${label}" has unusually high character randomness (entropy ≈ ${entropy.toFixed(2)} bits/char). Random-looking domain names are a common signature of algorithmically-generated phishing or malware infrastructure.`,
      recommendation: 'Domains that look randomly generated deserve extra suspicion, especially combined with the other findings here.',
      severity: 'medium',
    };
  }

  if (entropy >= MEDIUM_THRESHOLD) {
    return {
      ruleId: id,
      title: 'Elevated Domain Randomness',
      description: `The domain label "${label}" is more random-looking than a typical natural-language domain name (entropy ≈ ${entropy.toFixed(2)} bits/char).`,
      recommendation: 'Not conclusive by itself — weigh it against the other findings.',
      severity: 'low',
    };
  }

  return null;
}
