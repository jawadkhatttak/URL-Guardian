export const id = 'INSECURE_PROTOCOL';

export function check(ctx) {
  if (ctx.protocol !== 'http:') return null;

  return {
    ruleId: id,
    title: 'Insecure HTTP Connection',
    description: 'This URL uses unencrypted HTTP rather than HTTPS. Any data submitted on the page can be intercepted or modified in transit.',
    recommendation: 'Avoid entering credentials or personal data on HTTP pages. Look for an HTTPS version of the site instead.',
    severity: 'medium',
  };
}
