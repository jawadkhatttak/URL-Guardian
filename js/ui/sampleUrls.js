export const SAMPLE_URLS = [
  { label: 'paypal.com', url: 'https://www.paypal.com/signin', kind: 'safe' },
  { label: 'github.com', url: 'https://github.com/login', kind: 'safe' },
  { label: 'typosquat domain', url: 'http://www.paypa1.com/account/verify', kind: 'phish' },
  { label: 'IP address host', url: 'http://185.23.41.9/secure/login.php', kind: 'phish' },
  { label: 'link shortener', url: 'http://bit.ly/3xK9zQ', kind: 'phish' },
  { label: '"@" redirect trick', url: 'http://www.your-bank.com@malicious-capture.ru/login', kind: 'phish' },
  { label: 'homograph domain', url: 'http://аpple.com/id/verify', kind: 'phish' },
  { label: 'risky .exe link', url: 'http://update-flash-player.info/installer_2024.exe', kind: 'phish' },
];

export function renderSampleChips(els, onSelect) {
  els.sampleChips.innerHTML = SAMPLE_URLS.map(
    (s, i) => `<button type="button" class="chip" data-kind="${s.kind}" data-index="${i}">${s.label}</button>`
  ).join('');

  els.sampleChips.querySelectorAll('.chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sample = SAMPLE_URLS[Number(btn.dataset.index)];
      onSelect(sample.url);
    });
  });
}
