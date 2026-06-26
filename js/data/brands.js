/**
 * Curated list of frequently-impersonated brands.
 * `domain` is the brand's real registrable domain (used as the "this is the
 * legitimate owner" reference point). This is intentionally a short,
 * high-signal list rather than an exhaustive trademark database — broaden it
 * if you fork this for a specific threat landscape.
 */
export const KNOWN_BRANDS = [
  { name: 'paypal', domain: 'paypal.com' },
  { name: 'apple', domain: 'apple.com' },
  { name: 'microsoft', domain: 'microsoft.com' },
  { name: 'google', domain: 'google.com' },
  { name: 'amazon', domain: 'amazon.com' },
  { name: 'facebook', domain: 'facebook.com' },
  { name: 'instagram', domain: 'instagram.com' },
  { name: 'whatsapp', domain: 'whatsapp.com' },
  { name: 'netflix', domain: 'netflix.com' },
  { name: 'linkedin', domain: 'linkedin.com' },
  { name: 'bankofamerica', domain: 'bankofamerica.com' },
  { name: 'chase', domain: 'chase.com' },
  { name: 'wellsfargo', domain: 'wellsfargo.com' },
  { name: 'citibank', domain: 'citibank.com' },
  { name: 'hsbc', domain: 'hsbc.com' },
  { name: 'dhl', domain: 'dhl.com' },
  { name: 'fedex', domain: 'fedex.com' },
  { name: 'ups', domain: 'ups.com' },
  { name: 'usps', domain: 'usps.com' },
  { name: 'irs', domain: 'irs.gov' },
  { name: 'outlook', domain: 'outlook.com' },
  { name: 'office365', domain: 'office.com' },
  { name: 'coinbase', domain: 'coinbase.com' },
  { name: 'binance', domain: 'binance.com' },
  { name: 'steamcommunity', domain: 'steamcommunity.com' },
  { name: 'adobe', domain: 'adobe.com' },
  { name: 'dropbox', domain: 'dropbox.com' },
  { name: 'github', domain: 'github.com', alsoOwns: ['github.io'] },
  { name: 'dpd', domain: 'dpd.com' },
  { name: 'ebay', domain: 'ebay.com' },
];
