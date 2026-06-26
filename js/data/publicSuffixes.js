/**
 * IMPORTANT — read before trusting this in anything beyond a portfolio demo:
 *
 * This is NOT the full Public Suffix List (that list has ~9,000+ entries and
 * is maintained at publicsuffix.org / shipped inside libraries like `tldts`,
 * `psl`, or `tld.js`). Pulling in one of those would mean either a bundler
 * step or a CDN <script> dependency, both of which conflict with this
 * project's "vanilla JS, no build tooling" brief.
 *
 * Instead this is a curated list of the multi-label suffixes you'll actually
 * encounter in phishing URLs and common legitimate traffic (co.uk, com.au,
 * github.io, etc.). For any suffix NOT in this list, the parser falls back to
 * "last label = TLD", which is correct for the overwhelming majority of
 * domains (.com, .net, .org, .tk, .xyz, .ru, ...) but WILL misclassify the
 * registrable domain for obscure ccTLD second-level domains we didn't list.
 *
 * If you take this further than a demo: swap this module for a real PSL
 * package pulled in through a bundler (Vite/esbuild) instead of trying to
 * hand-maintain suffix rules.
 */
export const MULTI_LABEL_SUFFIXES = new Set([
  // United Kingdom
  'co.uk', 'org.uk', 'me.uk', 'ltd.uk', 'plc.uk', 'net.uk', 'sch.uk', 'ac.uk', 'gov.uk', 'nhs.uk', 'police.uk',
  // Australia
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'asn.au', 'id.au',
  // New Zealand
  'co.nz', 'net.nz', 'org.nz', 'govt.nz', 'ac.nz',
  // Japan
  'co.jp', 'or.jp', 'ne.jp', 'ac.jp', 'go.jp',
  // South Korea
  'co.kr', 'or.kr', 'go.kr', 'ac.kr', 're.kr',
  // China
  'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'edu.cn',
  // India
  'co.in', 'net.in', 'org.in', 'gen.in', 'firm.in', 'ind.in',
  // Brazil
  'com.br', 'net.br', 'org.br', 'gov.br',
  // Mexico
  'com.mx', 'net.mx', 'org.mx', 'gob.mx',
  // South Africa
  'co.za', 'net.za', 'org.za', 'gov.za', 'web.za',
  // Singapore / Hong Kong / Taiwan / Indonesia
  'com.sg', 'net.sg', 'org.sg', 'com.hk', 'org.hk', 'com.tw', 'org.tw', 'co.id', 'or.id', 'go.id',
  // Turkey, Argentina, Pakistan (kept relevant to broader South-Asian traffic)
  'com.tr', 'org.tr', 'gov.tr', 'com.ar', 'org.ar', 'com.pk', 'net.pk', 'org.pk', 'edu.pk', 'gov.pk',
  // Europe
  'co.at', 'or.at', 'com.es', 'org.es', 'co.de',
  // Common "vanity TLD as a service" suffixes (these are registrable AT this level)
  'github.io', 'gitlab.io', 'pages.dev', 'netlify.app', 'vercel.app', 'web.app', 'herokuapp.com',
  'blogspot.com', 'wordpress.com', 'firebaseapp.com', 'azurewebsites.net', 'glitch.me',
]);
