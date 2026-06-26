export const id = 'DANGEROUS_PROTOCOL';

const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

export function check(ctx) {
  if (!DANGEROUS_PROTOCOLS.includes(ctx.protocol)) return null;

  return {
    ruleId: id,
    title: `Dangerous "${ctx.protocol}" Protocol`,
    description: `This is not a normal web link — it uses the "${ctx.protocol}" scheme, which executes code or renders arbitrary content directly rather than navigating to a page.`,
    recommendation: 'Never click or paste links using this scheme from an untrusted source. This is a common vector for self-XSS and clipboard-injection scams.',
    severity: 'critical',
  };
}
