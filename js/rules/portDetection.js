export const id = 'NON_STANDARD_PORT';

const STANDARD_PORTS = { 'http:': '80', 'https:': '443', 'ftp:': '21' };
const COMMONLY_ABUSED_PORTS = new Set(['22', '23', '25', '135', '139', '445', '1433', '3306', '3389', '5900']);

export function check(ctx) {
  if (!ctx.explicitPort) return null; // no port explicitly in the URL, nothing to flag

  const standard = STANDARD_PORTS[ctx.protocol];
  if (ctx.explicitPort === standard) return null;

  const severity = COMMONLY_ABUSED_PORTS.has(ctx.explicitPort) ? 'high' : 'medium';

  return {
    ruleId: id,
    title: 'Non-Standard Port',
    description: `This URL explicitly specifies port ${ctx.explicitPort} instead of the default for ${ctx.protocol.replace(':', '')}. Phishing and malware infrastructure sometimes runs on non-default ports to dodge simple firewall or proxy rules.`,
    recommendation: 'A non-default port is not malicious by itself, but it raises the overall risk when combined with the other findings here.',
    severity,
  };
}
