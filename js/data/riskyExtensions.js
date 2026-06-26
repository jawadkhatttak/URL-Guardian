/**
 * File extensions at the end of a URL's path, grouped by how dangerous the
 * payload typically is if a victim downloads and runs it.
 */
export const RISKY_EXTENSIONS = {
  critical: ['exe', 'scr', 'bat', 'cmd', 'com', 'pif', 'msi', 'jar', 'vbs', 'ps1', 'apk'],
  high: ['js', 'jse', 'wsf', 'hta', 'cpl', 'msc'],
  medium: ['docm', 'xlsm', 'pptm', 'dotm', 'xlsb'],
  low: ['zip', 'rar', '7z', 'iso', 'dmg', 'img'],
};
