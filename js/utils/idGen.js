/**
 * Generates a reasonably unique ID without pulling in a uuid dependency.
 * Not cryptographically unique — fine for a client-side history list.
 */
export function generateId() {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 9);
  return `scan_${time}_${rand}`;
}
