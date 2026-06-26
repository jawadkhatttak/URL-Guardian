/**
 * Each rule contributes: SEVERITY_BASE[finding.severity] * WEIGHT[rule.id]
 * to the raw score (see score.js). Severity sets the *magnitude class*
 * (how bad this kind of finding is in general); weight is a per-rule
 * multiplier letting you tune how much a specific signal matters relative
 * to the others without restructuring severities.
 *
 * Weights cluster around 1.0. Above 1.0 = this rule's findings should hit
 * harder than its severity alone implies (rules with few false positives,
 * strong standalone phishing signal). Below 1.0 = noisier rules that are
 * useful corroborating evidence but shouldn't dominate the score alone.
 */
export const RULE_WEIGHTS = {
  IP_ADDRESS_HOST: 1.2,
  URL_SHORTENER: 0.9,
  INSECURE_PROTOCOL: 0.8,
  DANGEROUS_PROTOCOL: 1.5,
  LONG_URL: 0.7,
  SUBDOMAIN_ABUSE: 1.0,
  SUSPICIOUS_KEYWORDS: 0.75,
  BRAND_IMPERSONATION: 1.4,
  PUNYCODE: 1.1,
  UNICODE_HOSTNAME: 0.9,
  HOMOGRAPH: 1.3,
  BRAND_TYPOSQUAT: 1.3,
  HIGH_ENTROPY: 0.85,
  REDIRECT_PATTERN: 1.1,
  NON_STANDARD_PORT: 0.9,
  RISKY_FILE_EXTENSION: 1.2,
};

/** Base score contribution per severity tier, before the per-rule weight. */
export const SEVERITY_BASE_SCORE = {
  low: 8,
  medium: 18,
  high: 32,
  critical: 50,
};
