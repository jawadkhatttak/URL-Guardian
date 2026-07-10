import { parseUrl } from './parser.js';
import { calculateScore } from './score.js';
import { applySuppression } from './ruleDependencies.js';
import { RULES } from '../rules/inde.js';

/**
 * Runs the full pipeline for a single URL and returns a self-contained
 * result object that the UI layer can render directly or store in history
 * and replay later without re-running anything.
 *
 * @param {string} rawUrl
 * @returns {object} result
 */
export function analyze(rawUrl) {
  const parsed = parseUrl(rawUrl);

  if (parsed.error) {
    return {
      ok: false,
      error: parsed.error,
      raw: parsed.raw,
    };
  }

  const allFindings = [];
  for (const rule of RULES) {
    let finding = null;
    try {
      finding = rule.check(parsed);
    } catch (err) {
      // A single misbehaving rule should never take down the whole scan.
      console.error(`[analyzer] rule "${rule.id}" threw:`, err);
    }
    if (finding) allFindings.push(finding);
  }

  const { kept, suppressed } = applySuppression(allFindings);
  const scoreResult = calculateScore(kept);

  // Sort by severity for display (critical first), most useful default order.
  const severityRank = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedFindings = [...kept].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    url: parsed.raw,
    details: {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      registeredDomain: parsed.registeredDomain,
      subdomain: parsed.subdomain,
      tld: parsed.tld,
      port: parsed.port,
      explicitPort: parsed.explicitPort,
      isIpHost: parsed.isIpHost,
      pathname: parsed.pathname,
      urlLength: parsed.fullLength,
    },
    findings: sortedFindings,
    suppressedFindings: suppressed,
    score: scoreResult.score,
    level: scoreResult.level,
    levelLabel: scoreResult.levelLabel,
    recommendation: scoreResult.recommendation,
  };
}
