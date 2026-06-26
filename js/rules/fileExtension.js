import { RISKY_EXTENSIONS } from '../data/riskyExtensions.js';

export const id = 'RISKY_FILE_EXTENSION';

const SEVERITY_EXPLANATION = {
  critical: 'This extension can execute code immediately when opened.',
  high: 'This extension can run as an active script in some contexts.',
  medium: 'This extension can carry macros capable of running code on open.',
  low: 'Archive formats can hide executable content from a quick glance.',
};

function getExtension(pathname) {
  const lastSegment = pathname.split('/').filter(Boolean).pop() || '';
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex === lastSegment.length - 1) return '';
  return lastSegment.slice(dotIndex + 1).toLowerCase();
}

export function check(ctx) {
  const ext = getExtension(ctx.pathname || '');
  if (!ext) return null;

  for (const [severity, list] of Object.entries(RISKY_EXTENSIONS)) {
    if (list.includes(ext)) {
      return {
        ruleId: id,
        title: 'Risky File Extension in URL',
        description: `This URL points directly at a ".${ext}" file. ${SEVERITY_EXPLANATION[severity]}`,
        recommendation: 'Do not download or open this file unless you fully trust the source, and scan it before opening even then.',
        severity,
      };
    }
  }

  return null;
}
