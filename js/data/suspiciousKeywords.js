/**
 * Keywords that show up disproportionately often in phishing HOSTNAMES
 * (not paths — "verify" in /verify-account is normal app routing; "verify"
 * baked into the hostname like secure-verify-paypal.tk is not).
 */
export const SUSPICIOUS_HOSTNAME_KEYWORDS = [
  'secure',
  'verify',
  'verification',
  'account',
  'update',
  'confirm',
  'signin',
  'login',
  'logon',
  'banking',
  'billing',
  'suspend',
  'suspended',
  'alert',
  'security',
  'support',
  'recover',
  'recovery',
  'unlock',
  'validate',
  'validation',
  'authenticate',
  'password',
  'wallet',
  'invoice',
  'payment',
  'webscr',
  'service',
];
