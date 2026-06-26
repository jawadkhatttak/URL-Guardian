import { MULTI_LABEL_SUFFIXES } from '../data/publicSuffixes.js';

const SCHEME_PREFIX_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
// Captures: 1=scheme, 2=userinfo (the "@" trick target), 3=host, 4=port
// Host alternation tries a bracketed IPv6 literal first ([2001:db8::1]) since
// plain [^:]+ would otherwise stop at the first colon inside the brackets.
const RAW_AUTHORITY_RE = /^([a-zA-Z][a-zA-Z0-9+.-]*:)\/\/(?:([^/?#@]*)@)?(\[[0-9a-fA-F:]+\]|[^/?#@:]+)(?::(\d+))?/;

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
// Deliberately permissive (not a strict RFC4291 validator) — good enough to
// flag "this is an IPv6 literal" for the host-type rules.
const IPV6_LOOSE_RE = /^\[?[0-9a-fA-F:]+\]?$/;

function isIPv4(host) {
  const match = host.match(IPV4_RE);
  if (!match) return false;
  return match.slice(1).every((octet) => Number(octet) <= 255);
}

function isIPv6(host) {
  const stripped = host.replace(/^\[/, '').replace(/\]$/, '');
  return stripped.includes(':') && IPV6_LOOSE_RE.test(host);
}

/**
 * Splits a hostname into { subdomain, registeredDomain, tld } using the
 * curated suffix list. Falls back to "last label is the TLD" for anything
 * not in that list (see publicSuffixes.js for the honest caveat on this).
 */
function splitDomain(hostname) {
  const labels = hostname.split('.').filter(Boolean);
  if (labels.length <= 1) {
    return { subdomain: '', registeredDomain: hostname, tld: '' };
  }

  // Try the longest known multi-label suffix first (3-label, then 2-label).
  for (let suffixLen = 3; suffixLen >= 1; suffixLen--) {
    if (labels.length <= suffixLen) continue;
    const candidate = labels.slice(-suffixLen).join('.');
    if (suffixLen === 1 || MULTI_LABEL_SUFFIXES.has(candidate)) {
      const remaining = labels.slice(0, labels.length - suffixLen);
      if (remaining.length === 0) {
        return { subdomain: '', registeredDomain: hostname, tld: candidate };
      }
      const registeredLabel = remaining[remaining.length - 1];
      const subdomainLabels = remaining.slice(0, -1);
      return {
        subdomain: subdomainLabels.join('.'),
        registeredDomain: `${registeredLabel}.${candidate}`,
        tld: candidate,
      };
    }
  }

  // Should be unreachable given suffixLen === 1 always matches, kept as a safety net.
  const tld = labels[labels.length - 1];
  const registeredLabel = labels[labels.length - 2];
  return {
    subdomain: labels.slice(0, -2).join('.'),
    registeredDomain: `${registeredLabel}.${tld}`,
    tld,
  };
}

/**
 * Parses a raw, possibly messy, user-supplied URL string.
 *
 * Returns either:
 *   { error: string, raw: string }                       — unparseable input
 *   { ...full parsed context object... }                 — success
 */
export function parseUrl(rawInputUntrimmed) {
  const raw = (rawInputUntrimmed || '').trim();
  if (!raw) {
    return { error: 'Please enter a URL to analyze.', raw };
  }

  // Only prepend a scheme if none exists at all — never mask an existing
  // (possibly dangerous) scheme like javascript: or data: by rewriting it.
  const normalizedInput = SCHEME_PREFIX_RE.test(raw) ? raw : `http://${raw}`;

  // Grab the host BEFORE the URL constructor gets a chance to punycode-encode
  // it. This is the only place in the app that still sees literal Unicode
  // characters the way an attacker typed/pasted them.
  const rawMatch = normalizedInput.match(RAW_AUTHORITY_RE);
  const rawUserinfo = rawMatch ? rawMatch[2] || '' : '';
  const rawHostBracketed = rawMatch ? rawMatch[3] || '' : '';
  const rawHost = rawHostBracketed.replace(/^\[/, '').replace(/\]$/, '');

  let urlObj;
  try {
    urlObj = new URL(normalizedInput);
  } catch (err) {
    return { error: 'That doesn\'t parse as a valid URL.', raw };
  }

  const protocol = urlObj.protocol; // includes trailing ':'
  let hostname = urlObj.hostname; // ASCII/punycode form, may be '' for javascript:/data:
  const isBracketedV6 = hostname.startsWith('[') && hostname.endsWith(']');
  const hostnameNoBrackets = isBracketedV6 ? hostname.slice(1, -1) : hostname;

  const ipv4 = isIPv4(hostnameNoBrackets);
  const ipv6 = isBracketedV6 || isIPv6(hostnameNoBrackets);
  const isIpHost = ipv4 || ipv6;

  let subdomain = '';
  let registeredDomain = hostnameNoBrackets;
  let tld = '';
  if (hostname && !isIpHost) {
    const split = splitDomain(hostnameNoBrackets);
    subdomain = split.subdomain;
    registeredDomain = split.registeredDomain;
    tld = split.tld;
  }

  const port = urlObj.port || (protocol === 'https:' ? '443' : protocol === 'http:' ? '80' : '');
  const explicitPort = urlObj.port; // '' means "not explicitly specified in the URL"

  return {
    error: null,
    raw,
    normalizedInput,
    href: urlObj.href,
    protocol,
    hostname: hostnameNoBrackets,
    rawHostname: rawHost, // pre-punycode, literal characters as typed
    rawUserinfo, // text before '@' in the authority, if any
    isIpHost,
    ipVersion: ipv6 ? 'v6' : ipv4 ? 'v4' : null,
    subdomain,
    subdomainLabels: subdomain ? subdomain.split('.').filter(Boolean) : [],
    registeredDomain,
    tld,
    port,
    explicitPort,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
    fullLength: raw.length,
    labels: hostnameNoBrackets ? hostnameNoBrackets.split('.').filter(Boolean) : [],
  };
}
