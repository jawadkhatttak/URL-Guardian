import { escapeHTML } from '../utils/format.js';
import { animateScore } from './scoreRing.js';

const RISK_LABELS = {
  SAFE: 'SAFE',
  LOW: 'LOW RISK',
  MEDIUM: 'MEDIUM RISK',
  HIGH: 'HIGH RISK',
  CRITICAL: 'CRITICAL RISK',
};

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
const INFO_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg>`;

function detailCell(label, value, { muted = false } = {}) {
  const isEmpty = value === '' || value === null || value === undefined;
  const display = isEmpty ? '—' : value;
  const mutedClass = muted || isEmpty ? 'is-muted' : '';
  return `
    <div class="detail-cell">
      <div class="detail-label">${label}</div>
      <div class="detail-value ${mutedClass}">${escapeHTML(display)}</div>
    </div>`;
}

export function renderDetails(els, d) {
  const portValue = d.explicitPort
    ? d.explicitPort
    : d.port
      ? `${d.port} (default)`
      : 'n/a';

  const tldValue = d.tld || (d.isIpHost ? 'n/a (IP host)' : '');

  const cells = [
    detailCell('Protocol', (d.protocol || '').replace(':', '')),
    detailCell('Hostname', d.hostname),
    detailCell('Registered Domain', d.registeredDomain),
    detailCell('Subdomain', d.subdomain),
    detailCell('TLD', tldValue),
    detailCell('Port', portValue, { muted: !d.explicitPort }),
    detailCell('URL Length', `${d.urlLength} chars`),
  ];

  els.detailsGrid.innerHTML = cells.join('');
}

export function renderFindings(els, findings, suppressedFindings = []) {
  els.findingsCount.textContent = String(findings.length);

  if (findings.length === 0) {
    els.findingsList.innerHTML = `
      <div class="no-findings">${CHECK_ICON}<span>No phishing indicators triggered by this rule set.</span></div>`;
    return;
  }

  const cards = findings
    .map(
      (f, i) => `
    <div class="finding-card" data-severity="${f.severity}" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <div class="finding-head">
        <span class="severity-badge">${escapeHTML(f.severity)}</span>
        <span class="finding-title">${escapeHTML(f.title)}</span>
      </div>
      <p class="finding-desc">${escapeHTML(f.description)}</p>
      <p class="finding-rec">${INFO_ICON}<span>${escapeHTML(f.recommendation)}</span></p>
    </div>`
    )
    .join('');

  const suppressedNote =
    suppressedFindings.length > 0
      ? `<div class="suppressed-note">${suppressedFindings.length} related finding${
          suppressedFindings.length > 1 ? 's' : ''
        } suppressed to avoid double-counting an overlapping signal.</div>`
      : '';

  els.findingsList.innerHTML = cards + suppressedNote;
}

export function renderResult(els, result) {
  els.emptyState.hidden = true;
  els.dashboard.hidden = false;

  // Restart the fade-in animation even if the dashboard was already visible.
  els.dashboard.classList.remove('is-visible');
  requestAnimationFrame(() => els.dashboard.classList.add('is-visible'));

  els.dashboard.dataset.level = result.level;
  els.riskBadge.textContent = RISK_LABELS[result.level] ?? result.level;
  els.recommendationText.textContent = result.recommendation;

  animateScore({ gaugeEl: els.gaugeProgress, numberEl: els.scoreNumber, score: result.score });

  renderDetails(els, result.details);
  renderFindings(els, result.findings, result.suppressedFindings);
}

export function showInputError(els, message) {
  els.inputError.textContent = message;
  els.inputError.classList.add('visible');
}

export function clearInputError(els) {
  els.inputError.textContent = '';
  els.inputError.classList.remove('visible');
}
