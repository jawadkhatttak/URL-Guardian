import { URL_SHORTENERS } from '../data/shorteners.js';

export const id = 'URL_SHORTENER';

export function check(ctx) {
  if (!ctx.hostname) return null;

  const isShortener = URL_SHORTENERS.includes(ctx.hostname.toLowerCase());
  if (!isShortener) return null;

  return {
    ruleId: id,
    title: 'URL Shortener Detected',
    description: `"${ctx.hostname}" is a known link-shortening service. The visible link hides the actual destination domain until you click through.`,
    recommendation: 'Resolve the shortened link first (most browsers/extensions can preview the destination) before trusting or clicking it.',
    severity: 'medium',
  };
}
