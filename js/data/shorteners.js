/**
 * Known URL-shortener hostnames. Shorteners aren't malicious by themselves,
 * but they hide the real destination, which is exactly what phishing
 * campaigns want — so detection here is a "reduce trust, look closer" signal
 * rather than a verdict.
 */
export const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'adf.ly',
  'bl.ink',
  'cutt.ly',
  'rebrand.ly',
  'shorte.st',
  'tiny.cc',
  'soo.gd',
  's.id',
  'lnkd.in',
  'rb.gy',
  'v.gd',
  'qr.ae',
  'tr.im',
  'x.co',
  'shorturl.at',
  'db.tt',
  'po.st',
  'clck.ru',
  'shrtco.de',
  'gg.gg',
  '0rz.tw',
  'vzturl.com',
];
