#!/usr/bin/env node
/**
 * Regenerates js/data/publicSuffixList.js from a fresh copy of the real
 * Mozilla Public Suffix List (https://publicsuffix.org/list/).
 *
 * This is a build-time-only script. It is NOT part of the shipped app, is
 * never imported by any browser-facing code, and requires nothing beyond
 * plain Node (no npm install, no dependencies) — it just needs network
 * access to fetch the source list once.
 *
 * Usage (from the repo root):
 *   node scripts/generate-suffix-list.mjs
 *
 * Re-run this periodically (e.g. every few months) to pick up new entries
 * the real PSL has added since the last generation — this file is a static
 * snapshot, not a live feed, so it will not update itself.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'js', 'data', 'publicSuffixList.js');
const SOURCE_URL = 'https://raw.githubusercontent.com/publicsuffix/list/main/public_suffix_list.dat';

function toAscii(label) {
  // Route every entry through the real URL parser so punycode/Unicode PSL
  // entries end up in the exact ASCII form ctx.hostname will actually be in
  // at match time (the WHATWG URL parser always punycodes hostnames).
  try {
    return new URL(`http://${label}/`).hostname;
  } catch {
    return null;
  }
}

async function main() {
  console.log(`Fetching ${SOURCE_URL} ...`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch PSL source: HTTP ${res.status}`);
  }
  const raw = await res.text();
  const lines = raw.split('\n').map((l) => l.trim());

  const exact = [];
  const wildcards = [];
  const exceptions = [];

  for (const line of lines) {
    if (!line || line.startsWith('//')) continue;

    if (line.startsWith('!')) {
      const ascii = toAscii(line.slice(1));
      if (ascii) exceptions.push(ascii);
      continue;
    }

    if (line.startsWith('*.')) {
      const ascii = toAscii(line.slice(2));
      if (ascii) wildcards.push(ascii);
      continue;
    }

    const ascii = toAscii(line);
    if (ascii) exact.push(ascii);
  }

  const uniqSorted = (arr) => [...new Set(arr)].sort();

  const out = `/**
 * Auto-generated from the real Mozilla Public Suffix List
 * (https://publicsuffix.org/list/public_suffix_list.dat, MPL-2.0 licensed),
 * fetched via its official GitHub mirror. This is a static snapshot, not a
 * live feed — it will not pick up new suffixes added to the list after the
 * date below without manually re-running the generator script.
 *
 * Generated: ${new Date().toISOString().slice(0, 10)}
 *
 * Do not hand-edit this file — run \`node scripts/generate-suffix-list.mjs\`
 * from the repo root to regenerate it from a fresh copy of the list.
 *
 * All entries are stored pre-punycoded (ASCII form) since that's what
 * WHATWG URL.hostname always produces, which is what these get matched
 * against in js/core/parser.js.
 */

// Plain suffix rules, matched as an exact right-aligned label sequence.
export const EXACT_SUFFIXES = new Set(${JSON.stringify(uniqSorted(exact))});

// Wildcard rules ("*.ck" in the source list is stored here as "ck"): any
// single label followed by this fixed suffix is itself a valid public
// suffix — e.g. "*.ck" means "anything.ck" is a suffix, not just "ck".
export const WILDCARD_SUFFIXES = new Set(${JSON.stringify(uniqSorted(wildcards))});

// Exception rules carve a specific full label-sequence back OUT of a
// wildcard match — e.g. "!www.ck" means "www.ck" itself is NOT under the
// "*.ck" wildcard; its public suffix is just "ck".
export const EXCEPTION_SUFFIXES = new Set(${JSON.stringify(uniqSorted(exceptions))});
`;

  fs.writeFileSync(OUTPUT_PATH, out);
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`exact: ${exact.length}, wildcards: ${wildcards.length}, exceptions: ${exceptions.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
