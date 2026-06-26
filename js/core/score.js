import { RULE_WEIGHTS, SEVERITY_BASE_SCORE } from './ruleWeights.js';

export const RISK_LEVELS = {
  SAFE: { key: 'SAFE', label: 'Safe', min: 0, max: 0 },
  LOW: { key: 'LOW', label: 'Low Risk', min: 1, max: 20 },
  MEDIUM: { key: 'MEDIUM', label: 'Medium Risk', min: 21, max: 40 },
  HIGH: { key: 'HIGH', label: 'High Risk', min: 41, max: 70 },
  CRITICAL: { key: 'CRITICAL', label: 'Critical Risk', min: 71, max: 100 },
};

const RECOMMENDATIONS = {
  SAFE: 'No phishing indicators detected by this rule set. Still apply normal browsing caution — absence of red flags is not a guarantee of safety.',
  LOW: 'Minor indicators present. Likely benign, but verify the destination before entering credentials or payment details.',
  MEDIUM: 'Several indicators suggest this URL deserves a closer look before you trust it. Avoid entering sensitive information until you have verified the source.',
  HIGH: 'Multiple strong phishing indicators detected. Do not enter credentials, payment information, or personal data. Verify through an official channel before proceeding.',
  CRITICAL: 'This URL matches patterns strongly associated with phishing or malicious intent. Do not visit, do not enter any information, and report it if it arrived via email or message.',
};

function levelForScore(score) {
  if (score <= 0) return RISK_LEVELS.SAFE;
  if (score <= 20) return RISK_LEVELS.LOW;
  if (score <= 40) return RISK_LEVELS.MEDIUM;
  if (score <= 70) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

/**
 * @param {Array<{ruleId: string, severity: 'low'|'medium'|'high'|'critical'}>} findings
 *        Already-suppressed findings (see ruleDependencies.js) — score.js
 *        does not de-duplicate, it just sums what it's given.
 */
export function calculateScore(findings) {
  let raw = 0;
  const contributions = [];

  for (const finding of findings) {
    const base = SEVERITY_BASE_SCORE[finding.severity] ?? 0;
    const weight = RULE_WEIGHTS[finding.ruleId] ?? 1;
    const contribution = base * weight;
    raw += contribution;
    contributions.push({ ruleId: finding.ruleId, contribution: Math.round(contribution * 10) / 10 });
  }

  const score = Math.min(100, Math.round(raw));
  const level = levelForScore(score);

  return {
    score,
    level: level.key,
    levelLabel: level.label,
    recommendation: RECOMMENDATIONS[level.key],
    contributions,
  };
}
