/**
 * Some rules detect different symptoms of the same root cause. Letting all
 * of them score independently inflates the final number for what is really
 * one signal wearing several hats. Each entry below says: "if `trigger`
 * fired, drop any of `suppresses` from the scoring pass" (the trigger
 * finding itself is always kept — it's just the more specific/severe one).
 */
const SUPPRESSION_RULES = [
  {
    trigger: 'IP_ADDRESS_HOST',
    suppresses: ['SUBDOMAIN_ABUSE', 'BRAND_IMPERSONATION', 'BRAND_TYPOSQUAT', 'SUSPICIOUS_KEYWORDS', 'HIGH_ENTROPY'],
    reason: 'Hostname is a bare IP — domain-name-shape rules are meaningless on it.',
  },
  {
    trigger: 'HOMOGRAPH',
    suppresses: ['UNICODE_HOSTNAME', 'PUNYCODE'],
    reason: 'Homograph is the specific, higher-severity explanation for why this hostname uses non-ASCII/punycode encoding.',
  },
  {
    trigger: 'BRAND_IMPERSONATION',
    suppresses: ['BRAND_TYPOSQUAT'],
    reason: 'An exact brand keyword in the hostname is stronger evidence than a fuzzy near-miss against the same brand.',
  },
  {
    trigger: 'DANGEROUS_PROTOCOL',
    suppresses: ['INSECURE_PROTOCOL', 'NON_STANDARD_PORT'],
    reason: 'javascript:/data: URLs have no meaningful transport security or port to evaluate.',
  },
];

/**
 * @param {Array<{ruleId: string, severity: string, ...}>} findings
 * @returns {{ kept: Array, suppressed: Array }}
 */
export function applySuppression(findings) {
  const presentRuleIds = new Set(findings.map((f) => f.ruleId));
  const toSuppress = new Map(); // ruleId -> reason

  for (const rule of SUPPRESSION_RULES) {
    if (presentRuleIds.has(rule.trigger)) {
      for (const suppressedId of rule.suppresses) {
        if (presentRuleIds.has(suppressedId) && !toSuppress.has(suppressedId)) {
          toSuppress.set(suppressedId, rule.reason);
        }
      }
    }
  }

  const kept = [];
  const suppressed = [];
  for (const finding of findings) {
    if (toSuppress.has(finding.ruleId)) {
      suppressed.push({ ...finding, suppressedReason: toSuppress.get(finding.ruleId) });
    } else {
      kept.push(finding);
    }
  }

  return { kept, suppressed };
}
