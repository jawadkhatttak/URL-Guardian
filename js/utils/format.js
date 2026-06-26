/** Escape text before injecting into innerHTML to prevent the dashboard itself
 *  from becoming an XSS vector when rendering an attacker-controlled URL. */
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function truncate(str, max = 60) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

export function formatTimestamp(isoOrMs) {
  const date = new Date(isoOrMs);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
