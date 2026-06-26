import * as ipAddress from './ipAddress.js';
import * as shortener from './shortener.js';
import * as protocolCheck from './protocolCheck.js';
import * as urlLength from './urlLength.js';
import * as subdomainAbuse from './subdomainAbuse.js';
import * as suspiciousKeywords from './suspiciousKeywords.js';
import * as brandImpersonation from './brandImpersonation.js';
import * as punycode from './punycode.js';
import * as unicode from './unicode.js';
import * as homograph from './homograph.js';
import * as levenshteinBrand from './levenshteinBrand.js';
import * as entropy from './entropy.js';
import * as redirectPatterns from './redirectPatterns.js';
import * as portDetection from './portDetection.js';
import * as fileExtension from './fileExtension.js';
import * as dangerousProtocol from './dangerousProtocol.js';

/**
 * Adding a new rule = write a module exporting { id, check } and add it here.
 * Nothing else in the app needs to change — analyzer.js just iterates this list.
 */
export const RULES = [
  dangerousProtocol,
  ipAddress,
  shortener,
  protocolCheck,
  urlLength,
  subdomainAbuse,
  suspiciousKeywords,
  brandImpersonation,
  punycode,
  unicode,
  homograph,
  levenshteinBrand,
  entropy,
  redirectPatterns,
  portDetection,
  fileExtension,
];
