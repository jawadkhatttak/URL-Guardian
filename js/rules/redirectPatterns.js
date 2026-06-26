const REDIRECT_PARAM_NAMES = [
  'redirect', 'url', 'next', 'return', 'return_url', 'returnurl', 'redirect_uri',
  'redirecturi', 'continue', 'dest', 'destination', 'goto', 'target', 'redirect_to',
  'rurl', 'r',
];

export const id = 'REDIRECT_PATTERN';

export function check(ctx) {
  // Classic trick: http://trusted-looking-text@actual-attacker-domain.com/
  // Browsers ignore everything before "@" as HTTP Basic Auth userinfo, so the
  // "trusted-looking-text" is purely cosmetic.
  if (ctx.rawUserinfo) {
    return {
      ruleId: id,
      title: '"@" Userinfo Redirect Trick',
      description: `The URL contains an "@" before the real host. Browsers treat everything before "@" ("${ctx.rawUserinfo}") as login text, not the destination — it's cosmetic, meant to make you think you're visiting "${ctx.rawUserinfo}" when the real destination is "${ctx.hostname}".`,
      recommendation: `Ignore the text before "@" entirely — the actual destination is "${ctx.hostname}".`,
      severity: 'critical',
    };
  }

  if (!ctx.search) return null;

  let params;
  try {
    params = new URLSearchParams(ctx.search);
  } catch {
    return null;
  }

  for (const [key, value] of params.entries()) {
    if (!REDIRECT_PARAM_NAMES.includes(key.toLowerCase())) continue;
    const looksLikeUrl = /^https?:\/\//i.test(value) || /%2f%2f/i.test(value) || value.includes('://');
    if (looksLikeUrl) {
      return {
        ruleId: id,
        title: 'Open-Redirect Query Parameter',
        description: `The query parameter "${key}" contains what looks like another URL ("${value}"). This pattern is commonly abused to send victims through a trusted-looking domain before bouncing them to a malicious one.`,
        recommendation: 'Check where this parameter actually leads — the visible hostname may not be where you end up after the redirect.',
        severity: 'high',
      };
    }
  }

  return null;
}
