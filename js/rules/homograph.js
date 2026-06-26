import { CONFUSABLES_MAP, detectScripts } from '../data/confusables.js';

export const id = 'HOMOGRAPH';

/**
 * The real-world signature of a homograph attack is mixing scripts within
 * one label (a couple of Cyrillic/Greek look-alikes dropped into an
 * otherwise-Latin domain) — attackers rarely go fully non-Latin because that
 * looks obviously foreign rather than identical to the target brand.
 */
export function check(ctx) {
  if (!ctx.rawHostname || ctx.isIpHost) return null;

  const raw = ctx.rawHostname;
  const confusableChars = [...raw].filter((ch) => CONFUSABLES_MAP[ch]);
  const scripts = detectScripts(raw);
  const hasMixedScript = scripts.has('latin') && scripts.size > 1;

  if (confusableChars.length > 0 && hasMixedScript) {
    const uniqueConfusables = [...new Set(confusableChars)];
    const lookalikes = uniqueConfusables.map((ch) => `"${ch}"→"${CONFUSABLES_MAP[ch]}"`).join(', ');
    return {
      ruleId: id,
      title: 'Homograph / Confusable Character Attack',
      description: `This hostname mixes ordinary Latin letters with visually identical characters from another script: ${lookalikes}. This substitution is a deliberate technique to make a malicious domain look identical to a trusted one.`,
      recommendation: 'Never trust this domain by sight alone. Copy the hostname into a plain-text editor or an IDN-homograph checker to reveal the real underlying characters.',
      severity: 'critical',
    };
  }

  if (hasMixedScript) {
    return {
      ruleId: id,
      title: 'Mixed-Script Hostname',
      description: `This hostname mixes characters from multiple writing systems (${[...scripts].join(', ')}). Legitimate single domains are almost always one consistent script — mixing is far more common in spoofing attempts.`,
      recommendation: 'Verify the exact characters before trusting this domain.',
      severity: 'high',
    };
  }

  return null;
}
