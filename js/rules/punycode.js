export const id = 'PUNYCODE';

export function check(ctx) {
  if (!ctx.hostname || ctx.isIpHost) return null;

  const hasPunycode = ctx.labels.some((label) => label.toLowerCase().startsWith('xn--'));
  if (!hasPunycode) return null;

  return {
    ruleId: id,
    title: 'Punycode-Encoded Domain',
    description: 'One or more labels in this hostname are punycode-encoded ("xn--..."), meaning the real domain contains internationalized (non-ASCII) characters. This encoding is frequently used to register domains that render visually identical to a trusted brand.',
    recommendation: 'Check what the decoded characters actually render as in your browser\'s address bar before trusting this domain.',
    severity: 'high',
  };
}
